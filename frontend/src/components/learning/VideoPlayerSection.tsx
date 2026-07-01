interface VideoPlayerSectionProps {
  videoUrl?: string;
}

function VideoPlayerSection({ videoUrl }: VideoPlayerSectionProps) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-black shadow-card">
      {videoUrl ? (
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            title="Video bài học"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-slate-900 text-slate-400">
          Chưa có video
        </div>
      )}
    </div>
  );
}

export default VideoPlayerSection;