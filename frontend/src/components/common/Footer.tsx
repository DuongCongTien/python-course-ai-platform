import { Braces, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = ["Về chúng tôi", "Khóa học", "AI Assistant", "Hướng dẫn"];
const policyLinks = ["Điều khoản dịch vụ", "Chính sách bảo mật"];

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Braces size={20} />
              </span>
              <span className="font-extrabold text-slate-950">Python AI Learning</span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Nền tảng học Python tích hợp AI giúp người học hiểu sâu, ôn tập nhanh và tiến bộ rõ ràng.
            </p>
          </div>

          <FooterLinks title="Liên kết nhanh" links={quickLinks} />
          <FooterLinks title="Chính sách" links={policyLinks} />

          <div>
            <h3 className="mb-4 font-bold text-slate-950">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Mail size={17} className="shrink-0 text-indigo-600" />
                contact@pythonai.vn
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="shrink-0 text-indigo-600" />
                +84 123 456 789
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={17} className="shrink-0 text-indigo-600" />
                TP. Đà Nẵng, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-7 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Python AI Learning. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

interface FooterLinksProps {
  title: string;
  links: string[];
}

function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <h3 className="mb-4 font-bold text-slate-950">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-slate-600 transition hover:text-indigo-600" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
