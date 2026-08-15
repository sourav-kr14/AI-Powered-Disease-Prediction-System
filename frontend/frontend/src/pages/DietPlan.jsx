import { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Apple,
  Coffee,
  Utensils,
  Moon,
  RotateCcw,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function DietPlan() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateDiet = (e) => {
    e?.preventDefault();
    setError("");

    const ageVal = Number(age);
    const weightVal = Number(weight);
    const heightVal = Number(height);

    if (!ageVal || !weightVal || !heightVal) {
      setError("Please fill in all your details.");
      return;
    }

    if (ageVal <= 0 || weightVal <= 0 || heightVal <= 0) {
      setError("Please enter valid positive values.");
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

    let targetCalories = tdee;
    if (goal === "loss") targetCalories -= 400;
    if (goal === "gain") targetCalories += 400;

    const plan = generateDietPlan(goal);

    setResult({
      calories: Math.round(targetCalories),
      plan,
      goal,
    });
  };

  const generateDietPlan = (goalType) => {
    const plans = {
      loss: [
        {
          time: "Breakfast",
          meal: "Oatmeal with fresh berries & boiled eggs",
          note: "High fiber and lean protein to keep you full and energized throughout the morning.",
          icon: Coffee,
        },
        {
          time: "Lunch",
          meal: "Grilled chicken or paneer bowl with mixed green salad",
          note: "Nutrient-dense with plenty of fresh vegetables and clean protein.",
          icon: Utensils,
        },
        {
          time: "Afternoon Snack",
          meal: "Greek yogurt or a small handful of raw almonds",
          note: "Helps prevent late-day cravings with healthy fats and protein.",
          icon: Apple,
        },
        {
          time: "Dinner",
          meal: "Steamed fish or baked tofu with roasted broccoli",
          note: "Light, easily digestible evening meal that supports overnight recovery.",
          icon: Moon,
        },
      ],
      gain: [
        {
          time: "Breakfast",
          meal: "Whole wheat toast with peanut butter & banana smoothie",
          note: "Rich in healthy complex carbs and natural fats for clean calorie surplus.",
          icon: Coffee,
        },
        {
          time: "Lunch",
          meal: "Brown rice, lentil dal, and grilled protein serving",
          note: "Solid energy-dense meal providing balanced carbs and sustained energy.",
          icon: Utensils,
        },
        {
          time: "Afternoon Snack",
          meal: "Protein shake with walnuts, dates, or oats",
          note: "Quick and convenient way to hit your daily calorie surplus target.",
          icon: Apple,
        },
        {
          time: "Dinner",
          meal: "Roasted sweet potatoes, quinoa, and lean chicken or paneer",
          note: "Nutrient-rich dinner promoting muscle recovery and glycogen replenishment.",
          icon: Moon,
        },
      ],
      maintain: [
        {
          time: "Breakfast",
          meal: "Scrambled eggs on whole grain sourdough with avocado",
          note: "Balanced start with quality fats, complex carbohydrates, and protein.",
          icon: Coffee,
        },
        {
          time: "Lunch",
          meal: "Mediterranean grain bowl with chickpeas, vegetables, and chicken",
          note: "Full of colorful micronutrients, clean carbs, and fiber.",
          icon: Utensils,
        },
        {
          time: "Afternoon Snack",
          meal: "Fresh apple slices with natural peanut or almond butter",
          note: "Satisfying snack for sustained midday focus and energy.",
          icon: Apple,
        },
        {
          time: "Dinner",
          meal: "Grilled salmon or paneer with grilled asparagus and brown rice",
          note: "Heart-healthy dinner rich in omega-3 fatty acids and essential minerals.",
          icon: Moon,
        },
      ],
    };

    return plans[goalType] || plans.maintain;
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
        badge="Meal Planning"
        title="Personalized Diet Planner"
        description="Get a balanced, structured daily meal schedule customized for your fitness and body weight goals."
      />

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Form */}
        <div className="md:col-span-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Apple className="h-4 w-4 text-[var(--primary)]" />
            <span>Your Profile</span>
          </h2>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-xs text-[var(--danger)]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={calculateDiet} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-sub)]">
                  Age
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
                Daily Activity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
              >
                <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                <option value="light">Lightly Active (1–3 days/week)</option>
                <option value="moderate">Moderately Active (3–5 days/week)</option>
                <option value="active">Very Active (6–7 days/week)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-sub)]">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:bg-[var(--bg-surface)]"
              >
                <option value="maintain">Maintain Weight</option>
                <option value="loss">Healthy Fat Loss</option>
                <option value="gain">Build Muscle / Gain Weight</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm"
              >
                Create Meal Plan
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

        {/* Meal Timeline */}
        <div className="md:col-span-7 space-y-4">
          {result ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Target Daily Energy
                  </span>
                  <p className="text-2xl font-extrabold text-[var(--primary)] mt-0.5">
                    {result.calories} <span className="text-xs font-normal text-[var(--text-sub)]">kcal/day</span>
                  </p>
                </div>
                <span className="rounded-full bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 text-xs font-bold capitalize">
                  {result.goal === "loss" ? "Fat Loss Plan" : result.goal === "gain" ? "Muscle Gain Plan" : "Maintenance Plan"}
                </span>
              </div>

              <div className="space-y-4">
                {result.plan.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--primary)] mt-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {item.time}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--text-main)]">
                          {item.meal}
                        </h4>
                        <p className="text-xs text-[var(--text-sub)] leading-relaxed">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-muted)] space-y-1">
              <p className="font-semibold text-[var(--text-main)]">
                Awaiting your profile
              </p>
              <p>Fill out the form on the left to see your personalized daily meal timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
