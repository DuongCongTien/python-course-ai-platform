import { useCallback, useEffect, useMemo, useRef } from "react";
import { Play } from "lucide-react";
import {
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
  onEnded: (durationSeconds: number) => void;
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
  onEnded,
}: VideoPlayerSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasRestoredRef = useRef(false);
  const lastSavedAtRef = useRef(0);
  const saveInFlightRef = useRef(false);

  const finalEmbedUrl = useMemo(() => {
    if (embedUrl) return embedUrl;

    if (provider?.toLowerCase() === "youtube" || isYouTubeUrl(videoUrl)) {
      return getYouTubeEmbedUrl(videoUrl);
    }

    return null;
  }, [embedUrl, provider, videoUrl]);

  const iframeSrc = useMemo(() => {
    if (!finalEmbedUrl) return null;
    const separator = finalEmbedUrl.includes("?") ? "&" : "?";
    return `${finalEmbedUrl}${separator}rel=0&modestbranding=1`;
  }, [finalEmbedUrl]);

  useEffect(() => {
    hasRestoredRef.current = false;
    lastSavedAtRef.current = 0;
    saveInFlightRef.current = false;
  }, [lessonId, videoUrl, finalEmbedUrl]);

  const saveProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !courseId || !lessonId || saveInFlightRef.current || lessonProgress?.isCompleted) return;

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
  }, [courseId, durationSeconds, lessonId, lessonProgress?.durationSeconds, lessonProgress?.isCompleted, onProgressChange]);

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
      console.warn("Không thể lưu tiến độ video:", error);
    });
  };

  const handlePause = () => {
    saveProgress().catch((error) => {
      console.warn("Không thể lưu tiến độ khi pause:", error);
    });
  };

  const handleEnded = () => {
    const video = videoRef.current;
    const duration = Math.floor(video?.duration || durationSeconds || lessonProgress?.durationSeconds || 0);
    onEnded(duration);
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-slate-950">
        {iframeSrc ? (
          <iframe
            key={`${lessonId}-${iframeSrc}`}
            className="h-full w-full bg-black"
            src={iframeSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : videoUrl && isDirectVideoUrl(videoUrl) ? (
          <video
            key={`${lessonId}-${videoUrl}`}
            ref={videoRef}
            className="h-full w-full bg-black"
            controls
            preload="metadata"
            src={videoUrl}
            title={title}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            onEnded={handleEnded}
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
    </section>
  );
}

export default VideoPlayerSection;
