from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from app.core.database import Base, SessionLocal, engine
from app.models.ai_pipeline_model import LessonSummary, LessonTranscript
from app.models.courses_model import (
    ContentStatus,
    Course,
    CourseLevel,
    CourseSection,
    Lesson,
    LessonVideo,
)
from app.models.users_model import User, UserRole, UserStatus


DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4"
DEMO_PASSWORD_HASH = "$2b$12$K399E9m77pG/gO2p2H4EKe7rL7WjFz5O7U8eR3Y9gB.yR2J2gGzG."


@dataclass(frozen=True)
class LessonSeed:
    title: str
    description: str
    duration_seconds: int
    sort_order: int
    is_free: bool = False


@dataclass(frozen=True)
class SectionSeed:
    title: str
    sort_order: int
    lessons: tuple[LessonSeed, ...]


@dataclass(frozen=True)
class CourseSeed:
    title: str
    slug: str
    description: str
    level: CourseLevel
    price: float
    objectives: tuple[str, ...]
    sections: tuple[SectionSeed, ...]


COURSES: tuple[CourseSeed, ...] = (
    CourseSeed(
        title="Python cho người mới bắt đầu",
        slug="python-cho-nguoi-moi-bat-dau",
        level=CourseLevel.beginner,
        price=0,
        description=(
            "Khóa học giúp học viên làm quen với Python từ con số 0, bao gồm cú pháp cơ bản, "
            "biến, kiểu dữ liệu, điều kiện, vòng lặp và hàm."
        ),
        objectives=(
            "Nắm được cú pháp Python cơ bản.",
            "Hiểu biến, kiểu dữ liệu, điều kiện và vòng lặp.",
            "Có thể viết các chương trình Python đơn giản.",
        ),
        sections=(
            SectionSeed(
                title="Chương 1: Làm quen với Python",
                sort_order=1,
                lessons=(
                    LessonSeed(
                        "Bài 1.1: Python là gì?",
                        "Giới thiệu Python và các ứng dụng phổ biến trong thực tế.",
                        480,
                        1,
                        True,
                    ),
                    LessonSeed(
                        "Bài 1.2: Cài đặt môi trường Python",
                        "Hướng dẫn cài Python, trình soạn thảo và kiểm tra môi trường.",
                        720,
                        2,
                        True,
                    ),
                    LessonSeed(
                        "Bài 1.3: Chạy chương trình Python đầu tiên",
                        "Tạo file Python đầu tiên và chạy chương trình Hello World.",
                        900,
                        3,
                    ),
                ),
            ),
            SectionSeed(
                title="Chương 2: Biến và kiểu dữ liệu",
                sort_order=2,
                lessons=(
                    LessonSeed("Bài 2.1: Biến trong Python", "Cách khai báo và sử dụng biến trong Python.", 660, 1),
                    LessonSeed(
                        "Bài 2.2: Kiểu dữ liệu số và chuỗi",
                        "Làm việc với number, string và các thao tác cơ bản.",
                        780,
                        2,
                    ),
                    LessonSeed(
                        "Bài 2.3: Boolean và ép kiểu dữ liệu",
                        "Tìm hiểu boolean, truthy/falsy và chuyển đổi kiểu dữ liệu.",
                        720,
                        3,
                    ),
                ),
            ),
            SectionSeed(
                title="Chương 3: Cấu trúc điều khiển",
                sort_order=3,
                lessons=(
                    LessonSeed("Bài 3.1: Câu lệnh if else", "Viết điều kiện rẽ nhánh bằng if, elif và else.", 840, 1),
                    LessonSeed("Bài 3.2: Vòng lặp for", "Duyệt danh sách, chuỗi và range bằng vòng lặp for.", 780, 2),
                    LessonSeed("Bài 3.3: Vòng lặp while", "Sử dụng while cho các bài toán lặp theo điều kiện.", 720, 3),
                ),
            ),
        ),
    ),
    CourseSeed(
        title="Python nâng cao",
        slug="python-nang-cao",
        level=CourseLevel.advanced,
        price=499000,
        description=(
            "Khóa học dành cho học viên đã có nền tảng Python và muốn học sâu hơn về OOP, "
            "xử lý file, module, exception và project thực tế."
        ),
        objectives=(
            "Tổ chức code Python theo module và package.",
            "Áp dụng lập trình hướng đối tượng trong project thực tế.",
            "Xử lý file, exception và logging đúng cách.",
        ),
        sections=(
            SectionSeed(
                title="Chương 1: Ôn tập và tổ chức code",
                sort_order=1,
                lessons=(
                    LessonSeed("Bài 1.1: Ôn tập cú pháp Python", "Ôn lại cú pháp và các cấu trúc quan trọng.", 600, 1, True),
                    LessonSeed("Bài 1.2: Module và package", "Tách code thành module và package dễ bảo trì.", 780, 2, True),
                    LessonSeed("Bài 1.3: Virtual environment", "Tạo môi trường ảo và quản lý dependency.", 720, 3),
                ),
            ),
            SectionSeed(
                title="Chương 2: Lập trình hướng đối tượng",
                sort_order=2,
                lessons=(
                    LessonSeed("Bài 2.1: Class và object", "Định nghĩa class, object, attribute và method.", 900, 1),
                    LessonSeed("Bài 2.2: Kế thừa trong Python", "Tái sử dụng logic bằng inheritance.", 840, 2),
                    LessonSeed("Bài 2.3: Đóng gói và đa hình", "Áp dụng encapsulation và polymorphism.", 900, 3),
                ),
            ),
            SectionSeed(
                title="Chương 3: Xử lý file và lỗi",
                sort_order=3,
                lessons=(
                    LessonSeed("Bài 3.1: Đọc ghi file", "Đọc, ghi và quản lý file an toàn.", 780, 1),
                    LessonSeed("Bài 3.2: Exception handling", "Bắt và xử lý lỗi bằng try/except/finally.", 840, 2),
                    LessonSeed("Bài 3.3: Logging cơ bản", "Ghi log phục vụ debug và vận hành ứng dụng.", 720, 3),
                ),
            ),
        ),
    ),
    CourseSeed(
        title="Python cho phân tích dữ liệu",
        slug="python-phan-tich-du-lieu",
        level=CourseLevel.intermediate,
        price=699000,
        description=(
            "Khóa học hướng dẫn sử dụng Python để xử lý dữ liệu, làm việc với Pandas, NumPy, "
            "biểu đồ và các bước phân tích dữ liệu cơ bản."
        ),
        objectives=(
            "Hiểu quy trình phân tích dữ liệu bằng Python.",
            "Làm việc với NumPy, Pandas và dữ liệu CSV.",
            "Trực quan hóa dữ liệu và xuất báo cáo cơ bản.",
        ),
        sections=(
            SectionSeed(
                title="Chương 1: Nền tảng xử lý dữ liệu",
                sort_order=1,
                lessons=(
                    LessonSeed(
                        "Bài 1.1: Giới thiệu phân tích dữ liệu với Python",
                        "Tổng quan công cụ và quy trình phân tích dữ liệu.",
                        660,
                        1,
                        True,
                    ),
                    LessonSeed("Bài 1.2: Làm việc với NumPy", "Tạo mảng và tính toán dữ liệu số với NumPy.", 840, 2, True),
                    LessonSeed("Bài 1.3: Làm việc với Pandas", "Sử dụng DataFrame để đọc và xử lý dữ liệu.", 900, 3),
                ),
            ),
            SectionSeed(
                title="Chương 2: Làm sạch và biến đổi dữ liệu",
                sort_order=2,
                lessons=(
                    LessonSeed("Bài 2.1: Đọc dữ liệu từ CSV", "Nạp dữ liệu CSV và kiểm tra cấu trúc dữ liệu.", 720, 1),
                    LessonSeed("Bài 2.2: Xử lý dữ liệu thiếu", "Phát hiện và xử lý missing values.", 840, 2),
                    LessonSeed("Bài 2.3: Lọc và nhóm dữ liệu", "Lọc dòng, chọn cột và groupby dữ liệu.", 900, 3),
                ),
            ),
            SectionSeed(
                title="Chương 3: Trực quan hóa dữ liệu",
                sort_order=3,
                lessons=(
                    LessonSeed("Bài 3.1: Vẽ biểu đồ với Matplotlib", "Tạo biểu đồ đầu tiên bằng Matplotlib.", 780, 1),
                    LessonSeed("Bài 3.2: Biểu đồ cột, đường và tròn", "Chọn loại biểu đồ phù hợp với dữ liệu.", 840, 2),
                    LessonSeed("Bài 3.3: Xuất báo cáo dữ liệu", "Tổng hợp insight và xuất kết quả phân tích.", 720, 3),
                ),
            ),
        ),
    ),
)


