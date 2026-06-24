import { type FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.8 3-4.4 3-7.5Z"
      />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.3l-3.2-2.6c-.9.6-2 1-3.4 1a5.8 5.8 0 0 1-5.5-4H3.2v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.5 14.1a6 6 0 0 1 0-4.2V7.3H3.2a10 10 0 0 0 0 9.4l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 3.2 7.3l3.3 2.6a5.8 5.8 0 0 1 5.5-4Z" />
    </svg>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginFormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(nextErrors).length === 0) {
      try {
        await login(email.trim(), password);
        navigate("/courses");
      } catch (error) {
        setErrors({ submit: "Email hoặc mật khẩu không đúng." });
      }
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Chào mừng trở lại</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Đăng nhập</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Tiếp tục học Python cùng trợ lý AI thông minh
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <div className="relative">
            <Mail
              size={19}
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.email ? "text-rose-500" : "text-slate-400"
              }`}
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email || errors.submit) setErrors((current) => ({ ...current, email: undefined, submit: undefined }));
              }}
              placeholder="email@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`h-[52px] w-full rounded-2xl border bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                errors.email
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <Link
              to="/forgot-password"
              className="focus-ring rounded text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole
              size={19}
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                errors.password ? "text-rose-500" : "text-slate-400"
              }`}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Nhập mật khẩu"
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`h-[52px] w-full rounded-2xl border bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                errors.password
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.password}
            </p>
          )}
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Ghi nhớ đăng nhập
        </label>

        <button
          type="submit"
          className="focus-ring group flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:shadow-indigo-200"
        >
          Đăng nhập
        </button>
        {errors.submit && (
          <p className="mt-3 text-center text-sm font-medium text-rose-600">
            {errors.submit}
          </p>
        )}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Tài khoản test:</p>
        <p>Email: <span className="font-medium text-slate-800">student@test.com</span></p>
        <p>Mật khẩu: <span className="font-medium text-slate-800">123456</span></p>
      </div>

      <div className="my-7 flex items-center gap-3" aria-label="hoặc đăng nhập bằng">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">hoặc đăng nhập bằng</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="focus-ring flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className="focus-ring flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-sm font-extrabold leading-none text-white">
            f
          </span>
          Facebook
        </button>
      </div>

      <p className="mt-7 text-center text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="focus-ring rounded font-bold text-indigo-600 transition hover:text-indigo-800">
          Đăng ký ngay
        </Link>
      </p>

      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
        Dành cho Học viên, Giảng viên và Quản trị viên
      </p>
    </div>
  );
}

export default LoginForm;
