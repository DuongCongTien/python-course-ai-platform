from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload
from urllib.parse import parse_qs, urlparse

from app.models.ai_pipeline_model import LessonSummary, LessonTranscript
from app.models.courses_model import ContentStatus, Lesson, LessonVideo


class LessonService:
    @staticmethod
    def get_lesson_by_id(db: Session, lesson_id: int) -> Lesson:
        lesson = (
            db.query(Lesson)
            .options(selectinload(Lesson.videos))
            .filter(
                Lesson.id == lesson_id,
                Lesson.status == ContentStatus.published,
            )
            .first()
        )

        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Không tìm thấy bài học.",
                    "errorCode": "LESSON_NOT_FOUND",
                    "details": None,
                },
            )

        return lesson

    @staticmethod
    def serialize_lesson_detail(lesson: Lesson):
        return {
            "id": int(lesson.id),
            "courseId": int(lesson.course_id),
            "sectionId": int(lesson.section_id) if lesson.section_id else None,
            "title": lesson.title,
            "description": lesson.description or "",
            "durationSeconds": lesson.duration_seconds or 0,
            "sortOrder": lesson.sort_order or 0,
            "isFree": bool(lesson.is_free),
            "status": "available",
        }

    @staticmethod
    def get_lesson_resources(db: Session, lesson_id: int):
        lesson = LessonService.get_lesson_by_id(db, lesson_id)

        video = (
            db.query(LessonVideo)
            .filter(LessonVideo.lesson_id == lesson.id)
            .order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
            .first()
        )
        transcript = (
            db.query(LessonTranscript)
            .filter(LessonTranscript.lesson_id == lesson.id)
            .order_by(LessonTranscript.created_at.desc(), LessonTranscript.id.desc())
            .first()
        )
        summary = (
            db.query(LessonSummary)
            .filter(LessonSummary.lesson_id == lesson.id)
            .order_by(LessonSummary.created_at.desc(), LessonSummary.id.desc())
            .first()
        )

        return {
            "lessonId": int(lesson.id),
            "video": LessonService.serialize_video(video) if video else None,
            "slideFile": None,
            "transcript": LessonService.serialize_transcript(transcript) if transcript else None,
            "summary": LessonService.serialize_summary(summary) if summary else None,
        }

    @staticmethod
    def serialize_video(video: LessonVideo):
        provider = (video.storage_provider or "media").lower()
        video_url = video.video_url

        return {
            "id": int(video.id),
            "provider": provider,
            "videoUrl": video_url,
            "embedUrl": LessonService.build_youtube_embed_url(video_url) if provider == "youtube" else None,
            "storageProvider": video.storage_provider,
            "fileName": video.file_name,
            "fileSize": video.file_size,
            "durationSeconds": video.duration_seconds or 0,
            "processingStatus": video.processing_status,
        }

    @staticmethod
    def build_youtube_embed_url(url: str | None):
        if not url:
            return None

        parsed = urlparse(url)
        netloc = parsed.netloc.lower()

        if "youtu.be" in netloc:
            video_id = parsed.path.strip("/")
            return f"https://www.youtube.com/embed/{video_id}" if video_id else None

        if "youtube.com" in netloc:
            if parsed.path.startswith("/embed/"):
                return url

            video_id = parse_qs(parsed.query).get("v", [None])[0]
            if video_id:
                return f"https://www.youtube.com/embed/{video_id}"

        return None

    @staticmethod
    def serialize_transcript(transcript: LessonTranscript):
        return {
            "text": transcript.transcript_text,
            "language": transcript.language,
            "status": transcript.status,
        }

    @staticmethod
    def serialize_summary(summary: LessonSummary):
        return {
            "summaryText": summary.summary_text,
            "keyPoints": summary.key_points,
        }
