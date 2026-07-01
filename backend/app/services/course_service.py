import math
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.courses_model import ContentStatus, Course, CourseSection, Lesson


DEFAULT_AI_FEATURES = [
    {
        "id": "transcript",
        "title": "Transcript tự động",
        "description": "AI chuyển nội dung video thành văn bản.",
    },
    {
        "id": "summary",
        "title": "Tóm tắt bài học",
        "description": "AI rút ra các ý chính trong bài học.",
    },
    {
        "id": "qa",
        "title": "Hỏi đáp theo bài học",
        "description": "Chatbot trả lời dựa trên nội dung bài học.",
    },
]

COURSE_OBJECTIVES = {
    "python-cho-nguoi-moi-bat-dau": [
        "Nắm được cú pháp Python cơ bản.",
        "Hiểu biến, kiểu dữ liệu, điều kiện và vòng lặp.",
        "Có thể viết các chương trình Python đơn giản.",
    ],
    "python-nang-cao": [
        "Tổ chức code Python theo module và package.",
        "Áp dụng lập trình hướng đối tượng trong project thực tế.",
        "Xử lý file, exception và logging đúng cách.",
    ],
    "python-phan-tich-du-lieu": [
        "Hiểu quy trình phân tích dữ liệu bằng Python.",
        "Làm việc với NumPy, Pandas và dữ liệu CSV.",
        "Trực quan hóa dữ liệu và xuất báo cáo cơ bản.",
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
                selectinload(Course.sections).selectinload(CourseSection.lessons),
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
        first_lesson = min(published_lessons, key=lambda lesson: lesson.sort_order or 0) if published_lessons else None

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
        sections = sorted(course.sections, key=lambda section: section.sort_order or 0)

        chapters = []
        for section in sections:
            lessons = [
                lesson
                for lesson in sorted(section.lessons, key=lambda item: item.sort_order or 0)
                if lesson.status == ContentStatus.published
            ]
            duration_seconds = sum((lesson.duration_seconds or 0) for lesson in lessons)
            chapters.append(
                {
                    "id": int(section.id),
                    "title": section.title,
                    "meta": f"{len(lessons)} bai hoc - {CoursesService._format_minutes(duration_seconds)}",
                    "lessons": [CoursesService.serialize_lesson(lesson) for lesson in lessons],
                }
            )

        return chapters

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
