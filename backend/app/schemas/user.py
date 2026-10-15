from typing import Literal

from pydantic import BaseModel, EmailStr, Field, SecretStr, field_validator


class UserLogin(BaseModel):
    email: EmailStr
    password: SecretStr = Field(min_length=1, max_length=72)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: SecretStr) -> SecretStr:
        password = value.get_secret_value()
        if len(password.encode("utf-8")) > 72 or "\x00" in password:
            raise ValueError("Password must be at most 72 UTF-8 bytes and contain no null character")
        return value


class UserCreate(UserLogin):
    password: SecretStr = Field(min_length=8, max_length=72)
    name: str | None = Field(default=None, max_length=100)


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str | None = None
    avatar: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
