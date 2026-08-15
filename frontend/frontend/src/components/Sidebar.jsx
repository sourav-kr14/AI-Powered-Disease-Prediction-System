import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import {
  Stethoscope,
  Activity,
  Apple,
  Flame,
  MessageSquare,
  Sun,
  Moon,
  HeartPulse,
  X,
} from "lucide-react";

const navItems = [
  { path: "/predict", label: "Symptom Analysis", icon: Stethoscope },
  { path: "/bmi", label: "BMI Calculator", icon: Activity },
  { path: "/diet", label: "Diet Planner", icon: Apple },
  { path: "/calories", label: "Calorie Calculator", icon: Flame },
  { path: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex h-full flex-col bg-[var(--sidebar-bg)] border-r border-[var(--color-border-subtle)]">
      {/* Brand */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border-subtle)]">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[var(--color-text)]"
          onClick={onClose}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)] text-white">
            <HeartPulse className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            SymptoScan
          </span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Tools
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors duration-100 ${
                    isActive
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-text)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--color-border-subtle)] px-2 py-3 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] transition-colors duration-100"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>

        {/* Disclaimer */}
        <p className="px-2.5 text-[11px] leading-relaxed text-[var(--color-text-muted)]">
          For educational use only. Not a substitute for professional medical
          advice.
        </p>
      </div>
    </div>
  );
}
