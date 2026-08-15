import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  Stethoscope,
  MessageSquare,
  Activity,
  Flame,
  Apple,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { theme, toggle } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home" },
    ...(isAuthenticated
      ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
      : []),
    { path: "/predict", label: "Symptom Checker", icon: Stethoscope },
    { path: "/chat", label: "Health Assistant", icon: MessageSquare },
    { path: "/bmi", label: "BMI Calculator", icon: Activity },
    { path: "/calories", label: "Calorie Tracker", icon: Flame },
    { path: "/diet", label: "Diet Planner", icon: Apple },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-150">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-lg text-[var(--text-main)] hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-extrabold tracking-tight">SymptoScan</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[var(--primary-light)] text-[var(--primary)] font-bold"
                      : "text-[var(--text-sub)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-sub)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Auth Buttons or User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-1.5 pr-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-all cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold shadow-xs">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 shadow-xl animate-in fade-in duration-150 z-50">
                    <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate">
                        {user?.name || "Member"}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[var(--primary)]" />
                      <span>Health Dashboard</span>
                    </Link>

                    <Link
                      to="/predict"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-colors"
                    >
                      <Stethoscope className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>Symptom Checker</span>
                    </Link>

                    <div className="border-t border-[var(--border-color)] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-xs"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-sub)] hover:bg-[var(--bg-surface-subtle)]"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 lg:hidden space-y-2">
            {isAuthenticated && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)] truncate max-w-[160px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-[var(--primary-light)] text-[var(--primary)] font-bold"
                      : "text-[var(--text-sub)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-[var(--border-color)] grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-[var(--border-color)] py-2.5 text-center text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[var(--primary)] py-2.5 text-center text-xs font-bold text-white hover:bg-[var(--primary-hover)]"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>

      {/* Clean, Simple Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-6 text-center text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-5xl px-4 space-y-2">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> SymptoScan provides AI-assisted health
            information for educational purposes only. It is not a substitute for
            professional medical advice, diagnosis, or treatment. Always consult a qualified
            healthcare provider for personal health questions.
          </p>
          <p>© {new Date().getFullYear()} SymptoScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
