import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Stethoscope,
  MessageSquare,
  Activity,
  Apple,
  Flame,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Heart,
  LayoutDashboard,
  UserCheck,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  const tools = [
    ...(isAuthenticated
      ? [
          {
            to: "/dashboard",
            title: "Health Dashboard",
            description:
              "Review your personalized vital metrics, daily hydration, and complete diagnostic history.",
            icon: LayoutDashboard,
            badge: "Personalized",
            color: "text-rose-600",
          },
        ]
      : []),
    {
      to: "/predict",
      title: "Symptom Checker",
      description:
        "Enter what you're feeling and our AI model will analyze your symptoms to suggest potential conditions.",
      icon: Stethoscope,
      badge: "Primary Tool",
      color: "text-rose-600",
    },
    {
      to: "/chat",
      title: "Health Assistant",
      description:
        "Have an interactive, step-by-step conversation about your symptoms and download a health report.",
      icon: MessageSquare,
      badge: "Interactive",
      color: "text-red-500",
    },
    {
      to: "/bmi",
      title: "BMI Calculator",
      description:
        "Calculate your Body Mass Index and see whether your weight is in a healthy range for your height.",
      icon: Activity,
      badge: "Quick Check",
      color: "text-rose-500",
    },
    {
      to: "/calories",
      title: "Calorie Tracker",
      description:
        "Find out how many calories your body burns each day and set targets for weight loss, maintenance, or gain.",
      icon: Flame,
      badge: "Nutrition",
      color: "text-orange-500",
    },
    {
      to: "/diet",
      title: "Diet Planner",
      description:
        "Get a customized daily meal plan with balanced breakfast, lunch, snack, and dinner suggestions.",
      icon: Apple,
      badge: "Meal Plans",
      color: "text-rose-600",
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Diagnostics",
      description:
        "Trained on comprehensive medical datasets covering 130+ symptoms and dozens of common health conditions.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description:
        "Your health queries stay confidential. We do not store or sell your personal health records.",
    },
    {
      icon: Clock,
      title: "Fast & Accessible",
      description:
        "Get instant insights anytime, from anywhere, without complicated medical jargon.",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-1.5 text-xs font-semibold text-[var(--primary)] shadow-xs">
          <Heart className="h-3.5 w-3.5 fill-current text-[var(--primary)]" />
          <span>Your Clinical Health Companion</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] max-w-2xl mx-auto leading-tight">
          Check symptoms & monitor your wellness
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-sub)] max-w-xl mx-auto leading-relaxed">
          Smart, reliable tools to help you evaluate symptoms, calculate your daily
          nutrition needs, and track clinical health history.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] shadow-sm transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard ({user?.name?.split(" ")[0]})</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] shadow-xs transition-all"
              >
                <Stethoscope className="h-4 w-4 text-[var(--primary)]" />
                <span>Start Symptom Check</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] shadow-sm transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Start Symptom Check</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] shadow-xs transition-all"
              >
                <UserCheck className="h-4 w-4 text-[var(--primary)]" />
                <span>Sign In to Dashboard</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Health Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">
              Clinical & Wellness Tools
            </h2>
            <p className="text-sm text-[var(--text-sub)]">
              Select an assessment tool below to begin
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all duration-150"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-light)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors text-[var(--primary)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--text-sub)]">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-sub)] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[var(--primary)]">
                  <span>Open Tool</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Use SymptoScan */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)]">
            Clinical clarity & peace of mind
          </h2>
          <p className="text-sm text-[var(--text-sub)]">
            Simple health tools powered by validated classification models
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {f.title}
                </h3>
                <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
