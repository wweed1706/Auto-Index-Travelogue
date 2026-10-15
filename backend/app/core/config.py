from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "Auto-Index Travelogue"
    MONGODB_URL: SecretStr
    MONGODB_DB_NAME: str = Field(default="auto_index_travelogue", min_length=1)
    JWT_SECRET: SecretStr = Field(min_length=32)
    CLOUDINARY_URL: SecretStr = SecretStr("")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, gt=0, le=1440)
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    @field_validator("MONGODB_URL")
    @classmethod
    def validate_mongodb_url(cls, value: SecretStr) -> SecretStr:
        if not value.get_secret_value().startswith(("mongodb://", "mongodb+srv://")):
            raise ValueError("MONGODB_URL must use mongodb:// or mongodb+srv://")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
