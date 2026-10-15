"""Server-side Cloudinary configuration; credentials never reach the frontend."""

from urllib.parse import unquote, urlsplit

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.core.config import Settings, get_settings

MAX_FILE_BYTES = 50 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"}


async def upload_file(file: UploadFile) -> dict[str, str]:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, "Only supported images and videos are allowed")
    size = 0
    while chunk := await file.read(1024 * 1024):
        size += len(chunk)
        if size > MAX_FILE_BYTES:
            raise HTTPException(413, "File exceeds 50 MB")
    if not size:
        raise HTTPException(400, "File is empty")
    await file.seek(0)
    if not configure_cloudinary(get_settings()):
        raise HTTPException(503, "Media upload is not configured")
    try:
        result = await run_in_threadpool(
            cloudinary.uploader.upload, file.file,
            resource_type="auto", folder="travelogue", timeout=120,
        )
        if result.get("resource_type") not in ("image", "video"):
            raise ValueError("Unsupported resource")
        return {key: result[key] for key in ("public_id", "resource_type")} | {"url": result["secure_url"]}
    except Exception:
        # Không trả lỗi SDK có thể chứa thông tin xác thực về trình duyệt.
        raise HTTPException(502, "Media provider upload failed") from None


def configure_cloudinary(settings: Settings) -> bool:
    url = settings.CLOUDINARY_URL.get_secret_value().strip()
    if not url:
        return False
    try:
        parsed = urlsplit(url)
        if (
            parsed.scheme != "cloudinary"
            or not parsed.username
            or not parsed.password
            or not parsed.hostname
            or parsed.path not in ("", "/")
            or parsed.query
            or parsed.fragment
        ):
            raise ValueError
        cloudinary.config(
            cloud_name=parsed.hostname,
            api_key=unquote(parsed.username),
            api_secret=unquote(parsed.password),
            secure=True,
        )
    except ValueError:
        raise ValueError("Invalid CLOUDINARY_URL configuration") from None
    return True
