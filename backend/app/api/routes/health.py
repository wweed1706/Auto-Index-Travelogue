from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Process liveness; database connectivity is checked during startup."""
    return HealthResponse(status="success", data={"service": "running"})
