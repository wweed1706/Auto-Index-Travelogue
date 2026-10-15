"""Integration tests: run inside the backend container with access to MongoDB."""
import json
import os
import subprocess
import sys
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from jose import JWTError, jwt
from bson import ObjectId
from pymongo import MongoClient

from app.core.security import ALGORITHM, hash_password, verify_password


class AuthIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.database_name = 'auth_test_' + uuid4().hex
        cls.mongo = MongoClient(os.environ['MONGODB_URL'])
        cls.database = cls.mongo[cls.database_name]
        cls.addClassCleanup(cls.mongo.close)
        cls.addClassCleanup(cls.mongo.drop_database, cls.database_name)
        env = dict(os.environ, MONGODB_DB_NAME=cls.database_name, ACCESS_TOKEN_EXPIRE_MINUTES='30')
        cls.server = subprocess.Popen(
            [sys.executable, '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8001'],
            env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        cls.addClassCleanup(cls.stop_server)
        for _ in range(100):
            try:
                with urlopen('http://127.0.0.1:8001/api/health', timeout=1):
                    return
            except (URLError, TimeoutError):
                if cls.server.poll() is not None:
                    raise RuntimeError('Test server failed to start')
                time.sleep(0.1)
        raise RuntimeError('Test server startup timed out')

    @classmethod
    def stop_server(cls):
        cls.server.terminate()
        try:
            cls.server.wait(timeout=10)
        except subprocess.TimeoutExpired:
            cls.server.kill()
            cls.server.wait()

    def post(self, route, data):
        request = Request('http://127.0.0.1:8001/api/auth/' + route,
                          data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
        try:
            response = urlopen(request, timeout=15)
        except HTTPError as error:
            response = error
        with response:
            return response.status, json.load(response), response.headers

    def journey_request(self, method, path='', token=None, data=None):
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = 'Bearer ' + token
        request = Request('http://127.0.0.1:8001/api/journeys' + path,
                          method=method, headers=headers,
                          data=json.dumps(data).encode() if data is not None else None)
        try:
            response = urlopen(request, timeout=15)
        except HTTPError as error:
            response = error
        with response:
            raw = response.read()
            return response.status, json.loads(raw) if raw else None

    def new_account(self):
        credentials = {'email': uuid4().hex + '@example.com', 'password': 'journey-test-password'}
        code, user, _ = self.post('register', credentials)
        self.assertEqual(code, 201)
        code, token, _ = self.post('login', credentials)
        self.assertEqual(code, 200)
        return user, token['access_token']

    def test_journeys_ownership_and_crud(self):
        owner, token = self.new_account()
        other, other_token = self.new_account()
        payload = {'title': 'Da Lat',
                   'location': {'name': 'Da Lat', 'lat': 11.94, 'lng': 108.44,
                                'address': 'Da Lat, Vietnam', 'placeId': 'mock:dalat'},
                   'date': '2026-10-15',
                   'media': [{'id': 'photo-1', 'url': 'https://example.com/photo.jpg',
                              'name': 'photo.jpg', 'type': 'image', 'mimeType': 'image/jpeg',
                              'sizeBytes': 123}],
                   'coordinates': {'latitude': 11.94, 'longitude': 108.44}}
        code, first = self.journey_request('POST', token=token, data=payload)
        self.assertEqual(code, 201)
        self.assertEqual(first['user_id'], owner['id'])
        self.assertEqual(first['media'][0]['kind'], 'image')
        stored = self.database.journeys.find_one({'_id': ObjectId(first['id'])})
        self.assertEqual(stored['user_id'], ObjectId(owner['id']))
        self.assertIsInstance(stored['user_id'], ObjectId)
        self.assertEqual(stored['location']['placeId'], 'mock:dalat')
        self.assertEqual(first['coordinates'], {'latitude': 11.94, 'longitude': 108.44})
        self.assertEqual(self.journey_request('GET', '/' + first['id'], token), (200, first))
        for method in ('GET', 'DELETE'):
            self.assertEqual(self.journey_request(method, '/' + first['id'], other_token)[0], 404)
        self.assertEqual(self.journey_request('GET', token=other_token), (200, []))
        code, second = self.journey_request('POST', token=token, data={**payload, 'title': 'Second'})
        self.assertEqual(code, 201)
        code, own_list = self.journey_request('GET', token=token)
        self.assertEqual(code, 200)
        self.assertEqual([item['id'] for item in own_list], [second['id'], first['id']])
        self.assertEqual(self.journey_request('GET', '?skip=1&limit=1', token), (200, [first]))
        self.assertEqual(self.journey_request('DELETE', '/' + first['id'], token), (204, None))
        self.assertEqual(self.journey_request('GET', '/' + first['id'], token)[0], 404)
        self.assertEqual(self.journey_request('DELETE', '/' + first['id'], token)[0], 404)
        self.assertEqual(self.journey_request('GET', '/' + second['id'], token)[0], 200)

    def test_journeys_auth_ids_and_input(self):
        _, token = self.new_account()
        valid = {'title': 'Trip',
                 'location': {'name': 'Vietnam', 'lat': 16.0, 'lng': 108.0},
                 'date': '2026-10-15'}
        for method, path, data in [('POST', '', valid), ('GET', '', None),
                                   ('GET', '/bad-id', None), ('DELETE', '/bad-id', None)]:
            for bad_token in (None, 'bad-token'):
                self.assertEqual(self.journey_request(method, path, bad_token, data)[0], 401)
        for method in ('GET', 'DELETE'):
            self.assertEqual(self.journey_request(method, '/bad-id', token)[0], 400)
            self.assertEqual(self.journey_request(method, '/' + str(ObjectId()), token)[0], 404)
        for extra in ({'user_id': str(ObjectId())}, {'ownerId': str(ObjectId())},
                      {'id': str(ObjectId())}, {'createdAt': '2000-01-01T00:00:00Z'},
                      {'title': '  '}, {'date': 'not-a-date'},
                      {'location': {'name': 'Invalid', 'lat': 91, 'lng': 0}},
                      {'coordinates': {'latitude': 91, 'longitude': 0}}):
            self.assertEqual(self.journey_request('POST', token=token, data={**valid, **extra})[0], 422)
        for query in ('?skip=-1', '?limit=0', '?limit=101'):
            self.assertEqual(self.journey_request('GET', query, token)[0], 422)

    def test_journey_update_schema(self):
        from pydantic import ValidationError
        from app.schemas.journey import JourneyUpdate, MediaItem
        self.assertEqual(JourneyUpdate().model_dump(exclude_unset=True), {})
        self.assertEqual(JourneyUpdate(coordinates=None).model_dump(exclude_unset=True), {'coordinates': None})
        for payload in ({'title': None}, {'user_id': str(ObjectId())}, {'date': 'invalid'}):
            with self.assertRaises(ValidationError):
                JourneyUpdate(**payload)
        with self.assertRaises(ValidationError):
            MediaItem(id='x', url='javascript:alert(1)', name='x', kind='image', mimeType='image/jpeg', sizeBytes=0)

    def test_register_login_storage_and_token(self):
        email = uuid4().hex + '@example.com'
        payload = {'email': email.upper(), 'password': 'safe-test-password', 'name': 'Test User'}
        code, user, _ = self.post('register', payload)
        self.assertEqual(code, 201)
        self.assertEqual(set(user), {'id', 'email', 'name', 'avatar'})
        self.assertEqual(user['email'], email)
        stored = self.database.users.find_one({'email': email})
        self.assertNotIn('password', stored)
        self.assertNotEqual(stored['hashed_password'], payload['password'])
        self.assertTrue(verify_password(payload['password'], stored['hashed_password']))
        self.assertEqual(self.post('register', dict(payload, email=email))[0], 400)
        code, token, _ = self.post('login', payload)
        self.assertEqual(code, 200)
        self.assertEqual(token['token_type'], 'bearer')
        claims = jwt.decode(token['access_token'], os.environ['JWT_SECRET'], algorithms=[ALGORITHM])
        self.assertEqual(claims['sub'], user['id'])
        self.assertEqual(claims['exp'] - claims['iat'], 1800)
        self.assertGreater(claims['exp'], datetime.now(timezone.utc).timestamp())
        claims['exp'] = 1
        expired = jwt.encode(claims, os.environ['JWT_SECRET'], algorithm=ALGORITHM)
        with self.assertRaises(JWTError):
            jwt.decode(expired, os.environ['JWT_SECRET'], algorithms=[ALGORITHM])
        wrong = self.post('login', dict(payload, password='incorrect'))
        absent = self.post('login', dict(payload, email=uuid4().hex + '@example.com'))
        self.assertEqual(wrong[0], 401)
        self.assertEqual(absent[0], 401)
        self.assertEqual(wrong[1], absent[1])
        self.assertEqual(wrong[2]['WWW-Authenticate'], 'Bearer')

    def test_invalid_input_does_not_echo_password(self):
        for changes in ({'email': 'invalid'}, {'password': 'z9Q2x'},
                        {'password': 'a' * 73}, {'password': '\u00e9' * 37}, {'password': 'abc\x00defghi'}):
            payload = dict({'email': 'validation@example.com', 'password': 'private-test-value'}, **changes)
            code, body, _ = self.post('register', payload)
            self.assertEqual(code, 422)
            self.assertNotIn(payload['password'], json.dumps(body))
            self.assertTrue(all('input' not in error for error in body['detail']))

    def test_concurrent_registration(self):
        email = uuid4().hex + '@example.com'
        payload = {'email': email, 'password': 'concurrent-test-password'}
        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(lambda _: self.post('register', payload)[0], range(2)))
        self.assertEqual(sorted(results), [201, 400])
        self.assertEqual(self.database.users.count_documents({'email': email}), 1)

    def test_bcrypt_limits_and_salts(self):
        password = '\u00e9' * 36
        first = hash_password(password)
        self.assertNotEqual(first, hash_password(password))
        self.assertTrue(verify_password(password, first))
        self.assertFalse(verify_password(password + 'x', first))
        self.assertFalse(verify_password('password', 'invalid-hash'))

    def test_me_checks_token_and_database_user(self):
        email = uuid4().hex + '@example.com'
        credentials = {'email': email, 'password': 'protected-user-password'}
        _, user, _ = self.post('register', credentials)
        _, token, _ = self.post('login', credentials)
        access_token = token['access_token']

        def me(value=None, scheme='Bearer'):
            headers = {'Authorization': scheme + ' ' + value} if value else {}
            request = Request('http://127.0.0.1:8001/api/auth/me', headers=headers)
            try:
                response = urlopen(request, timeout=15)
            except HTTPError as error:
                response = error
            with response:
                return response.status, json.load(response)

        self.assertEqual(me(access_token), (200, user))
        claims = jwt.decode(access_token, os.environ['JWT_SECRET'], algorithms=[ALGORITHM])
        invalid_tokens = [None, 'not-a-jwt',
                          jwt.encode(claims, 'wrong-signing-secret', algorithm=ALGORITHM)]
        for modified in ({**claims, 'exp': 1}, {**claims, 'exp': None},
                         {**claims, 'sub': 'bad-id'},
                         {**claims, 'sub': str(ObjectId())},
                         {k: v for k, v in claims.items() if k != 'exp'},
                         {k: v for k, v in claims.items() if k != 'sub'}):
            invalid_tokens.append(jwt.encode(modified, os.environ['JWT_SECRET'], algorithm=ALGORITHM))
        for value in invalid_tokens:
            self.assertEqual(me(value)[0], 401)
        self.assertEqual(me(access_token, 'Basic')[0], 401)
        self.database.users.delete_one({'_id': ObjectId(user['id'])})
        self.assertEqual(me(access_token)[0], 401)


if __name__ == '__main__':
    unittest.main(verbosity=2)
