import { Play } from "lucide-react";

interface VideoPlayerSectionProps {
  videoUrl: string | null;
  title: string;
}

function VideoPlayerSection({ videoUrl, title }: VideoPlayerSectionProps) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-slate-950">
        {videoUrl ? (
          <video className="h-full w-full bg-black" controls preload="metadata" src={videoUrl} title={title} />
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
