from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.users_model import User
from app.services.transcript_service import TranscriptService

router = APIRouter(prefix="/admin/lessons", tags=["Admin Lessons"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    role = current_user.role.value if hasattr(current_user.role, "value") else current_user.role
    if role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Chi admin moi duoc tao transcript.")
    return current_user


@router.post("/{lesson_id}/generate-transcript", status_code=status.HTTP_200_OK)
def generate_transcript(
    lesson_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    TranscriptService.mark_processing(db, lesson_id)
    db.commit()
    background_tasks.add_task(TranscriptService.generate_transcript_task, lesson_id)

    return {
        "success": True,
        "message": "Da bat dau tao transcript.",
        "data": {
            "lessonId": lesson_id,
            "status": "processing",
        },
    }
