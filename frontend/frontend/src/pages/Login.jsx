import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Stethoscope,
  X,
  Info,
  HeartPulse,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    const res = await login({ email: email.trim(), password });
    setLoading(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.error || "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    const res = await demoLogin();
    setLoading(false);

    if (res.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(res.error || "Unable to initialize practitioner demo session.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[86vh] animate-in fade-in duration-200">
      {/* ── LEFT PANEL: Focused Authentication Entrance ── */}
      <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-[var(--bg-surface)] overflow-y-auto">
        {/* Brand & Heading */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white shadow-md shadow-red-500/25 ring-2 ring-red-500/20">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[var(--text-main)]">
                  Sympto<span className="text-red-600 dark:text-rose-500">Scan</span>
                </span>
              </div>
              <span className="block text-[10px] font-bold tracking-widest uppercase text-red-600 dark:text-rose-400">
                Clinical AI Intelligence
              </span>
            </div>
          </Link>

          <div className="space-y-1 pt-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Sign in to your account
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Diagnostic prediction and clinical records for healthcare providers and patients.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="my-auto py-3 space-y-3">
          {/* Accessible High-Contrast Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-300 dark:border-red-600/70 bg-red-50 dark:bg-red-950/90 p-3 text-xs shadow-xs animate-in fade-in duration-150"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-900 dark:text-red-100 tracking-wide text-xs">
                  Authentication Notice
                </p>
                <p className="text-red-800 dark:text-red-200 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[var(--text-sub)]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="doctor@hospital.org or patient@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[var(--text-sub)]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-red-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-10 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-rose-600 dark:hover:bg-rose-500 py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Understated Demo Access */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-red-600 dark:text-rose-400 shrink-0" />
                <span className="text-xs font-semibold">
                  1-Click Practitioner Demo (Dr. Alex Taylor)
                </span>
              </div>
              <span className="text-xs text-red-600 dark:text-rose-400 font-bold">
                Launch →
              </span>
            </button>
          </div>
        </div>

        {/* Footer: Register Switch & Security Assurance */}
        <div className="pt-3 border-t border-[var(--border-color)] space-y-1.5">
          <p className="text-center text-xs text-[var(--text-sub)]">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-red-600 dark:text-rose-400 hover:underline"
            >
              Create free account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--text-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-red-600 dark:text-rose-400" />
            <span>Private session · Encrypted health data</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Visual Metaphor (Clean Harmonic Waveform) ── */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 border-l border-slate-800 text-white p-8 flex-col justify-center items-center relative overflow-hidden select-none">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        {/* Center: The Biometric Waveform & Harmonic Resonance Metaphor */}
        <div className="relative z-10 w-full space-y-6 text-center">
          {/* Harmonic Wave Resonance SVG */}
          <div className="w-full flex items-center justify-center">
            <svg
              className="w-full max-w-[260px] h-32 overflow-visible"
              viewBox="0 0 280 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Concentric subtle resonance rings */}
              <circle cx="210" cy="60" r="35" stroke="#f43f5e" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="210" cy="60" r="20" stroke="#f43f5e" strokeOpacity="0.25" strokeWidth="1" />

              {/* Layer 1: Scattered input symptom waves */}
              <path
                d="M 10 60 Q 35 25, 60 60 T 110 60 T 160 60 T 210 60 L 270 60"
                stroke="#fda4af"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 10 60 Q 30 90, 55 60 T 100 75 T 150 45 T 210 60 L 270 60"
                stroke="#f43f5e"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Layer 2: Main Focused Clinical Insight Pulse */}
              <path
                d="M 10 60 L 70 60 Q 95 60, 110 30 Q 125 0, 135 105 Q 145 125, 155 20 Q 165 -5, 175 60 L 210 60 L 270 60"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Focus Point Glow */}
              <circle cx="210" cy="60" r="4" fill="#fb7185" />
              <circle cx="210" cy="60" r="8" fill="#fb7185" fillOpacity="0.25" />
            </svg>
          </div>

          {/* Narrative Statement */}
          <div className="space-y-1.5 px-2">
            <h2 className="text-sm font-bold text-white tracking-tight leading-snug">
              Translating human symptoms into clinical clarity.
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              SymptoScan connects symptom signals with validated classification models for intelligent diagnostic guidance.
            </p>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Assistance Modal ── */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-red-600 dark:text-rose-400" />
                <h3 id="forgot-modal-title" className="font-bold text-sm text-[var(--text-main)]">
                  Account Access Help
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                aria-label="Close dialog"
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-sub)] leading-relaxed">
              If you need instant access for evaluation, you can launch the built-in{" "}
              <strong>Dr. Alex Taylor Practitioner Demo Session</strong> with a single click, or register a new clinical account.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-xs font-bold text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  handleDemoLogin();
                }}
                className="rounded-xl bg-red-600 dark:bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 dark:hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Launch Demo Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


