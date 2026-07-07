import json
import mimetypes
import os
import uuid
import urllib.request
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.ai_pipeline_model import LessonTranscript
from app.models.courses_model import Lesson, LessonVideo
from app.services.audio_service import AudioService, TEMP_STORAGE_DIR


class SpeechToTextProvider:
    name = "base"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        raise NotImplementedError


class LocalWhisperProvider(SpeechToTextProvider):
    name = "local_whisper"
    _models = {}

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            raise RuntimeError("Chua cai faster-whisper. Cai package hoac doi TRANSCRIPT_PROVIDER=openai.") from exc

        model_name = os.getenv("WHISPER_MODEL", "small")
        device = os.getenv("WHISPER_DEVICE", "cpu")
        compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
        model_key = (model_name, device, compute_type)
        if model_key not in LocalWhisperProvider._models:
            LocalWhisperProvider._models[model_key] = WhisperModel(model_name, device=device, compute_type=compute_type)
        model = LocalWhisperProvider._models[model_key]
        segments, _ = model.transcribe(audio_path, language=language)
        text = " ".join(segment.text.strip() for segment in segments if segment.text and segment.text.strip())
        if not text:
            raise RuntimeError("Whisper khong tra ve noi dung transcript.")
        return text


class OpenAIWhisperProvider(SpeechToTextProvider):
    name = "openai"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("Thieu OPENAI_API_KEY cho TRANSCRIPT_PROVIDER=openai.")

        model = os.getenv("OPENAI_TRANSCRIBE_MODEL", "gpt-4o-transcribe")
        body, content_type = self._build_multipart_body(
            {
                "model": model,
                "language": language,
                "response_format": "json",
            },
            "file",
            Path(audio_path),
        )
        request = urllib.request.Request(
            "https://api.openai.com/v1/audio/transcriptions",
            data=body,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": content_type,
            },
            method="POST",
        )

        with urllib.request.urlopen(request, timeout=300) as response:
            payload = json.loads(response.read().decode("utf-8"))

        text = payload.get("text")
        if not isinstance(text, str) or not text.strip():
            raise RuntimeError("OpenAI speech-to-text khong tra ve noi dung transcript.")
        return text.strip()

    @staticmethod
    def _build_multipart_body(fields: dict[str, str], file_field: str, file_path: Path) -> tuple[bytes, str]:
        boundary = f"----pyai{uuid.uuid4().hex}"
        chunks: list[bytes] = []

        for name, value in fields.items():
            chunks.extend(
                [
                    f"--{boundary}\r\n".encode(),
                    f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                    f"{value}\r\n".encode(),
                ]
            )

        mime_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{file_field}"; filename="{file_path.name}"\r\n'.encode(),
                f"Content-Type: {mime_type}\r\n\r\n".encode(),
                file_path.read_bytes(),
                b"\r\n",
                f"--{boundary}--\r\n".encode(),
            ]
        )
        return b"".join(chunks), f"multipart/form-data; boundary={boundary}"


