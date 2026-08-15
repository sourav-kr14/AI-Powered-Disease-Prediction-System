import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Info,
  ChevronLeft,
  Target,
  Beef,
  Croissant,
  Droplet,
  Zap,
  Sparkles,
  ShieldAlert,
  User,
  Weight,
  Ruler,
  Activity,
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
      {Icon ? (
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Icon className="h-4 w-4 text-slate-500 transition-colors group-focus-within:text-cyan-200" />
        </div>
      ) : null}

      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border border-white/10 bg-[#07111a] py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 ${
          Icon ? "pl-11 pr-14" : "px-4 pr-14"
        }`}
      />

      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200/80">
        {unit}
      </span>
    </div>
  </div>
);

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);

  const calculateCalories = () => {
    const ageValue = Number(age);
    const weightValue = Number(weight);
    const heightValue = Number(height);

    if (!ageValue || !weightValue || !heightValue) {
      setResult({ error: "Please complete all biometric inputs." });
      return;
    }

    if (ageValue <= 0 || weightValue <= 0 || heightValue <= 0) {
      setResult({ error: "Please enter valid positive values." });
      return;
    }

    const bmr =
      gender === "male"
        ? 10 * weightValue + 6.25 * heightValue - 5 * ageValue + 5
        : 10 * weightValue + 6.25 * heightValue - 5 * ageValue - 161;

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      intense: 1.9,
    };

    const tdee = bmr * multipliers[activity];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goals: [
        {
          label: "Weight loss",
          value: Math.round(tdee - 450),
          desc: "Moderate calorie deficit",
          color: "text-sky-200",
          bg: "bg-sky-400/10 border-sky-300/20",
        },
        {
          label: "Maintain",
          value: Math.round(tdee),
          desc: "Weight stability target",
          color: "text-orange-200",
          bg: "bg-orange-400/10 border-orange-300/20",
        },
        {
          label: "Lean gain",
          value: Math.round(tdee + 350),
          desc: "Controlled calorie surplus",
          color: "text-emerald-200",
          bg: "bg-emerald-400/10 border-emerald-300/20",
        },
      ],
      macros: [
        {
          label: "Protein",
          value: Math.round(weightValue * 1.8),
          unit: "g",
          icon: <Beef className="h-4 w-4" />,
          color: "bg-rose-400",
        },
        {
          label: "Carbs",
          value: Math.round((tdee * 0.45) / 4),
          unit: "g",
          icon: <Croissant className="h-4 w-4" />,
          color: "bg-amber-300",
        },
        {
          label: "Fats",
          value: Math.round((tdee * 0.25) / 9),
          unit: "g",
          icon: <Droplet className="h-4 w-4" />,
          color: "bg-cyan-300",
        },
      ],
    });
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
            Nutrition Engine
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-3xl border border-orange-300/20 bg-orange-400/10 p-4 text-orange-200">
                <Flame className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  Calorie Calculator
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                  Estimate your daily energy needs
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Calculate BMR, TDEE, and a simple macro breakdown for weight
                  loss, maintenance, or lean muscle gain.
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
                    These estimates are useful for planning, but they are not a
                    substitute for medical or dietitian guidance. Actual calorie
                    needs vary by body composition, health conditions, and
                    goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Age"
                value={age}
                onChange={setAge}
                placeholder="25"
                unit="yrs"
                icon={User}
              />

              <div className="flex flex-col gap-2">
                <label className="ml-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07111a] px-4 py-4 text-sm text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <InputField
                label="Weight"
                value={weight}
                onChange={setWeight}
                placeholder="75"
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

            <div className="mt-5 flex flex-col gap-2">
              <label className="ml-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Activity level
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Activity className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07111a] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="sedentary">
                    Sedentary - little to no exercise
                  </option>
                  <option value="light">Light - 1 to 2 days per week</option>
                  <option value="moderate">
                    Moderate - 3 to 5 days per week
                  </option>
                  <option value="active">Active - 6 to 7 days per week</option>
                  <option value="intense">Intense - athlete level</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateCalories}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-200"
            >
              Generate nutrition targets
              <Flame className="h-4 w-4" />
            </button>
          </motion.div>

          <div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {result.error ? (
                    <div className="rounded-[2rem] border border-rose-300/20 bg-rose-400/10 p-6">
                      <p className="text-sm font-medium text-rose-100">
                        {result.error}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 md:grid-cols-3">
                        {result.goals.map((goal, index) => (
                          <div
                            key={index}
                            className={`rounded-[1.75rem] border p-5 ${goal.bg}`}
                          >
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                              {goal.label}
                            </p>
                            <p
                              className={`mt-3 text-3xl font-black ${goal.color}`}
                            >
                              {goal.value}
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                              kcal / day
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-400">
                              {goal.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
                        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                              Macro targets
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                              Daily nutrition breakdown
                            </h2>
                          </div>

                          <div className="rounded-full border border-white/10 bg-[#0b1824] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            TDEE: {result.tdee} kcal
                          </div>
                        </div>

                        <div className="space-y-5">
                          {result.macros.map((macro, index) => (
                            <div
                              key={index}
                              className="rounded-[1.5rem] border border-white/10 bg-[#0b1824] p-5"
                            >
                              <div className="mb-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-white">
                                  <span className="text-cyan-200">
                                    {macro.icon}
                                  </span>
                                  {macro.label}
                                </div>
                                <span className="text-sm font-black text-slate-200">
                                  {macro.value}
                                  {macro.unit}
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{
                                    duration: 0.9,
                                    delay: index * 0.08,
                                  }}
                                  className={`h-full rounded-full ${macro.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] border border-sky-300/20 bg-sky-400/10 p-5">
                        <div className="flex items-start gap-3">
                          <Zap className="mt-0.5 h-5 w-5 text-sky-200" />
                          <div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-100">
                              Metabolic insight
                            </p>
                            <p className="mt-2 text-sm leading-7 text-sky-50/85">
                              Your BMR is <strong>{result.bmr} kcal</strong>,
                              which reflects the energy your body uses at rest.
                              TDEE builds on that number using your reported
                              activity level.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center"
                >
                  <Info className="mb-4 h-12 w-12 text-slate-500" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    Awaiting biometric data
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                    Enter your body metrics and activity level to generate
                    calorie and macro recommendations.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              BMR
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Basal metabolic rate is the energy needed for essential body
              functions at complete rest.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              TDEE
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Total daily energy expenditure estimates your full daily calorie
              usage after including activity.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Macros
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Protein, carbohydrate, and fat targets help turn calorie goals
              into a more practical daily eating plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
