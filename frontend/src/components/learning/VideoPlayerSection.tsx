import { Maximize, Pause, Play, Settings, Volume2 } from "lucide-react";

function VideoPlayerSection() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-200">
      <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_25%_20%,rgba(99,102,241,.35),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,.28),transparent_35%)]" />
        <div className="absolute left-6 top-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-xs leading-6 text-slate-300 shadow-inner backdrop-blur">
          <p><span className="text-blue-300">for</span> number <span className="text-blue-300">in</span> range(5):</p>
          <p className="pl-5">print(<span className="text-emerald-300">"Python AI"</span>, number)</p>
          <p className="mt-2"><span className="text-fuchsia-300">while</span> is_learning:</p>
          <p className="pl-5">practice_more()</p>
        </div>

        <button
          type="button"
          className="focus-ring absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-900/50 transition hover:scale-105 hover:bg-indigo-700"
          aria-label="Phát video"
        >
          <Play size={34} className="ml-1 fill-white" />
        </button>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[34%] rounded-full bg-indigo-500" />
          </div>
          <div className="flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <Pause size={18} className="fill-white" />
              <span className="text-xs font-semibold">04:12 / 12:30</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Volume2 size={18} />
              <Settings size={18} />
              <Maximize size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoPlayerSection;