class TranscriptService:
    @staticmethod
    def get_provider() -> SpeechToTextProvider:
        provider = os.getenv("TRANSCRIPT_PROVIDER", "local_whisper").lower()
        if provider == "openai":
            return OpenAIWhisperProvider()
        if provider == "local_whisper":
            return LocalWhisperProvider()
        raise ValueError(f"TRANSCRIPT_PROVIDER khong duoc ho tro: {provider}")

    @staticmethod
    def get_transcript(db: Session, lesson_id: int) -> LessonTranscript | None:
        return (
            db.query(LessonTranscript)
            .filter(LessonTranscript.lesson_id == lesson_id)
            .order_by(LessonTranscript.created_at.desc(), LessonTranscript.id.desc())
            .first()
        )

    @staticmethod
    def get_transcript_response(db: Session, lesson_id: int) -> dict:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay bai hoc.")

        transcript = TranscriptService.get_transcript(db, lesson_id)
        return TranscriptService.serialize_transcript(transcript, lesson_id)

    @staticmethod
    def mark_processing(db: Session, lesson_id: int, language: str = "vi", force: bool = False) -> LessonTranscript:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khong tim thay bai hoc.")

        transcript = TranscriptService.get_transcript(db, lesson_id)
        if transcript and transcript.status == "completed" and not force:
            return transcript

        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id, transcript_text="", language=language)
            db.add(transcript)

        transcript.status = "processing"
        transcript.language = language
        transcript.error_message = None
        db.flush()
        return transcript

    @staticmethod
    def save_transcript(db: Session, lesson_id: int, transcript_text: str, language: str = "vi", generated_by: str = "whisper") -> LessonTranscript:
        transcript = TranscriptService.get_transcript(db, lesson_id)
        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id)
            db.add(transcript)

        transcript.transcript_text = transcript_text
        transcript.language = language
        transcript.generated_by = generated_by
        transcript.status = "completed"
        transcript.error_message = None
        db.flush()
        return transcript

    @staticmethod
    def mark_failed(db: Session, lesson_id: int, error: Exception | str, language: str = "vi") -> LessonTranscript:
        transcript = TranscriptService.get_transcript(db, lesson_id)
        if not transcript:
            transcript = LessonTranscript(lesson_id=lesson_id, transcript_text="", language=language)
            db.add(transcript)

        transcript.status = "failed"
        transcript.language = language
        transcript.error_message = str(error)
        db.flush()
        return transcript

    @staticmethod
    def generate_transcript_task(lesson_id: int, language: str = "vi") -> None:
        db = SessionLocal()
        temp_files: list[Path | str] = []
        try:
            lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if not lesson:
                raise RuntimeError("Khong tim thay bai hoc.")

            video = (
                db.query(LessonVideo)
                .filter(LessonVideo.lesson_id == lesson_id)
                .order_by(LessonVideo.uploaded_at.desc(), LessonVideo.id.desc())
                .first()
            )
            if not video:
                raise RuntimeError("Bai hoc chua co video.")

            video_path, source_temp_files = AudioService.prepare_video_source(video.video_url, lesson_id, video.storage_provider)
            temp_files.extend(source_temp_files)

            audio_path = TEMP_STORAGE_DIR / f"lesson_{lesson_id}_audio.wav"
            temp_files.append(audio_path)
            AudioService.extract_audio_from_video(video_path, str(audio_path))

            provider = TranscriptService.get_provider()
            transcript_text = provider.transcribe(str(audio_path), language=language)
            TranscriptService.save_transcript(db, lesson_id, transcript_text, language=language, generated_by=provider.name)
            db.commit()
        except Exception as exc:
            db.rollback()
            TranscriptService.mark_failed(db, lesson_id, exc, language=language)
            db.commit()
        finally:
            AudioService.cleanup(temp_files)
            db.close()

    @staticmethod
    def serialize_transcript(transcript: LessonTranscript | None, lesson_id: int | None = None) -> dict:
        if not transcript:
            return {
                "lessonId": int(lesson_id or 0),
                "transcriptText": None,
                "language": "vi",
                "status": "pending",
                "generatedBy": None,
                "errorMessage": None,
                "createdAt": None,
                "updatedAt": None,
            }

        transcript_status = transcript.status or "completed"
        return {
            "lessonId": int(transcript.lesson_id),
            "transcriptText": transcript.transcript_text if transcript_status == "completed" else None,
            "language": transcript.language or "vi",
            "status": transcript_status,
            "generatedBy": transcript.generated_by,
            "errorMessage": transcript.error_message if transcript_status == "failed" else None,
            "createdAt": transcript.created_at.isoformat() if transcript.created_at else None,
            "updatedAt": transcript.updated_at.isoformat() if getattr(transcript, "updated_at", None) else None,
        }
