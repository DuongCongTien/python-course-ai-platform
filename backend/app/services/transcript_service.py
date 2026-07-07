import os
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from google import genai  

from app.core.database import SessionLocal
from app.models.ai_pipeline_model import LessonTranscript
from app.models.courses_model import Lesson, LessonVideo
from app.services.audio_service import AudioService, TEMP_STORAGE_DIR


class SpeechToTextProvider:
    """
    (Interface) đại diện cho một bộ cung cấp dịch vụ Chuyển đổi giọng nói thành văn bản.
    """
    name = "base"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        raise NotImplementedError


class LocalWhisperProvider(SpeechToTextProvider):
    """
    Bộ cung cấp dịch vụ chuyển đổi giọng nói thành văn bản sử dụng thư viện `faster-whisper`
    chạy trực tiếp trên hạ tầng máy chủ cục bộ (Local CPU/GPU).
    """
    name = "local_whisper"
    _models = {}

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            raise RuntimeError("Chua cai faster-whisper. Cai package hoac doi TRANSCRIPT_PROVIDER=gemini.") from exc

        model_name = os.getenv("WHISPER_MODEL", "small")
        device = os.getenv("WHISPER_DEVICE", "cpu")
        compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
        model_key = (model_name, device, compute_type)
        
        if model_key not in LocalWhisperProvider._models:
            LocalWhisperProvider._models[model_key] = WhisperModel(model_name, device=device, compute_type=compute_type)
        model = LocalWhisperProvider._models[model_key]
        
        # dịch
        segments, _ = model.transcribe(audio_path, language=language)
        text = " ".join(segment.text.strip() for segment in segments if segment.text and segment.text.strip())
        if not text:
            raise RuntimeError("Whisper khong tra ve noi dung transcript.")
        return text


class GeminiTranscriptProvider(SpeechToTextProvider):
    """
    Bộ cung cấp dịch vụ chuyển đổi giọng nói thành văn bản thông qua Google Gemini API.
    """
    name = "gemini"

    def transcribe(self, audio_path: str, language: str = "vi") -> str:
        """
        Tải file âm thanh lên Google Cloud và yêu cầu Gemini chuyển thành văn bản.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("Thieu GEMINI_API_KEY trong bien moi truong.")

        client = genai.Client(api_key=api_key)
        model_name = os.getenv("GEMINI_TRANSCRIBE_MODEL", "gemini-3.5-flash")
        uploaded_file = None
        
        try:
            uploaded_file = client.files.upload(file=audio_path)
            
            prompt = "Transcribe this audio exactly as spoken. Do not translate. Do not add any comments."
            if language == "vi":
                prompt = "Hãy chuyển đổi âm thanh này thành văn bản tiếng Việt một cách chính xác nhất. Tuyệt đối chỉ trả về nội dung gốc được nói trong file, không thêm bất kỳ bình luận, định dạng hay lời chào nào khác."

            response = client.models.generate_content(
                model=model_name,
                contents=[uploaded_file, prompt]
            )

            text = response.text
            if not text or not text.strip():
                raise RuntimeError("Gemini khong tra ve noi dung transcript.")
            
            return text.strip()
        finally:
            # QUAN TRỌNG: Xóa file trên Google Cloud sau khi dịch xong 
            # để tránh bị tính phí lưu trữ hoặc rò rỉ dữ liệu bài học
            if uploaded_file:
                try:
                    client.files.delete(name=uploaded_file.name)
                except Exception:
                    pass


class TranscriptService:
    @staticmethod
    def get_provider() -> SpeechToTextProvider:
        provider = os.getenv("TRANSCRIPT_PROVIDER", "local_whisper").lower()
        if provider == "gemini":
            return GeminiTranscriptProvider()
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