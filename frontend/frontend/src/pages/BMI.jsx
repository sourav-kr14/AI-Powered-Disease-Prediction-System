import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Activity, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BMI() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateBMI = (e) => {
    e?.preventDefault();
    setError("");

    const ageVal = Number(age);
    const weightVal = Number(weight);
    const heightVal = Number(height);

    if (!ageVal || !weightVal || !heightVal) {
      setError("Please fill in your age, weight, and height.");
      return;
    }

    if (weightVal <= 0 || heightVal <= 0 || ageVal <= 0) {
      setError("Please enter valid positive numbers.");
      return;
    }

    const heightInMeters = heightVal / 100;
    const bmiVal = weightVal / (heightInMeters * heightInMeters);

    let status = "";
    let statusColor = "";
    let message = "";

    if (bmiVal < 18.5) {
      status = "Underweight";
      statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
      message = "Your BMI is lower than recommended. You might benefit from nutrient-dense nutrition to reach a healthy weight.";
    } else if (bmiVal < 25) {
      status = "Healthy weight";
      statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
      message = "Great! Your BMI is within the standard recommended healthy range for adults.";
    } else if (bmiVal < 30) {
      status = "Overweight";
      statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
      message = "Your BMI is slightly above the recommended range. Regular physical activity and balanced diet can help.";
    } else {
      status = "Obesity";
      statusColor = "text-rose-500 bg-rose-500/10 border-rose-500/30";
      message = "Your BMI is in the obesity category. Speaking with a doctor or dietitian can help create a healthy plan.";
    }

    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(0);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(0);

    setResult({
      bmi: bmiVal.toFixed(1),
      status,
      statusColor,
      message,
      idealRange: `${minIdeal} – ${maxIdeal} kg`,
      age: ageVal,
      weight: weightVal,
      height: heightVal,
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
        badge="Wellness Calculator"
        title="BMI Calculator"
        description="Calculate your Body Mass Index to find out if your current weight is in a healthy range for your height."
      />

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Input Form */}
        <div className="md:col-span-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--primary)]" />
            <span>Enter your details</span>
          </h2>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-xs text-[var(--danger)]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={calculateBMI} className="space-y-4">
            {/* Age */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-sub)]">
                Age (years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-sub)]">
                Weight (kg)
              </label>
              <input
                type="number"
                min="1"
                max="350"
                step="0.1"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>

            {/* Height */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-sub)]">
                Height (cm)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm"
              >
                Calculate BMI
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

        {/* Results Container */}
        <div className="md:col-span-6 space-y-4">
          {result ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Your BMI Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-[var(--text-main)]">
                      {result.bmi}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">kg/m²</span>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${result.statusColor}`}
                >
                  {result.status}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[var(--text-sub)]">
                  Healthy weight for your height:
                </span>
                <p className="text-lg font-extrabold text-[var(--primary)]">
                  {result.idealRange}
                </p>
              </div>

              <p className="text-sm text-[var(--text-sub)] leading-relaxed">
                {result.message}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-muted)] space-y-1">
              <p className="font-semibold text-[var(--text-main)]">
                Awaiting calculation
              </p>
              <p>Fill out the form on the left and click calculate.</p>
            </div>
          )}

          {/* BMI Table */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-sub)]">
              Standard BMI Categories
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)] text-[var(--text-sub)]">
                <span>Underweight</span>
                <span className="font-semibold">&lt; 18.5</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)] text-[var(--success)] font-medium">
                <span>Normal / Healthy weight</span>
                <span className="font-semibold">18.5 – 24.9</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)] text-amber-500 font-medium">
                <span>Overweight</span>
                <span className="font-semibold">25.0 – 29.9</span>
              </div>
              <div className="flex justify-between py-1 text-rose-500 font-medium">
                <span>Obesity</span>
                <span className="font-semibold">&ge; 30.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
