from datetime import date as Date, datetime
from typing import Annotated, Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, HttpUrl, StringConstraints, model_validator

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Tag = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)]


class Coordinates(BaseModel):
    model_config = ConfigDict(extra="forbid")
    latitude: float = Field(ge=-90, le=90, allow_inf_nan=False)
    longitude: float = Field(ge=-180, le=180, allow_inf_nan=False)


class MediaItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(min_length=1, max_length=100)
    url: HttpUrl
    name: str = Field(min_length=1, max_length=255)
    kind: Literal["image", "video", "audio"] = Field(validation_alias=AliasChoices("kind", "type"))
    mimeType: str = Field(min_length=1, max_length=100)
    sizeBytes: int = Field(ge=0)
    takenAt: datetime | None = None
    tags: list[Tag] = Field(default_factory=list, max_length=50)
    location: str | None = Field(default=None, max_length=300)


class JourneyCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Title
    location: str = Field(min_length=1, max_length=300)
    date: Date
    notes: str = Field(default="", max_length=20000)
    tags: list[Tag] = Field(default_factory=list, max_length=50)
    media: list[MediaItem] = Field(default_factory=list, max_length=40)
    coordinates: Coordinates | None = None
    summary: str = Field(default="", max_length=5000)


class JourneyUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Title | None = None
    location: str | None = Field(default=None, min_length=1, max_length=300)
    date: Date | None = None
    notes: str | None = Field(default=None, max_length=20000)
    tags: list[Tag] | None = Field(default=None, max_length=50)
    media: list[MediaItem] | None = Field(default=None, max_length=40)
    coordinates: Coordinates | None = None
    summary: str | None = Field(default=None, max_length=5000)

    @model_validator(mode="after")
    def reject_null_required_fields(self) -> "JourneyUpdate":
        # Bỏ qua trường chưa gửi; chỉ coordinates được phép xóa bằng null.
        for field in self.model_fields_set - {"coordinates"}:
            if getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        return self


class JourneyResponse(JourneyCreate):
    id: str
    user_id: str
    createdAt: datetime
    updatedAt: datetime
