import { useEffect, useRef, useState } from "react";
import { Braces, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import AIAssistantSidebar from "../../components/ai/AIAssistantSidebar";
import ChatHeader from "../../components/ai/ChatHeader";
import ChatInput from "../../components/ai/ChatInput";
import ChatMessage from "../../components/ai/ChatMessage";
import SuggestedQuestionChips from "../../components/ai/SuggestedQuestionChips";
import { type ChatMessage as ChatMessageType, type LearningProgressItem, type SuggestedQuestion } from "../../components/ai/aiTypes";

const initialMessages: ChatMessageType[] = [
  {
    id: "assistant-1",
    role: "assistant",
    time: "10:24 AM",
    content:
      "Chào bạn! Tôi là trợ lý AI đồng hành cùng bạn trong khóa học Python. Bạn đang ở bài Vòng lặp For và While. Bạn có thắc mắc gì về cách sử dụng vòng lặp không?",
  },
  {
    id: "user-1",
    role: "user",
    time: "10:25 AM",
    content: "Giúp mình phân biệt khi nào dùng for và khi nào dùng while với?",
  },
  {
    id: "assistant-2",
    role: "assistant",
    time: "10:25 AM",
    content:
      "Câu hỏi rất hay! Đơn giản nhất:\n\n• For: Dùng khi bạn biết trước số lần lặp, ví dụ lặp qua danh sách.\n• While: Dùng khi bạn lặp cho đến khi một điều kiện nào đó không còn đúng.",
    code: `# Dùng FOR khi lặp qua list
fruits = ["táo", "chuối", "cam"]

for fruit in fruits:
    print(fruit)

# Dùng WHILE khi chờ điều kiện
count = 0

while count < 3:
    print("Số lần:", count)
    count += 1`,
    source: "Nguồn: Giáo trình Bài 4.2",
  },
];

const suggestedQuestions: SuggestedQuestion[] = [
  { id: "nested-loop", label: "Ví dụ về vòng lặp lồng nhau" },
  { id: "break-continue", label: "Lệnh break và continue" },
  { id: "practice", label: "Luyện tập bài này" },
];

const progressItems: LearningProgressItem[] = [
  { id: "variables", title: "Biến và kiểu dữ liệu", status: "completed" },
  { id: "loops", title: "Vòng lặp For và While", status: "current" },
  { id: "functions", title: "Hàm và Module", status: "pending" },
];

const navigation = [
  { label: "Trang chủ", to: "/" },
  { label: "Khóa học", to: "/courses" },
  { label: "AI Assistant", to: "/ai-assistant" },
];

function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (value = inputValue) => {
    const trimmedValue = value.trim();
    if (!trimmedValue || isTyping) return;

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: trimmedValue, time: "Vừa xong" },
    ]);
    setInputValue("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "AI đang dựa trên nội dung bài học và transcript để trả lời câu hỏi của bạn. Phần kết nối backend/RAG sẽ được tích hợp ở giai đoạn sau.",
          time: "Vừa xong",
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="page-container grid gap-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <AIAssistantSidebar progressItems={progressItems} />

        <section className="flex min-h-[calc(100vh-180px)] flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-card">
          <ChatHeader />

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          <div className="space-y-4 border-t border-slate-100 bg-white p-4 sm:p-5">
            <SuggestedQuestionChips questions={suggestedQuestions} onSelect={sendMessage} />
            <ChatInput value={inputValue} isTyping={isTyping} onChange={setInputValue} onSend={() => sendMessage()} />
          </div>
        </section>
      </main>

    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-500">
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="mr-3 font-medium">AI đang suy nghĩ...</span>
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="typing-dot mx-0.5 inline-block h-2 w-2 rounded-full bg-indigo-500"
            style={{ animationDelay: `${item * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function AIAssistantNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between py-3">
        <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="Python AI Learning">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <Braces size={21} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
            Python <span className="text-indigo-600">AI</span> Learning
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `focus-ring rounded px-1 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link to="/login" className="focus-ring rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600">
            Đăng nhập
          </Link>
          <Link to="/register" className="focus-ring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
            Đăng ký
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="page-container flex flex-col gap-1 border-t border-slate-100 bg-white py-4 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                item.to === "/ai-assistant" ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-indigo-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function AIAssistantFooter() {
  const links = ["Về chúng tôi", "Điều khoản dịch vụ", "Chính sách bảo mật", "Liên hệ", "Hướng dẫn"];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-extrabold text-slate-950">Python AI Learning</p>
          <p className="mt-1 text-sm text-slate-500">© 2024 Python AI Learning. Nâng tầm tri thức công nghệ Việt.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link key={link} to="/" className="text-sm font-medium text-slate-500 transition hover:text-indigo-600">
              {link}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default AIAssistantPage;
