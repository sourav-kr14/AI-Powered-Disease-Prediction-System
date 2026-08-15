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
  AlertCircle,
  Loader2,
  Activity,
  CheckCircle2,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }

    if (password.length < 6) {
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
      setError(res.error || "Failed to create account.");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 pt-2 sm:pt-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md mx-auto">
          <HeartPulse className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
          Create your health account
        </h1>
        <p className="text-sm text-[var(--text-sub)]">
          Access AI diagnostic records, nutrition tracking, and personalized care
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-xs text-[var(--danger)]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-main)]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                placeholder="Dr. Sarah Johnson or John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>
          </div>

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
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-main)]">
                Password
              </label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-main)]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Optional Health Profile Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowBiometrics(!showBiometrics)}
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>
                {showBiometrics
                  ? "Hide Initial Health Biometrics (Optional)"
                  : "+ Add Initial Health Biometrics (Optional)"}
              </span>
            </button>

            {showBiometrics && (
              <div className="mt-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-4 space-y-3 animate-in fade-in duration-150">
                <p className="text-[11px] text-[var(--text-sub)]">
                  These metrics personalize your dashboard BMI, TDEE, and nutrition targets immediately:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase">
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1.5 text-xs text-[var(--text-main)]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-sub)] uppercase">
                    Primary Fitness/Health Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-main)]"
                  >
                    <option value="maintain">Maintain Healthy Weight & Fitness</option>
                    <option value="loss">Gradual & Healthy Fat Loss</option>
                    <option value="gain">Build Lean Muscle / Increase Weight</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-sub)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)] text-center">
        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)] shrink-0" />
        <span>100% Free & Open-Source Clinical Diagnostics Framework</span>
      </div>
    </div>
  );
}
