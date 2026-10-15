from datetime import datetime, timezone
from typing import Annotated

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.db.mongodb import get_database
from app.schemas.journey import JourneyCreate, JourneyResponse
from app.schemas.user import UserResponse

router = APIRouter(prefix="/journeys", tags=["journeys"])
Database = Annotated[AsyncIOMotorDatabase[dict[str, object]], Depends(get_database)]
CurrentUser = Annotated[UserResponse, Depends(get_current_user)]


def parse_journey_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid journey ID") from None


def journey_response(document: dict[str, object]) -> JourneyResponse:
    data = {key: value for key, value in document.items() if key != "_id"}
    data["id"] = str(document["_id"])
    data["user_id"] = str(document["user_id"])
    return JourneyResponse.model_validate(data)


@router.post("", response_model=JourneyResponse, status_code=status.HTTP_201_CREATED)
async def create_journey(
    payload: JourneyCreate, current_user: CurrentUser, database: Database,
) -> JourneyResponse:
    now = datetime.now(timezone.utc)
    # BSON lưu datetime đến mili giây; POST và GET phải trả cùng timestamp.
    now = now.replace(microsecond=(now.microsecond // 1000) * 1000)
    document = payload.model_dump(mode="json")
    # Quyền sở hữu chỉ lấy từ JWT đã xác thực, không nhận từ body.
    document.update({"user_id": ObjectId(current_user.id), "createdAt": now, "updatedAt": now})
    result = await database.journeys.insert_one(document)
    document["_id"] = result.inserted_id
    return journey_response(document)


@router.get("", response_model=list[JourneyResponse])
async def list_journeys(
    current_user: CurrentUser, database: Database,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
) -> list[JourneyResponse]:
    cursor = database.journeys.find({"user_id": ObjectId(current_user.id)})
    documents = await cursor.sort([("createdAt", -1), ("_id", -1)]).skip(skip).limit(limit).to_list(length=limit)
    return [journey_response(document) for document in documents]


@router.get("/{journey_id}", response_model=JourneyResponse)
async def get_journey(
    journey_id: str, current_user: CurrentUser, database: Database,
) -> JourneyResponse:
    document = await database.journeys.find_one({
        "_id": parse_journey_id(journey_id), "user_id": ObjectId(current_user.id),
    })
    if document is None:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey_response(document)


@router.delete("/{journey_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journey(
    journey_id: str, current_user: CurrentUser, database: Database,
) -> Response:
    # Lọc chủ sở hữu ngay trong thao tác xóa để tránh race giữa kiểm tra và xóa.
    result = await database.journeys.delete_one({
        "_id": parse_journey_id(journey_id), "user_id": ObjectId(current_user.id),
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journey not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
