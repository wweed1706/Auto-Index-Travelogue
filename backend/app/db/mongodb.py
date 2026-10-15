from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import Request

from app.core.config import Settings


def get_database(request: Request) -> AsyncIOMotorDatabase[dict[str, object]]:
    return request.app.state.database


@asynccontextmanager
async def connect_mongodb(
    settings: Settings,
) -> AsyncIterator[AsyncIOMotorDatabase[dict[str, object]]]:
    client: AsyncIOMotorClient[dict[str, object]] = AsyncIOMotorClient(
        settings.MONGODB_URL.get_secret_value(),
        serverSelectionTimeoutMS=5000,
        tz_aware=True,
    )
    try:
        # Ping buộc xác minh kết nối trước khi ứng dụng nhận request.
        await client.admin.command("ping")
        yield client[settings.MONGODB_DB_NAME]
    finally:
        client.close()
