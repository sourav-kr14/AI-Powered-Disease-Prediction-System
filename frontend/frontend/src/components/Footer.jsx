import React from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { HeartPulse } from "lucide-react";

const socialLinks = [
  {
    href: "#",
    label: "GitHub",
    icon: FiGithub,
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: FiLinkedin,
  },
  {
    href: "mailto:your@email.com",
    label: "Email",
    icon: FiMail,
  },
];

const Footer = () => {
  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-white/10 bg-[#07111a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-32 w-32 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Sympto Scan
              </p>
              <h3 className="text-lg font-semibold text-white">
                AI-assisted health guidance
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Built for fast, clear, and modern health insights. For educational
            use only and not a substitute for professional medical advice.
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 md:items-end">
          <div className="flex gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">
              © 2026 Sympto Scan
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Designed for a cleaner healthcare experience.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
