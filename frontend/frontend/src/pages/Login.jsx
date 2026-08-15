import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(res.error || "Invalid email or password.");
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
      setError(res.error || "Demo login failed.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 pt-4 sm:pt-8 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md mx-auto">
          <HeartPulse className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--text-sub)]">
          Sign in to access your clinical dashboard & health history
        </p>
      </div>

      {/* Main Login Card */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm space-y-5">
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-xs text-[var(--danger)]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-main)]">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                placeholder="doctor@hospital.org or you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-main)]">
                Password
              </label>
              <span className="text-[11px] text-[var(--text-muted)]">
                Min. 6 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] pl-10 pr-10 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[var(--border-color)]" />
          <span className="absolute bg-[var(--bg-surface)] px-3 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            or explore with 1-click
          </span>
        </div>

        {/* 1-Click Demo Account */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] py-2.5 text-xs font-bold text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[var(--primary)]" />
          <span>Try 1-Click Clinical Demo Account</span>
        </button>

        {/* Sign up prompt */}
        <p className="text-center text-xs text-[var(--text-sub)]">
          Don&apos;t have an account yet?{" "}
          <Link
            to="/signup"
            className="font-bold text-[var(--primary)] hover:underline"
          >
            Create free account
          </Link>
        </p>
      </div>

      {/* Trust & Privacy Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
        <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
        <span>End-to-end encrypted medical session & private health storage</span>
      </div>
    </div>
  );
}
