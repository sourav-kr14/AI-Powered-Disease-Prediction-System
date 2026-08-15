import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Search,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Activity,
  Menu,
  HeartPulse,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar({ onOpenCommand, onOpenMobileMenu }) {
  const { theme, toggle } = useTheme();
  const [latency, setLatency] = useState(24);

  // Subtle simulated telemetry pulse for enterprise feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(20 + Math.random() * 12));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-12 w-full items-center justify-between border-b border-[var(--border-base)] bg-[var(--topbar-bg)] px-3 sm:px-4 text-xs">
      {/* Left side: Mobile Toggle & Brand Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden rounded-md p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-[var(--text-primary)] hover:opacity-90"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--brand-primary)] text-white">
            <HeartPulse className="h-3.5 w-3.5" />
          </div>
          <span className="tracking-tight font-semibold">SymptoScan</span>
          <span className="hidden sm:inline-block rounded bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)]">
            v3.0-ENTERPRISE
          </span>
        </Link>
      </div>

      {/* Center: Global Search / Command Bar Trigger */}
      <div className="flex flex-1 justify-center px-4 max-w-md">
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex w-full items-center justify-between rounded-md border border-[var(--border-base)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--border-focus)] hover:text-[var(--text-secondary)] transition-colors shadow-[var(--shadow-subtle)]"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search symptoms, triage tools...</span>
            <span className="sm:hidden">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[var(--border-base)] bg-[var(--surface-base)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Telemetry & Controls */}
      <div className="flex items-center gap-3">
        {/* API Telemetry (Desktop only) */}
        <div className="hidden md:flex items-center gap-3 border-r border-[var(--border-subtle)] pr-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-[var(--status-success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
            <span className="font-mono font-medium">API OK</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-muted)] font-mono">
            <Zap className="h-3 w-3 text-[var(--brand-text)]" />
            <span>{latency}ms</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-base)] bg-[var(--surface-base)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </header>
  );
}