def get_or_create_admin(db) -> User:
    user = db.query(User).filter(User.username == "course_seed_admin").first()
    if user:
        user.email = "course-seed-admin@pythonailearning.local"
        user.full_name = "Course Seed Admin"
        user.role = UserRole.admin
        user.status = UserStatus.active
        return user

    user = User(
        username="course_seed_admin",
        email="course-seed-admin@pythonailearning.local",
        password_hash=DEMO_PASSWORD_HASH,
        full_name="Course Seed Admin",
        role=UserRole.admin,
        status=UserStatus.active,
    )
    db.add(user)
    db.flush()
    return user


def upsert_course(db, seed: CourseSeed, admin: User) -> Course:
    course = db.query(Course).filter(Course.slug == seed.slug).first()
    if not course:
        course = Course(slug=seed.slug, created_by=admin.id)
        db.add(course)

    course.title = seed.title
    course.description = seed.description
    course.thumbnail_url = None
    course.level = seed.level
    course.price = seed.price
    course.status = ContentStatus.published
    course.created_by = admin.id
    db.flush()
    return course


def upsert_section(db, course: Course, seed: SectionSeed) -> CourseSection:
    section = (
        db.query(CourseSection)
        .filter(CourseSection.course_id == course.id, CourseSection.title == seed.title)
        .first()
    )
    if not section:
        section = CourseSection(course_id=course.id, title=seed.title)
        db.add(section)

    section.sort_order = seed.sort_order
    db.flush()
    return section


