import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import {
  completeLesson,
  updateLessonProgress,
  type LessonProgressData,
} from "../../services/progress.service";
import {
  getYouTubeEmbedUrl,
  isDirectVideoUrl,
  isYouTubeUrl,
} from "../../utils/video";

interface VideoPlayerSectionProps {
  videoUrl: string | null;
  embedUrl: string | null;
  provider: string | null;
  title: string;
  courseId: string;
  lessonId: string;
  durationSeconds: number;
  lessonProgress: LessonProgressData | null;
  onProgressChange: (progress: LessonProgressData) => void;
  onCompleted: () => void;
}

function VideoPlayerSection({
  videoUrl,
  embedUrl,
  provider,
  title,
  courseId,
  lessonId,
  durationSeconds,
  lessonProgress,
  onProgressChange,
  onCompleted,
}: VideoPlayerSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasRestoredRef = useRef(false);
  const lastSavedAtRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const finalEmbedUrl = useMemo(() => {
    if (embedUrl) return embedUrl;

    if (provider?.toLowerCase() === "youtube" || isYouTubeUrl(videoUrl)) {
      return getYouTubeEmbedUrl(videoUrl);
    }

    return null;
  }, [embedUrl, provider, videoUrl]);

  useEffect(() => {
    hasRestoredRef.current = false;
    lastSavedAtRef.current = 0;
  }, [lessonId, videoUrl, finalEmbedUrl]);

  const saveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !courseId || !lessonId || saveInFlightRef.current) return;

    const currentTime = Math.floor(video.currentTime || 0);
    const duration = Math.floor(video.duration || durationSeconds || lessonProgress?.durationSeconds || 0);
    if (duration <= 0) return;

    const progressPercent = Math.min(99, Math.round((currentTime / duration) * 100));
    saveInFlightRef.current = true;

    try {
      const response = await updateLessonProgress(lessonId, {
        courseId,
        lastPositionSeconds: currentTime,
        watchedSeconds: currentTime,
        durationSeconds: duration,
        progressPercent,
      });
      const data = "data" in response && response.data ? response.data : response;
      onProgressChange(data as LessonProgressData);
    } finally {
      saveInFlightRef.current = false;
    }
  }, [courseId, durationSeconds, lessonId, lessonProgress?.durationSeconds, onProgressChange]);

  useEffect(() => {
    const handlePageHide = () => {
      saveProgress().catch(() => {});
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handlePageHide);
      saveProgress().catch(() => {});
    };
  }, [saveProgress]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || hasRestoredRef.current) return;

    const savedSeconds = lessonProgress?.lastPositionSeconds ?? 0;
    const duration = Math.floor(video.duration || durationSeconds || lessonProgress?.durationSeconds || 0);

    if (!lessonProgress?.isCompleted && savedSeconds > 0 && savedSeconds < duration - 5) {
      video.currentTime = savedSeconds;
    }

    hasRestoredRef.current = true;
  };

  const handleTimeUpdate = () => {
    const now = Date.now();
    if (now - lastSavedAtRef.current < 10000) return;

    lastSavedAtRef.current = now;
    saveProgress().catch((error) => {
      console.warn("Khong the luu tien do video:", error);
    });
  };

  const handlePause = () => {
    saveProgress().catch((error) => {
      console.warn("Khong the luu tien do khi pause:", error);
    });
  };

  const handleCompleteLesson = async () => {
    if (!courseId || !lessonId || isCompleting) return;

    const video = videoRef.current;
    const duration = Math.floor(video?.duration || durationSeconds || lessonProgress?.durationSeconds || 0);

    try {
      setIsCompleting(true);
      const response = await completeLesson(lessonId, {
        courseId,
        durationSeconds: duration,
      });
      const data = "data" in response && response.data ? response.data : response;
      onProgressChange(data as LessonProgressData);
      onCompleted();
    } catch (error) {
      console.error("Khong the danh dau hoan thanh bai hoc:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-slate-950">
        {finalEmbedUrl ? (
          <iframe
            className="h-full w-full bg-black"
            src={finalEmbedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoUrl && isDirectVideoUrl(videoUrl) ? (
          <video
            ref={videoRef}
            className="h-full w-full bg-black"
            controls
            preload="metadata"
            src={videoUrl}
            title={title}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            onEnded={handleCompleteLesson}
          />
        ) : videoUrl ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h2 className="text-lg font-extrabold">Không thể phát video này.</h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              Vui lòng kiểm tra lại định dạng video URL.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
              <Play size={28} className="ml-1" />
            </span>
            <h2 className="text-lg font-extrabold">Bài học này chưa có video.</h2>
          </div>
        )}
      </div>
      {finalEmbedUrl ? (
        <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-300">
            Video YouTube không tự đồng bộ thời lượng xem từng giây.
          </p>
          <button
            type="button"
            onClick={handleCompleteLesson}
            disabled={isCompleting || Boolean(lessonProgress?.isCompleted)}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
          >
            <CheckCircle2 size={17} aria-hidden={true} />
            {lessonProgress?.isCompleted ? "Đã hoàn thành" : isCompleting ? "Đang lưu..." : "Đánh dấu hoàn thành"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default VideoPlayerSection;
