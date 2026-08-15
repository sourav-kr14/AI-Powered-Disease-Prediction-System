import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Flame, RotateCcw, AlertCircle, Beef, Wheat, Droplet } from "lucide-react";

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateCalories = (e) => {
    e?.preventDefault();
    setError("");

    const ageVal = Number(age);
    const weightVal = Number(weight);
    const heightVal = Number(height);

    if (!ageVal || !weightVal || !heightVal) {
      setError("Please fill out all fields.");
      return;
    }

    if (ageVal <= 0 || weightVal <= 0 || heightVal <= 0) {
      setError("Please enter valid positive numbers.");
      return;
    }

    const bmr =
      gender === "male"
        ? 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5
        : 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;

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
      weightLoss: Math.round(tdee - 450),
      weightGain: Math.round(tdee + 350),
      macros: {
        protein: Math.round(weightVal * 1.8),
        carbs: Math.round((tdee * 0.45) / 4),
        fats: Math.round((tdee * 0.25) / 9),
      },
    });
  };

  const handleReset = () => {
    setAge("");
    setWeight("");
    setHeight("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        badge="Nutrition Engine"
        title="Calorie Tracker & Daily Energy Needs"
        description="Estimate how many calories your body uses every day and set targets for weight loss, maintenance, or muscle gain."
      />

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Form */}
        <div className="md:col-span-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Flame className="h-4 w-4 text-[var(--primary)]" />
            <span>Your Information</span>
          </h2>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-xs text-[var(--danger)]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={calculateCalories} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-sub)]">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-sub)]">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-sub)]">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="350"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-sub)]">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-sub)]">
                Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
              >
                <option value="sedentary">Sedentary (Little to no workout)</option>
                <option value="light">Light (Exercise 1–3 days/week)</option>
                <option value="moderate">Moderate (Exercise 3–5 days/week)</option>
                <option value="active">Active (Hard exercise 6–7 days/week)</option>
                <option value="intense">Very Active (Heavy physical job / sports)</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm"
              >
                Calculate Calories
              </button>
              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-3 text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)]"
                  aria-label="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Daily Targets Cards */}
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Your Daily Calorie Needs
                </span>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-[var(--primary-light)] border border-[var(--primary)]/30 p-4">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--primary)] uppercase">
                        To Maintain Weight
                      </h4>
                      <p className="text-2xl font-extrabold text-[var(--text-main)]">
                        {result.tdee} <span className="text-xs font-normal text-[var(--text-sub)]">kcal/day</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] p-3.5">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-sub)] uppercase">
                        For Weight Loss (-450 kcal)
                      </h4>
                      <p className="text-xl font-bold text-[var(--text-main)]">
                        {result.weightLoss} <span className="text-xs font-normal text-[var(--text-sub)]">kcal/day</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] p-3.5">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-sub)] uppercase">
                        For Muscle Gain (+350 kcal)
                      </h4>
                      <p className="text-xl font-bold text-[var(--text-main)]">
                        {result.weightGain} <span className="text-xs font-normal text-[var(--text-sub)]">kcal/day</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Macros */}
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Suggested Daily Macronutrients
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-3">
                    <Beef className="h-4 w-4 text-rose-500 mx-auto mb-1" />
                    <p className="text-xs text-[var(--text-sub)]">Protein</p>
                    <p className="text-base font-bold text-[var(--text-main)]">{result.macros.protein}g</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-3">
                    <Wheat className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs text-[var(--text-sub)]">Carbs</p>
                    <p className="text-base font-bold text-[var(--text-main)]">{result.macros.carbs}g</p>
                  </div>
                  <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-3">
                    <Droplet className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-[var(--text-sub)]">Fats</p>
                    <p className="text-base font-bold text-[var(--text-main)]">{result.macros.fats}g</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-muted)] space-y-1">
              <p className="font-semibold text-[var(--text-main)]">
                Awaiting calculation
              </p>
              <p>Enter your information on the left to see your daily calorie goals.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
