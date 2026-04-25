import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  MessageSquare,
  Activity,
  Apple,
  Flame,
  ArrowRight,
  ShieldCheck,
  Brain,
  HeartPulse,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    to: "/predict",
    title: "Predict Disease",
    description:
      "Run multi-parameter symptom analysis to surface early risk patterns and likely conditions.",
    icon: Stethoscope,
    tag: "Clinical ML",
    accent: "from-cyan-400 to-sky-500",
    surface: "bg-cyan-500/10",
  },
  {
    to: "/chat",
    title: "Symptom Chatbot",
    description:
      "Ask questions naturally and get guided symptom support with a fast conversational assistant.",
    icon: MessageSquare,
    tag: "24/7 AI",
    accent: "from-teal-400 to-emerald-500",
    surface: "bg-teal-500/10",
  },
  {
    to: "/bmi",
    title: "BMI Calculator",
    description:
      "Check body metrics, weight range context, and quick wellness indicators in seconds.",
    icon: Activity,
    tag: "Vitals",
    accent: "from-emerald-400 to-lime-500",
    surface: "bg-emerald-500/10",
  },
  {
    to: "/diet",
    title: "Diet Planner",
    description:
      "Generate nutrition direction based on your goals, habits, and physical health profile.",
    icon: Apple,
    tag: "Nutrition",
    accent: "from-orange-400 to-amber-500",
    surface: "bg-orange-500/10",
  },
  {
    to: "/calories",
    title: "Calorie Tracker",
    description:
      "Estimate daily energy needs and calorie targets for structured, sustainable progress.",
    icon: Flame,
    tag: "Metabolism",
    accent: "from-rose-400 to-orange-500",
    surface: "bg-rose-500/10",
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Built for secure health workflows with a calm, trustworthy experience.",
  },
  {
    icon: Brain,
    title: "Actionable intelligence",
    text: "Turn symptoms and metrics into sharper next steps with AI-assisted analysis.",
  },
  {
    icon: HeartPulse,
    title: "One health dashboard",
    text: "Prediction, nutrition, BMI, and calorie planning in one connected interface.",
  },
];

const stats = [
  { value: "5", label: "Smart modules" },
  { value: "24/7", label: "AI assistance" },
  { value: "1", label: "Unified experience" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07111a] text-white selection:bg-cyan-300/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.20),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.14),_transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-10 lg:px-12">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid min-h-[92vh] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div>
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />
              AI Health Intelligence
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white md:text-7xl lg:text-[92px]"
            >
              Modern care
              <span className="block text-cyan-300">starts with clarity.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg"
            >
              SymptoScan brings prediction, nutrition, body metrics, and guided
              health support into one focused AI-powered workspace designed to
              feel precise, fast, and trustworthy.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/predict"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-200"
              >
                Start Diagnosis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                Talk to Assistant
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 grid max-w-xl grid-cols-3 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="text-2xl font-black text-white md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-orange-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
                    Live Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Health command center
                  </h2>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Active
                </div>
              </div>

              <div className="space-y-4">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-white/10 bg-[#0b1824]/80 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-white/5 p-3 text-cyan-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm leading-7 text-slate-400">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-300/10 to-orange-300/10 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                  Recommended flow
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-white">
                  <span className="rounded-full bg-white/10 px-4 py-2">
                    Predict
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-full bg-white/10 px-4 py-2">
                    Chat
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-full bg-white/10 px-4 py-2">
                    Improve Plan
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <section className="relative z-10 mt-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">
                Core Tools
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-5xl">
                Everything important.
                <span className="block text-slate-400">
                  Nothing visually noisy.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Every module is designed as a clear action surface so users can
              move from concern to insight without friction.
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <motion.div key={tool.to} variants={fadeUp} className="group">
                  <Link
                    to={tool.to}
                    className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tool.accent}`}
                    />
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl transition duration-500 group-hover:scale-125" />

                    <div>
                      <div className="mb-8 flex items-center justify-between">
                        <div
                          className={`rounded-2xl ${tool.surface} border border-white/10 p-4`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                          {tool.tag}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold tracking-[-0.03em] text-white">
                        {tool.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-cyan-200">
                      Open module
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
