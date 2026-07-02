import math
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.courses_model import ContentStatus, Course, Lesson


DEFAULT_AI_FEATURES = [
    {
        "id": "transcript",
        "title": "Transcript tu dong",
        "description": "AI chuyen noi dung video thanh van ban.",
    },
    {
        "id": "summary",
        "title": "Tom tat bai hoc",
        "description": "AI rut ra cac y chinh trong bai hoc.",
    },
    {
        "id": "qa",
        "title": "Hoi dap theo bai hoc",
        "description": "Chatbot tra loi dua tren noi dung bai hoc.",
    },
]

COURSE_OBJECTIVES = {
    "python-co-ban-tich-hop-ai": [
        "Nam duoc cu phap Python co ban.",
        "Hieu bien, kieu du lieu, dieu kien va vong lap.",
        "Biet ung dung AI Assistant de tang hieu suat viet code.",
    ],
    "rag-fastapi-advanced": [
        "Nam kien truc tong quan cua he thong RAG.",
        "Biet cach ket hop vector database voi FastAPI.",
        "Xay dung API tro ly thong minh dua tren noi dung bai hoc.",
    ],
}


class CoursesService:
    @staticmethod
    def get_published_courses(
        db: Session,
        keyword: Optional[str] = None,
        level: Optional[str] = None,
        page: int = 1,
        page_size: int = 12,
    ):
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        query = db.query(Course).filter(Course.status == ContentStatus.published)

        if keyword:
            keyword_like = f"%{keyword.strip()}%"
            query = query.filter(
                (Course.title.ilike(keyword_like)) | (Course.description.ilike(keyword_like))
            )

        if level:
            query = query.filter(Course.level == level)

        total_items = query.count()
        courses = (
            query.options(selectinload(Course.lessons))
            .order_by(Course.created_at.desc(), Course.id.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "items": [CoursesService.serialize_course_list_item(course) for course in courses],
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "totalItems": total_items,
                "totalPages": math.ceil(total_items / page_size) if total_items else 0,
            },
        }

    @staticmethod
    def get_featured_courses(db: Session, limit: int = 6):
        courses = (
            db.query(Course)
            .options(selectinload(Course.lessons))
            .filter(Course.status == ContentStatus.published)
            .order_by(Course.created_at.desc(), Course.id.desc())
            .limit(limit)
            .all()
        )
        return [CoursesService.serialize_featured_course(course) for course in courses]

    @staticmethod
    def get_course_by_identifier(identifier: str, db: Session):
        query = (
            db.query(Course)
            .options(
                selectinload(Course.lessons),
            )
            .filter(Course.status == ContentStatus.published)
        )

        if identifier.isdigit():
            course = query.filter(Course.id == int(identifier)).first()
        else:
            course = query.filter(Course.slug == identifier).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Khong tim thay khoa hoc.",
                    "errorCode": "COURSE_NOT_FOUND",
                    "details": None,
                },
            )

        return course

    @staticmethod
    def serialize_course_detail(course: Course):
        published_lessons = CoursesService._published_lessons(course.lessons)
        lessons_count = len(published_lessons)
        duration_seconds = sum((lesson.duration_seconds or 0) for lesson in published_lessons)
        first_lesson = (
            min(published_lessons, key=lambda lesson: lesson.sort_order or 0)
            if published_lessons
            else None
        )

        return {
            "id": int(course.id),
            "slug": course.slug,
            "title": course.title,
            "description": course.description or "",
            "thumbnailUrl": course.thumbnail_url,
            "level": CoursesService._enum_value(course.level),
            "price": float(course.price or 0),
            "status": CoursesService._enum_value(course.status),
            "lessonsCount": lessons_count,
            "durationSeconds": duration_seconds,
            "hasAI": True,
            "studentsThisMonth": "+1,200 hoc vien",
            "firstLessonId": int(first_lesson.id) if first_lesson else None,
            "currentLessonId": int(first_lesson.id) if first_lesson else None,
            "objectives": COURSE_OBJECTIVES.get(course.slug, []),
            "aiFeatures": DEFAULT_AI_FEATURES,
        }

    @staticmethod
    def get_course_lessons(identifier: str, db: Session):
        course = CoursesService.get_course_by_identifier(identifier, db)
        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.course_id == course.id,
                Lesson.status == ContentStatus.published,
            )
            .order_by(Lesson.sort_order.asc(), Lesson.id.asc())
            .all()
        )

        return [CoursesService.serialize_lesson(lesson) for lesson in lessons]

    @staticmethod
    def serialize_course_list_item(course: Course):
        published_lessons = CoursesService._published_lessons(course.lessons)
        return {
            "id": int(course.id),
            "slug": course.slug,
            "title": course.title,
            "description": course.description or "",
            "thumbnailUrl": course.thumbnail_url,
            "level": CoursesService._enum_value(course.level),
            "price": float(course.price or 0),
            "status": CoursesService._enum_value(course.status),
            "lessonsCount": len(published_lessons),
            "durationSeconds": sum((lesson.duration_seconds or 0) for lesson in published_lessons),
            "hasAI": True,
            "isLearning": False,
            "progress": 0,
            "currentLessonId": None,
        }

    @staticmethod
    def serialize_featured_course(course: Course):
        item = CoursesService.serialize_course_list_item(course)
        return {
            "id": item["id"],
            "slug": item["slug"],
            "title": item["title"],
            "description": item["description"],
            "level": item["level"],
            "lessonsCount": item["lessonsCount"],
            "durationSeconds": item["durationSeconds"],
            "hasAI": item["hasAI"],
        }

    @staticmethod
    def serialize_lesson(lesson: Lesson):
        duration_seconds = lesson.duration_seconds or 0
        return {
            "id": int(lesson.id),
            "courseId": int(lesson.course_id),
            "sectionId": int(lesson.section_id) if lesson.section_id else None,
            "title": lesson.title,
            "description": lesson.description or "",
            "durationSeconds": duration_seconds,
            "duration": CoursesService._format_duration(duration_seconds),
            "status": "available",
            "isFree": bool(lesson.is_free),
            "sortOrder": lesson.sort_order or 0,
        }

    @staticmethod
    def _published_lessons(lessons):
        return [lesson for lesson in lessons if lesson.status == ContentStatus.published]

    @staticmethod
    def _format_duration(duration_seconds: int):
        minutes, seconds = divmod(max(duration_seconds, 0), 60)
        return f"{minutes:02d}:{seconds:02d}"

    @staticmethod
    def _format_minutes(duration_seconds: int):
        minutes = max(1, math.ceil(max(duration_seconds, 0) / 60)) if duration_seconds else 0
        return f"{minutes} phut"

    @staticmethod
    def _enum_value(value):
        return getattr(value, "value", value)