def upsert_lesson(db, course: Course, section: CourseSection, seed: LessonSeed) -> Lesson:
    lesson = (
        db.query(Lesson)
        .filter(Lesson.section_id == section.id, Lesson.title == seed.title)
        .first()
    )
    if not lesson:
        lesson = Lesson(course_id=course.id, section_id=section.id, title=seed.title)
        db.add(lesson)

    lesson.course_id = course.id
    lesson.section_id = section.id
    lesson.description = seed.description
    lesson.duration_seconds = seed.duration_seconds
    lesson.sort_order = seed.sort_order
    lesson.is_free = seed.is_free
    lesson.status = ContentStatus.published
    db.flush()
    return lesson


def upsert_video(db, lesson: Lesson) -> None:
    video = db.query(LessonVideo).filter(LessonVideo.lesson_id == lesson.id).first()
    if not video:
        video = LessonVideo(lesson_id=lesson.id, video_url=DEMO_VIDEO_URL)
        db.add(video)

    video.video_url = DEMO_VIDEO_URL
    video.storage_provider = "demo"
    video.file_name = "python-demo-video.mp4"
    video.file_size = 10485760
    video.duration_seconds = lesson.duration_seconds or 720
    video.processing_status = "completed"


def upsert_transcript_and_summary(db, lesson: Lesson, course_title: str) -> None:
    transcript_text = (
        f"{lesson.title}. Python là một ngôn ngữ lập trình bậc cao, dễ đọc và dễ học. "
        f"Trong khóa {course_title}, bài học này giúp học viên nắm được nội dung cốt lõi "
        "và thực hành từng bước trên ví dụ thực tế."
    )
    summary_text = (
        f"Bài học {lesson.title} giới thiệu các ý chính và hướng dẫn học viên áp dụng kiến thức "
        "Python vào bài tập thực hành."
    )

    transcript = db.query(LessonTranscript).filter(LessonTranscript.lesson_id == lesson.id).first()
    if not transcript:
        transcript = LessonTranscript(lesson_id=lesson.id, transcript_text=transcript_text)
        db.add(transcript)

    transcript.transcript_text = transcript_text
    transcript.language = "vi"
    transcript.generated_by = "demo-seed"
    transcript.status = "completed"

    summary = db.query(LessonSummary).filter(LessonSummary.lesson_id == lesson.id).first()
    if not summary:
        summary = LessonSummary(lesson_id=lesson.id, summary_text=summary_text)
        db.add(summary)

    summary.summary_text = summary_text
    summary.key_points = [
        "Nắm ý chính của bài học",
        "Thực hành theo ví dụ",
        "Chuẩn bị cho bài tiếp theo",
    ]
    summary.generated_by = "demo-seed"


def seed_courses(db, courses: Iterable[CourseSeed] = COURSES) -> tuple[int, int, int]:
    admin = get_or_create_admin(db)
    course_count = 0
    section_count = 0
    lesson_count = 0

    for course_seed in courses:
        course = upsert_course(db, course_seed, admin)
        course_count += 1

        for section_seed in course_seed.sections:
            section = upsert_section(db, course, section_seed)
            section_count += 1

            for lesson_seed in section_seed.lessons:
                lesson = upsert_lesson(db, course, section, lesson_seed)
                lesson_count += 1

                if lesson_seed.sort_order <= 2 and section_seed.sort_order == 1:
                    upsert_video(db, lesson)
                    upsert_transcript_and_summary(db, lesson, course.title)

    return course_count, section_count, lesson_count


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        course_count, section_count, lesson_count = seed_courses(db)
        db.commit()
        print("Seed courses completed.")
        print(f"Courses upserted: {course_count}")
        print(f"Sections upserted: {section_count}")
        print(f"Lessons upserted: {lesson_count}")
        print("Command: python -m app.seeds.seed_courses")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
