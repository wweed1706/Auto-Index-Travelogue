from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel, HttpUrl

from app.api.deps import get_current_user
from app.schemas.user import UserResponse
from app.services.cloudinary_service import upload_file

router = APIRouter(tags=["upload"])


class UploadResponse(BaseModel):
    url: HttpUrl
    public_id: str
    resource_type: Literal["image", "video"]


@router.post("/upload", response_model=UploadResponse)
async def upload_media(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
    file: UploadFile = File(...),
) -> dict[str, str]:
    try:
        return await upload_file(file)
    finally:
        await file.close()
