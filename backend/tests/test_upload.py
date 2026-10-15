import io
import unittest
from unittest.mock import patch

from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers
from app.services.cloudinary_service import upload_file


class UploadTests(unittest.IsolatedAsyncioTestCase):
    def file(self, content=b"media", mime="image/png"):
        return UploadFile(io.BytesIO(content), headers=Headers({"content-type": mime}))

    async def test_image_and_video(self):
        for kind, mime in (("image", "image/png"), ("video", "video/mp4")):
            with patch("app.services.cloudinary_service.configure_cloudinary", return_value=True), patch(
                "cloudinary.uploader.upload", return_value={
                    "secure_url": "https://example.com/media", "public_id": "travelogue/test",
                    "resource_type": kind,
                },
            ) as upload:
                result = await upload_file(self.file(mime=mime))
                self.assertEqual(result["resource_type"], kind)
                self.assertEqual(upload.call_args.kwargs["resource_type"], "auto")

    async def test_invalid_files(self):
        for content, mime, status in ((b"", "image/png", 400), (b"text", "text/plain", 415)):
            with self.assertRaises(HTTPException) as error:
                await upload_file(self.file(content, mime))
            self.assertEqual(error.exception.status_code, status)
        with patch("app.services.cloudinary_service.MAX_FILE_BYTES", 2):
            with self.assertRaises(HTTPException) as error:
                await upload_file(self.file())
            self.assertEqual(error.exception.status_code, 413)

    async def test_provider_error_is_sanitized(self):
        with patch("app.services.cloudinary_service.configure_cloudinary", return_value=True), patch(
            "cloudinary.uploader.upload", side_effect=RuntimeError("private secret"),
        ):
            with self.assertRaises(HTTPException) as error:
                await upload_file(self.file())
            self.assertEqual(error.exception.status_code, 502)
            self.assertNotIn("private secret", error.exception.detail)


if __name__ == "__main__":
    unittest.main()
