from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request

from app.api.routes import api_router
from app.api.routes.auth import router as auth_router
from app.api.routes.journeys import router as journeys_router
from app.api.routes.upload import router as upload_router
from app.core.config import get_settings
from app.db.mongodb import connect_mongodb
from app.services.cloudinary_service import configure_cloudinary


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_cloudinary(get_settings())
    async with connect_mongodb(get_settings()) as database:
        await database.users.create_index("email", unique=True, name="users_email_unique")
        await database.journeys.create_index(
            [("user_id", 1), ("createdAt", -1), ("_id", -1)],
            name="journeys_owner_created",
        )
        app.state.database = database
        try:
            yield
        finally:
            del app.state.database


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

    @application.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        # Không phản chiếu mật khẩu thô trong thông báo lỗi validation.
        errors = [{key: error[key] for key in ("loc", "msg", "type")} for error in exc.errors()]
        return JSONResponse(status_code=422, content={"detail": errors})

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
    application.include_router(api_router, prefix="/api")
    application.include_router(auth_router, prefix="/api")
    application.include_router(journeys_router, prefix="/api")
    application.include_router(upload_router, prefix="/api")
    return application


app = create_app()
