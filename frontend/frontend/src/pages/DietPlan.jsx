import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple,
  Coffee,
  Utensils,
  Moon,
  Droplets,
  Lightbulb,
  ChevronLeft,
  Target,
  Scale,
  Sparkles,
  ShieldAlert,
  User,
  Weight,
  Ruler,
  Activity,
  Flame,
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

export default function DietPlan() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState(null);

  const calculateDiet = () => {
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

    let targetCalories = tdee;
    if (goal === "loss") targetCalories -= 400;
    if (goal === "gain") targetCalories += 400;

    const plan = generateDietPlan(goal);

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      plan,
    });
  };

  const generateDietPlan = (goalType) => {
    const plans = {
      loss: [
        {
          time: "Breakfast",
          meal: "Oats with berries and 2 egg whites",
          note: "High fiber start with lighter calories",
          icon: <Coffee className="h-5 w-5" />,
          color: "text-sky-200",
          accent: "border-sky-300/20 bg-sky-400/10",
        },
        {
          time: "Lunch",
          meal: "Grilled chicken or paneer salad",
          note: "Lean protein with volume-rich vegetables",
          icon: <Utensils className="h-5 w-5" />,
          color: "text-emerald-200",
          accent: "border-emerald-300/20 bg-emerald-400/10",
        },
        {
          time: "Snack",
          meal: "Greek yogurt or a handful of almonds",
          note: "Satiety support between meals",
          icon: <Apple className="h-5 w-5" />,
          color: "text-rose-200",
          accent: "border-rose-300/20 bg-rose-400/10",
        },
        {
          time: "Dinner",
          meal: "Baked tofu with steamed broccoli",
          note: "Lower calorie evening meal",
          icon: <Moon className="h-5 w-5" />,
          color: "text-indigo-200",
          accent: "border-indigo-300/20 bg-indigo-400/10",
        },
      ],
      gain: [
        {
          time: "Breakfast",
          meal: "Banana peanut butter toast and milk",
          note: "Energy-dense start to support surplus",
          icon: <Coffee className="h-5 w-5" />,
          color: "text-orange-200",
          accent: "border-orange-300/20 bg-orange-400/10",
        },
        {
          time: "Lunch",
          meal: "Brown rice, dal, and mixed vegetables",
          note: "Balanced carb and protein base",
          icon: <Utensils className="h-5 w-5" />,
          color: "text-emerald-200",
          accent: "border-emerald-300/20 bg-emerald-400/10",
        },
        {
          time: "Snack",
          meal: "Protein shake and dried fruits",
          note: "Convenient surplus support",
          icon: <Apple className="h-5 w-5" />,
          color: "text-rose-200",
          accent: "border-rose-300/20 bg-rose-400/10",
        },
        {
          time: "Dinner",
          meal: "Sweet potato and lean protein",
          note: "Recovery-friendly evening meal",
          icon: <Moon className="h-5 w-5" />,
          color: "text-indigo-200",
          accent: "border-indigo-300/20 bg-indigo-400/10",
        },
      ],
      maintain: [
        {
          time: "Breakfast",
          meal: "Scrambled eggs on whole wheat toast",
          note: "Simple protein-forward breakfast",
          icon: <Coffee className="h-5 w-5" />,
          color: "text-sky-200",
          accent: "border-sky-300/20 bg-sky-400/10",
        },
        {
          time: "Lunch",
          meal: "Lentil soup with rice and salad",
          note: "Balanced midday meal",
          icon: <Utensils className="h-5 w-5" />,
          color: "text-emerald-200",
          accent: "border-emerald-300/20 bg-emerald-400/10",
        },
        {
          time: "Snack",
          meal: "Apple with peanut butter",
          note: "Steady energy with healthy fats",
          icon: <Apple className="h-5 w-5" />,
          color: "text-rose-200",
          accent: "border-rose-300/20 bg-rose-400/10",
        },
        {
          time: "Dinner",
          meal: "Grilled protein with vegetables",
          note: "Simple evening maintenance meal",
          icon: <Moon className="h-5 w-5" />,
          color: "text-indigo-200",
          accent: "border-indigo-300/20 bg-indigo-400/10",
        },
      ],
    };

    return plans[goalType];
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
            Nutrition Planner
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-rose-200">
                <Apple className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  Diet Planner
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                  Build a practical daily meal plan
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Estimate calorie targets from your body metrics and generate a
                  simple meal timeline aligned with fat loss, maintenance, or
                  muscle gain.
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
                    This is a general planning tool, not a clinical nutrition
                    prescription. Food preferences, allergies, diabetes,
                    digestive issues, and other medical needs should be handled
                    with professional guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Age"
                value={age}
                onChange={setAge}
                placeholder="24"
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
                placeholder="70"
                unit="kg"
                icon={Weight}
              />

              <InputField
                label="Height"
                value={height}
                onChange={setHeight}
                placeholder="175"
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
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly active</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="intense">Intense</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label className="ml-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Fitness goal
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Target className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#07111a] py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/40"
                >
                  <option value="maintain">Maintain</option>
                  <option value="loss">Weight loss</option>
                  <option value="gain">Muscle gain</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateDiet}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-200"
            >
              Generate plan
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
                        <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-400/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            Target intake
                          </p>
                          <p className="mt-3 text-3xl font-black text-rose-200">
                            {result.calories}
                          </p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                            kcal / day
                          </p>
                        </div>

                        <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            BMR value
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-emerald-200">
                            <Scale className="h-5 w-5" />
                            <span className="text-2xl font-black">
                              {result.bmr}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-sky-300/20 bg-sky-400/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            Protocol
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-sky-200">
                            <Target className="h-5 w-5" />
                            <span className="text-2xl font-black capitalize">
                              {goal}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
                        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                              Meal timeline
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                              Suggested daily structure
                            </h2>
                          </div>

                          <div className="rounded-full border border-white/10 bg-[#0b1824] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                            TDEE: {result.tdee} kcal
                          </div>
                        </div>

                        <div className="space-y-5">
                          {result.plan.map((item, index) => (
                            <motion.div
                              key={`${item.time}-${index}`}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.08 }}
                              className="flex gap-4 rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-5"
                            >
                              <div
                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${item.accent} ${item.color}`}
                              >
                                {item.icon}
                              </div>

                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                                  {item.time}
                                </p>
                                <h3 className="mt-2 text-lg font-bold text-white">
                                  {item.meal}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-slate-400">
                                  {item.note}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-sky-300/20 bg-sky-400/10 p-5">
                          <div className="flex items-start gap-3">
                            <Droplets className="mt-0.5 h-5 w-5 text-sky-200" />
                            <div>
                              <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-100">
                                Hydration reminder
                              </p>
                              <p className="mt-2 text-sm leading-7 text-sky-50/85">
                                Aim for steady water intake through the day.
                                Around 2.5L to 3.5L may be reasonable depending
                                on body size, climate, and training level.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="mt-0.5 h-5 w-5 text-amber-200" />
                            <div>
                              <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
                                Planning insight
                              </p>
                              <p className="mt-2 text-sm leading-7 text-amber-50/85">
                                Consistency matters more than perfection.
                                Keeping meal timing, protein intake, and total
                                calories reasonably stable usually works better
                                than frequent drastic changes.
                              </p>
                            </div>
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
                  className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center"
                >
                  <Apple className="mb-5 h-14 w-14 text-slate-500" />
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    Awaiting biometric data
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                    Enter your body metrics, activity level, and goal to
                    generate a practical day structure for your diet.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
