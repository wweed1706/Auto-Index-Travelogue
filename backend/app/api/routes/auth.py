from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError
from starlette.concurrency import run_in_threadpool

from app.core.security import DUMMY_PASSWORD_HASH, create_access_token, hash_password, verify_password
from app.db.mongodb import get_database
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])
Database = Annotated[AsyncIOMotorDatabase[dict[str, object]], Depends(get_database)]


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    return current_user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, database: Database) -> UserResponse:
    if await database.users.find_one({"email": payload.email}, {"_id": 1}):
        raise HTTPException(status_code=400, detail="Email already registered")
    # Bcrypt chạy trong threadpool để không chặn event loop.
    hashed_password = await run_in_threadpool(hash_password, payload.password.get_secret_value())
    document = {
        "email": str(payload.email),
        "hashed_password": hashed_password,
        "name": payload.name,
        "avatar": None,
    }
    try:
        result = await database.users.insert_one(document)
    except DuplicateKeyError:
        # Unique index bảo vệ cả khi hai request đăng ký đến đồng thời.
        raise HTTPException(status_code=400, detail="Email already registered") from None
    return UserResponse(id=str(result.inserted_id), email=payload.email, name=payload.name, avatar=None)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, database: Database) -> Token:
    user = await database.users.find_one({"email": payload.email})
    stored_hash = user.get("hashed_password") if user else None
    hashed_password = stored_hash if isinstance(stored_hash, str) else DUMMY_PASSWORD_HASH
    valid = await run_in_threadpool(verify_password, payload.password.get_secret_value(), hashed_password)
    if user is None or not isinstance(stored_hash, str) or not valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(str(user["_id"])))
