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

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<number | null>(null);
  const hasRestoredRef = useRef(false);
  const lastSavedAtRef = useRef(0);
  const saveInFlightRef = useRef(false);
  const runtimeRef = useRef({
    courseId,
    durationSeconds,
    lessonId,
    lessonProgress,
    onEnded,
    onProgressChange,
  });

  useEffect(() => {
    runtimeRef.current = {
      courseId,
      durationSeconds,
      lessonId,
      lessonProgress,
      onEnded,
      onProgressChange,
    };
  }, [courseId, durationSeconds, lessonId, lessonProgress, onEnded, onProgressChange]);

  const finalEmbedUrl = useMemo(() => {
    if (embedUrl) return embedUrl;

    if (provider?.toLowerCase() === "youtube" || isYouTubeUrl(videoUrl)) {
      return getYouTubeEmbedUrl(videoUrl);
    }

    return null;
  }, [embedUrl, provider, videoUrl]);

  const isYoutube = Boolean(
    finalEmbedUrl && (provider?.toLowerCase() === "youtube" || isYouTubeUrl(videoUrl) || isYouTubeUrl(finalEmbedUrl)),
  );
  const youtubeSrc = useMemo(() => {
    if (!finalEmbedUrl || typeof window === "undefined") return finalEmbedUrl;

    const separator = finalEmbedUrl.includes("?") ? "&" : "?";
    return `${finalEmbedUrl}${separator}enablejsapi=1&origin=${window.location.origin}`;
  }, [finalEmbedUrl]);

  useEffect(() => {
    hasRestoredRef.current = false;
    lastSavedAtRef.current = 0;
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    playerRef.current?.destroy?.();
    playerRef.current = null;
  }, [lessonId, videoUrl, finalEmbedUrl]);

  const saveYoutubeProgress = useCallback(async () => {
    const player = playerRef.current;
    const current = runtimeRef.current;
    if (!player || !current.courseId || !current.lessonId || saveInFlightRef.current || current.lessonProgress?.isCompleted) {
      return;
    }

    const currentTime = Math.floor(player.getCurrentTime?.() || 0);
    const duration = Math.floor(
      player.getDuration?.() || current.durationSeconds || current.lessonProgress?.durationSeconds || 0,
    );
    if (duration <= 0) return;

    const progressPercent = Math.min(99, Math.round((currentTime / duration) * 100));
    saveInFlightRef.current = true;

    try {
      const response = await updateLessonProgress(current.lessonId, {
        courseId: current.courseId,
        lastPositionSeconds: currentTime,
        watchedSeconds: currentTime,
        durationSeconds: duration,
        progressPercent,
      });
      const data = "data" in response && response.data ? response.data : response;
      current.onProgressChange(data as LessonProgressData);
    } finally {
      saveInFlightRef.current = false;
    }
  }, []);

  const stopProgressTimer = useCallback(() => {
    if (!progressTimerRef.current) return;

    window.clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
  }, []);

  const startProgressTimer = useCallback(() => {
    if (progressTimerRef.current || runtimeRef.current.lessonProgress?.isCompleted) return;

    progressTimerRef.current = window.setInterval(() => {
      saveYoutubeProgress().catch((error) => {
        console.warn("Không thể lưu tiến độ video YouTube:", error);
      });
    }, 10000);
  }, [saveYoutubeProgress]);

  useEffect(() => {
    if (!isYoutube || !iframeRef.current) return;

    let isDisposed = false;
    const previousReady = window.onYouTubeIframeAPIReady;

    const setupPlayer = () => {
      if (isDisposed || !window.YT?.Player || !iframeRef.current) return;

      playerRef.current?.destroy?.();
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT?.PlayerState?.PLAYING) {
              startProgressTimer();
            }

            if (event.data === window.YT?.PlayerState?.PAUSED) {
              stopProgressTimer();
              saveYoutubeProgress().catch((error) => {
                console.warn("Không thể lưu tiến độ khi pause:", error);
              });
            }

            if (event.data === window.YT?.PlayerState?.ENDED) {
              stopProgressTimer();
              const duration = Math.floor(playerRef.current?.getDuration?.() || runtimeRef.current.durationSeconds || 0);
              runtimeRef.current.onEnded(duration);
            }
          },
        },
      });
    };

    if (!window.YT?.Player) {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        setupPlayer();
      };
    } else {
      setupPlayer();
    }

    return () => {
      isDisposed = true;
      stopProgressTimer();
      saveYoutubeProgress().catch(() => {});
      playerRef.current?.destroy?.();
      playerRef.current = null;
      if (window.onYouTubeIframeAPIReady !== previousReady) {
        window.onYouTubeIframeAPIReady = previousReady;
      }
    };
  }, [isYoutube, lessonId, saveYoutubeProgress, startProgressTimer, stopProgressTimer, youtubeSrc]);

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
      if (isYoutube) {
        saveYoutubeProgress().catch(() => {});
        return;
      }

      saveProgress().catch(() => {});
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handlePageHide);
      if (isYoutube) {
        saveYoutubeProgress().catch(() => {});
      } else {
        saveProgress().catch(() => {});
      }
    };
  }, [isYoutube, saveProgress, saveYoutubeProgress]);

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
        {finalEmbedUrl ? (
          <iframe
            key={`${lessonId}-${youtubeSrc ?? finalEmbedUrl}`}
            ref={iframeRef}
            className="h-full w-full bg-black"
            src={youtubeSrc ?? finalEmbedUrl}
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
