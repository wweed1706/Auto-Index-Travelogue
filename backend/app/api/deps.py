from typing import Annotated

from bson import ObjectId
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import get_settings
from app.core.security import ALGORITHM
from app.db.mongodb import get_database
from app.schemas.user import UserResponse

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    database: Annotated[AsyncIOMotorDatabase[dict[str, object]], Depends(get_database)],
) -> UserResponse:
    unauthorized = HTTPException(
        status_code=401, detail="Invalid or expired access token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        payload = jwt.decode(
            credentials.credentials, get_settings().JWT_SECRET.get_secret_value(),
            algorithms=[ALGORITHM],
            options={"require_exp": True, "require_sub": True, "verify_exp": True},
        )
    except (JWTError, TypeError, ValueError):
        raise unauthorized from None
    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not ObjectId.is_valid(user_id):
        raise unauthorized
    user = await database.users.find_one(
        {"_id": ObjectId(user_id)},
        {"_id": 1, "email": 1, "name": 1, "avatar": 1},
    )
    if user is None:
        raise unauthorized
    return UserResponse.model_validate({
        "id": str(user["_id"]), "email": user["email"],
        "name": user.get("name"), "avatar": user.get("avatar"),
    })
