from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: Literal["success"]
    data: dict[str, str]
