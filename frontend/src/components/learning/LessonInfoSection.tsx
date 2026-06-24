import { CheckCircle2 } from "lucide-react";

function LessonInfoSection() {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Bài 4: Vòng lặp trong Python</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Trong bài học này, chúng ta sẽ tìm hiểu về cách tối ưu hóa code bằng vòng lặp for và while.
            Hiểu rõ sự khác biệt giữa hai loại vòng lặp và cách ứng dụng chúng trong thực tế xử lý dữ liệu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => console.log("Lesson marked as completed")}
          className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700"
        >
          <CheckCircle2 size={18} />
          Đánh dấu hoàn thành
        </button>
      </div>
    </section>
  );
}

export default LessonInfoSection;
