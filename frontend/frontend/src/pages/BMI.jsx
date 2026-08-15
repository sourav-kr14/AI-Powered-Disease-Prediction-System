import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Weight,
  Ruler,
  User,
  Activity,
  ShieldAlert,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  unit,
  icon: Icon,
}) => (
  <div className="flex flex-col gap-2">
    <label className="ml-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
      {label}
    </label>

    <div className="group relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <Icon className="h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-200" />
      </div>

      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#07111a] py-4 pl-11 pr-14 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
      />

      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200/80">
        {unit}
      </span>
    </div>
  </div>
);

export default function BMI() {
  const [view, setView] = useState("input");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    const ageValue = Number(age);
    const weightValue = Number(weight);
    const heightValue = Number(height);

    if (!ageValue || !weightValue || !heightValue) return;
    if (weightValue <= 0 || heightValue <= 0) return;

    const heightInMeters = heightValue / 100;
    const bmi = weightValue / (heightInMeters * heightInMeters);

    let status = "";
    let accent = "";
    let message = "";

    if (bmi < 18.5) {
      status = "Underweight";
      accent = "text-amber-200";
      message = "A lower-than-recommended BMI may suggest nutritional review.";
    } else if (bmi < 25) {
      status = "Healthy range";
      accent = "text-emerald-200";
      message = "Your BMI falls within the generally recommended range.";
    } else if (bmi < 30) {
      status = "Overweight";
      accent = "text-orange-200";
      message = "This result suggests a higher-than-recommended weight range.";
    } else {
      status = "Obesity range";
      accent = "text-rose-200";
      message =
        "This result may indicate elevated health risk and should be reviewed.";
    }

    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(0);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(0);
    const percent = Math.min(Math.max(((bmi - 15) / 20) * 100, 0), 100);

    setResult({
      bmi: bmi.toFixed(1),
      status,
      accent,
      message,
      idealRange: `${minIdeal} - ${maxIdeal} kg`,
      percent,
      age: ageValue,
      weight: weightValue,
      height: heightValue,
    });

    setView("result");
  };

  const resetCalculator = () => {
    setView("input");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111a] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Body Metrics
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-200">
                <Calculator className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  BMI Calculator
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                  Check your body mass index
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Enter your age, weight, and height to estimate BMI, review
                  your health range, and understand where your current body
                  metrics stand.
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-200" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">
                    Important note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-amber-50/85">
                    BMI is a screening metric, not a diagnosis. It does not
                    account for muscle mass, body composition, or individual
                    medical conditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex rounded-[1.5rem] border border-white/10 bg-[#0b1824] p-1.5">
              {["input", "result"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => (tab === "input" || result) && setView(tab)}
                  disabled={tab === "result" && !result}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[1.2rem] py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                    view === tab
                      ? "bg-cyan-300 text-slate-950"
                      : "text-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  }`}
                >
                  {tab === "input" ? (
                    <Calculator className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {view === "input" ? (
                <motion.div
                  key="input-view"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="space-y-6"
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <InputField
                      label="Age"
                      value={age}
                      onChange={setAge}
                      placeholder="25"
                      unit="yrs"
                      icon={User}
                    />
                    <InputField
                      label="Weight"
                      value={weight}
                      onChange={setWeight}
                      placeholder="72"
                      unit="kg"
                      icon={Weight}
                    />
                    <InputField
                      label="Height"
                      value={height}
                      onChange={setHeight}
                      placeholder="180"
                      unit="cm"
                      icon={Ruler}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Input quality
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Use weight in kilograms and height in centimeters.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Best use
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Helpful for quick body weight screening and trend
                        checks.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Follow-up
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        Pair BMI with diet and calorie planning for better
                        context.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={calculateBMI}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-200"
                  >
                    Start analysis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                        BMI Score
                      </p>

                      <div className="relative mx-auto mt-6 flex aspect-square max-w-[240px] items-center justify-center">
                        <svg className="h-full w-full -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-white/10"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{
                              strokeDashoffset:
                                283 - (283 * result.percent) / 100,
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="text-cyan-300"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black tracking-[-0.05em] text-white">
                            {result.bmi}
                          </span>
                          <span
                            className={`mt-2 text-xs font-bold uppercase tracking-[0.22em] ${result.accent}`}
                          >
                            {result.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-6">
                        <div className="flex items-start gap-3">
                          <Activity className="mt-0.5 h-5 w-5 text-cyan-200" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                              Result summary
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                              {result.status}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-400">
                              {result.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1824] p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Ideal weight range
                          </p>
                          <p className="mt-3 text-2xl font-black text-white">
                            {result.idealRange}
                          </p>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1824] p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                            Based on input
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            Age {result.age} • Weight {result.weight} kg •
                            Height {result.height} cm
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-200" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
                          Clinical context
                        </p>
                        <p className="mt-2 text-sm leading-7 text-amber-50/85">
                          A healthy assessment should also consider waist
                          circumference, lifestyle, blood markers, medical
                          history, and professional guidance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={resetCalculator}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Recalculate
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                BMI Categories
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  Underweight: below 18.5
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  Healthy range: 18.5 to 24.9
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  Overweight: 25.0 to 29.9
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  Obesity range: 30.0 and above
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Why this matters
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white">
                A quick health screening tool
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                BMI is useful for broad population-level screening and simple
                personal tracking, especially when combined with exercise,
                nutrition, and medical guidance.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
