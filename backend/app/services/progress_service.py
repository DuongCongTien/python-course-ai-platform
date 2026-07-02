from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.courses_model import ContentStatus, Course, Lesson
from app.models.system_model import Enrollment, EnrollmentStatus, LessonProgress


class ProgressService:
    @staticmethod
    def get_course_continue(db: Session, user_id: int, course_identifier: str):
        course = ProgressService._get_course(db, course_identifier)
        enrollment = ProgressService._get_enrollment(db, user_id, course.id)
        first_lesson = ProgressService._get_first_lesson(db, course.id)

        lesson_id = enrollment.current_lesson_id if enrollment and enrollment.current_lesson_id else None
        lesson = None
        if lesson_id:
            lesson = ProgressService._get_published_lesson(db, int(lesson_id), course.id, raise_error=False)
        if not lesson:
            lesson = first_lesson
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khoa hoc chua co bai hoc.")

        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        return {
            "courseId": course.slug,
            "lessonId": int(lesson.id),
            "lastPositionSeconds": int(progress.last_position_seconds or 0) if progress else 0,
            "progressPercent": int(progress.progress_percent or 0) if progress else 0,
            "isCompleted": bool(progress.is_completed) if progress else False,
        }

    @staticmethod
    def get_course_progress(db: Session, user_id: int, course_identifier: str):
        course = ProgressService._get_course(db, course_identifier)
        lessons = ProgressService._get_published_lessons(db, course.id)
        lesson_ids = [lesson.id for lesson in lessons]
        progress_rows = []
        if lesson_ids:
            progress_rows = (
                db.query(LessonProgress)
                .filter(
                    LessonProgress.user_id == user_id,
                    LessonProgress.course_id == course.id,
                    LessonProgress.lesson_id.in_(lesson_ids),
                )
                .all()
            )
        progress_by_lesson = {int(row.lesson_id): row for row in progress_rows}
        completed_count = sum(1 for row in progress_rows if row.is_completed)
        total_count = len(lessons)
        course_percent = round((completed_count / total_count) * 100) if total_count else 0
        enrollment = ProgressService._get_enrollment(db, user_id, course.id)

        return {
            "courseId": course.slug,
            "progressPercent": course_percent,
            "completedLessons": completed_count,
            "totalLessons": total_count,
            "currentLessonId": int(enrollment.current_lesson_id) if enrollment and enrollment.current_lesson_id else None,
            "lessons": [
                ProgressService._serialize_lesson_progress(lesson.id, progress_by_lesson.get(int(lesson.id)))
                for lesson in lessons
            ],
        }

    @staticmethod
    def get_lesson_progress(db: Session, user_id: int, lesson_id: int):
        lesson = ProgressService._get_published_lesson(db, lesson_id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        return ProgressService._serialize_lesson_progress(lesson.id, progress)

    @staticmethod
    def update_lesson_progress(db: Session, user_id: int, lesson_id: int, payload):
        course = ProgressService._get_course(db, payload.courseId)
        lesson = ProgressService._get_published_lesson(db, lesson_id, course.id)
        enrollment = ProgressService._get_or_create_enrollment(db, user_id, course.id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        now = datetime.utcnow()

        if progress and abs((progress.last_position_seconds or 0) - payload.lastPositionSeconds) < 3:
            enrollment.current_lesson_id = lesson.id
            enrollment.last_accessed_at = now
            progress.last_watched_at = now
            db.commit()
            db.refresh(progress)
            return ProgressService._serialize_lesson_progress(lesson.id, progress)

        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                course_id=course.id,
                lesson_id=lesson.id,
                created_at=now,
            )
            db.add(progress)

        progress.last_position_seconds = payload.lastPositionSeconds
        progress.watched_seconds = max(progress.watched_seconds or 0, payload.watchedSeconds)
        progress.duration_seconds = payload.durationSeconds or lesson.duration_seconds or 0
        progress.progress_percent = min(max(payload.progressPercent, 0), 99) if not progress.is_completed else 100
        progress.last_watched_at = now

        enrollment.current_lesson_id = lesson.id
        enrollment.last_accessed_at = now

        db.commit()
        db.refresh(progress)
        return ProgressService._serialize_lesson_progress(lesson.id, progress)

    @staticmethod
    def complete_lesson(db: Session, user_id: int, lesson_id: int, payload):
        course = ProgressService._get_course(db, payload.courseId)
        lesson = ProgressService._get_published_lesson(db, lesson_id, course.id)
        enrollment = ProgressService._get_or_create_enrollment(db, user_id, course.id)
        progress = ProgressService._get_lesson_progress(db, user_id, lesson.id)
        now = datetime.utcnow()
        duration_seconds = payload.durationSeconds or lesson.duration_seconds or 0

        if not progress:
            progress = LessonProgress(
                user_id=user_id,
                course_id=course.id,
                lesson_id=lesson.id,
                created_at=now,
            )
            db.add(progress)

        progress.last_position_seconds = duration_seconds
        progress.watched_seconds = max(progress.watched_seconds or 0, duration_seconds)
        progress.duration_seconds = duration_seconds
        progress.progress_percent = 100
        progress.is_completed = True
        if not progress.completed_at:
            progress.completed_at = now
        progress.last_watched_at = now

        enrollment.current_lesson_id = lesson.id
        enrollment.last_accessed_at = now
        ProgressService._refresh_enrollment_course_progress(db, enrollment, course.id, user_id)

        db.commit()
        db.refresh(progress)
        return ProgressService._serialize_lesson_progress(lesson.id, progress)

    @staticmethod
    def _refresh_enrollment_course_progress(db: Session, enrollment: Enrollment, course_id: int, user_id: int):
        total_lessons = (
            db.query(func.count(Lesson.id))
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .scalar()
            or 0
        )
        completed_lessons = (
            db.query(func.count(LessonProgress.id))
            .join(Lesson, Lesson.id == LessonProgress.lesson_id)
            .filter(
                LessonProgress.user_id == user_id,
                LessonProgress.course_id == course_id,
                LessonProgress.is_completed.is_(True),
                Lesson.status == ContentStatus.published,
            )
            .scalar()
            or 0
        )

        enrollment.completed_lessons_count = int(completed_lessons)
        enrollment.progress_percent = round((completed_lessons / total_lessons) * 100) if total_lessons else 0
        if total_lessons and completed_lessons >= total_lessons:
            enrollment.status = EnrollmentStatus.completed
            enrollment.completed_at = enrollment.completed_at or datetime.utcnow()

    @staticmethod
    def _serialize_lesson_progress(lesson_id: int, progress: LessonProgress | None):
        return {
            "lessonId": int(lesson_id),
            "lastPositionSeconds": int(progress.last_position_seconds or 0) if progress else 0,
            "watchedSeconds": int(progress.watched_seconds or 0) if progress else 0,
            "durationSeconds": int(progress.duration_seconds or 0) if progress else 0,
            "progressPercent": int(progress.progress_percent or 0) if progress else 0,
            "isCompleted": bool(progress.is_completed) if progress else False,
        }

    @staticmethod
    def _get_course(db: Session, identifier: str) -> Course:
        query = db.query(Course).filter(Course.status == ContentStatus.published)
        course = query.filter(Course.id == int(identifier)).first() if str(identifier).isdigit() else query.filter(Course.slug == identifier).first()
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay khoa hoc.")
        return course

    @staticmethod
    def _get_published_lesson(db: Session, lesson_id: int, course_id: int | None = None, raise_error: bool = True):
        query = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.status == ContentStatus.published)
        if course_id is not None:
            query = query.filter(Lesson.course_id == course_id)
        lesson = query.first()
        if not lesson and raise_error:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay bai hoc.")
        return lesson

    @staticmethod
    def _get_first_lesson(db: Session, course_id: int):
        return (
            db.query(Lesson)
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .first()
        )

    @staticmethod
    def _get_published_lessons(db: Session, course_id: int):
        return (
            db.query(Lesson)
            .filter(Lesson.course_id == course_id, Lesson.status == ContentStatus.published)
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .all()
        )

    @staticmethod
    def _get_enrollment(db: Session, user_id: int, course_id: int):
        return db.query(Enrollment).filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id).first()

    @staticmethod
    def _get_or_create_enrollment(db: Session, user_id: int, course_id: int):
        enrollment = ProgressService._get_enrollment(db, user_id, course_id)
        if enrollment:
            return enrollment

        enrollment = Enrollment(user_id=user_id, course_id=course_id, status=EnrollmentStatus.active)
        db.add(enrollment)
        return enrollment

    @staticmethod
    def _get_lesson_progress(db: Session, user_id: int, lesson_id: int):
        return db.query(LessonProgress).filter(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id).first()
