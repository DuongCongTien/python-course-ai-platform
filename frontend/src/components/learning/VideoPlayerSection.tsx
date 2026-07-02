import { useCallback, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import {
  completeLesson,
  updateLessonProgress,
  type LessonProgressData,
} from "../../services/progress.service";

interface VideoPlayerSectionProps {
  videoUrl: string | null;
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

  useEffect(() => {
    hasRestoredRef.current = false;
    lastSavedAtRef.current = 0;
  }, [lessonId, videoUrl]);

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

  const handleEnded = async () => {
    const video = videoRef.current;
    const duration = Math.floor(video?.duration || durationSeconds || lessonProgress?.durationSeconds || 0);

    try {
      const response = await completeLesson(lessonId, {
        courseId,
        durationSeconds: duration,
      });
      const data = "data" in response && response.data ? response.data : response;
      onProgressChange(data as LessonProgressData);
      onCompleted();
    } catch (error) {
      console.error("Khong the danh dau hoan thanh bai hoc:", error);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-slate-950">
        {videoUrl ? (
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
            onEnded={handleEnded}
          />
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
