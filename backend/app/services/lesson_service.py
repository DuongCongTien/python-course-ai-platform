from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

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
                    "message": "Khong tim thay bai hoc.",
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
        return {
            "id": int(video.id),
            "videoUrl": video.video_url,
            "storageProvider": video.storage_provider,
            "fileName": video.file_name,
            "fileSize": video.file_size,
            "durationSeconds": video.duration_seconds or 0,
            "processingStatus": video.processing_status,
        }

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
