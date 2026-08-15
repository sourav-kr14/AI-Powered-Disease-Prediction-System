import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HeartPulse,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Optional initial health biometrics
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [goal, setGoal] = useState("maintain");
  const [showBiometrics, setShowBiometrics] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Validation indicators
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPassLengthValid = password.length >= 6;
  const isPassComplexValid = /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);
  const isPassMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPassLengthValid) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    const profileData = {
      age: Number(age) || 25,
      gender: gender || "male",
      weight: Number(weight) || 70,
      height: Number(height) || 175,
      goal: goal || "maintain",
      activityLevel: "moderate",
    };

    const res = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      profile: profileData,
    });

    setLoading(false);

    if (res.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(res.error || "Failed to create clinical account.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[86vh] animate-in fade-in duration-200">
      {/* ── LEFT PANEL: Form ── */}
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
              Create your account
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Start analyzing symptom patterns and monitoring your health metrics.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="my-auto py-3 space-y-3">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-300 dark:border-red-600/70 bg-red-50 dark:bg-red-950/90 p-3 text-xs shadow-xs animate-in fade-in duration-150"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-900 dark:text-red-100 tracking-wide text-xs">
                  Registration Notice
                </p>
                <p className="text-red-800 dark:text-red-200 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-[var(--text-sub)]"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Dr. Sarah Johnson or John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-[var(--text-sub)]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-[var(--text-sub)]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-10 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-semibold text-[var(--text-sub)]"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] pl-10 pr-4 py-2 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-red-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-red-600/15 dark:focus:ring-rose-400/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]">
              <span className={`inline-flex items-center gap-1 ${isPassLengthValid ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-[var(--text-muted)]"}`}>
                <Check className={`h-3 w-3 ${isPassLengthValid ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300"}`} />
                6+ characters
              </span>
              <span className={`inline-flex items-center gap-1 ${isPassComplexValid ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-[var(--text-muted)]"}`}>
                <Check className={`h-3 w-3 ${isPassComplexValid ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300"}`} />
                Alphanumeric
              </span>
              <span className={`inline-flex items-center gap-1 ${isPassMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-[var(--text-muted)]"}`}>
                <Check className={`h-3 w-3 ${isPassMatch ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300"}`} />
                Passwords match
              </span>
            </div>

            {/* Optional Biometrics Accordion */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowBiometrics(!showBiometrics)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <span>{showBiometrics ? "Hide biometrics profile" : "+ Optional baseline biometrics (Age, Gender, BMI)"}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showBiometrics ? "rotate-180" : ""}`} />
              </button>

              {showBiometrics && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] animate-in fade-in duration-150">
                  <div>
                    <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-main)]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-main)]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-main)]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>
              )}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-color)] space-y-1.5">
          <p className="text-center text-xs text-[var(--text-sub)]">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-bold text-red-600 dark:text-rose-400 hover:underline"
            >
              Sign in to workspace
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
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full space-y-6 text-center">
          <div className="w-full flex items-center justify-center">
            <svg
              className="w-full max-w-[260px] h-32 overflow-visible"
              viewBox="0 0 280 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="210" cy="60" r="35" stroke="#f43f5e" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="210" cy="60" r="20" stroke="#f43f5e" strokeOpacity="0.25" strokeWidth="1" />
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
              <path
                d="M 10 60 L 70 60 Q 95 60, 110 30 Q 125 0, 135 105 Q 145 125, 155 20 Q 165 -5, 175 60 L 210 60 L 270 60"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="210" cy="60" r="4" fill="#fb7185" />
              <circle cx="210" cy="60" r="8" fill="#fb7185" fillOpacity="0.25" />
            </svg>
          </div>

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
    </div>
  );
}


