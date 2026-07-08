from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.database import get_db
from app.models.users_model import User
from app.services.admin_content_utils import build_youtube_embed_url
from app.services.upload_service import UploadService

router = APIRouter()


class YoutubeUploadInput(BaseModel):
    lessonId: int | None = None
    courseId: int | None = None
    lessonTitle: str | None = None
    videoUrl: str
    durationSeconds: int | None = None


def success_response(data, message: str = "OK"):
    return {"success": True, "message": message, "data": data}


def serialize_video(video):
    return {
        "id": int(video.id),
        "lessonId": int(video.lesson_id),
        "provider": video.storage_provider,
        "videoUrl": video.video_url,
        "embedUrl": build_youtube_embed_url(video.video_url) if video.storage_provider == "youtube" else None,
        "durationSeconds": video.duration_seconds or 0,
        "processingStatus": video.processing_status or "pending",
    }


@router.post("/video", status_code=status.HTTP_201_CREATED)
def upload_video_file(
    lessonId: int | None = Form(default=None),
    courseId: int | None = Form(default=None),
    lessonTitle: str | None = Form(default=None),
    file: UploadFile = File(...),
    durationSeconds: int | None = Form(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    video = UploadService.save_video_file(
        db,
        file=file,
        duration_seconds=durationSeconds,
        lesson_id=lessonId,
        course_id=courseId,
        lesson_title=lessonTitle,
    )
    return success_response(serialize_video(video), "Tải video lên thành công.")


@router.post("/youtube", status_code=status.HTTP_201_CREATED)
def upload_youtube(payload: YoutubeUploadInput, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    video = UploadService.save_youtube_url(
        db,
        video_url=payload.videoUrl,
        duration_seconds=payload.durationSeconds,
        lesson_id=payload.lessonId,
        course_id=payload.courseId,
        lesson_title=payload.lessonTitle,
    )
    return success_response(serialize_video(video), "Tải đường dẫn YouTube lên thành công.")


@router.post("/slide", status_code=status.HTTP_201_CREATED)
def upload_slide(
    lessonId: int | None = Form(default=None),
    courseId: int | None = Form(default=None),
    lessonTitle: str | None = Form(default=None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    slide = UploadService.save_slide_file(
        db,
        file=file,
        lesson_id=lessonId,
        course_id=courseId,
        lesson_title=lessonTitle,
    )
    return success_response(
        {
            "id": int(slide.id),
            "lessonId": int(slide.lesson_id),
            "fileType": slide.file_type,
            "fileName": slide.file_name,
            "fileUrl": slide.file_url,
        },
        "Tải slide lên thành công.",
    )
