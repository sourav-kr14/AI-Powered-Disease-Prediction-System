import { useState } from "react";
import { Plus, X, Search, Sparkles } from "lucide-react";

const commonSymptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Fatigue",
  "Sore Throat",
  "Nausea",
  "Vomiting",
  "Shortness of Breath",
  "Chest Pain",
  "Joint Pain",
  "Dizziness",
  "Skin Rash",
];

export default function InputCard({ onPredict, loading }) {
  const [input, setInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  const addSymptom = (name) => {
    const clean = name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!clean || symptoms.includes(clean)) return;
    setSymptoms([...symptoms, clean]);
  };

  const removeSymptom = (name) => {
    setSymptoms(symptoms.filter((s) => s !== name));
  };

  const handleAddInput = () => {
    if (!input.trim()) return;
    const items = input
      .split(",")
      .map((i) => i.trim().toLowerCase().replace(/\s+/g, "_"))
      .filter(Boolean);

    const updated = [...symptoms];
    items.forEach((item) => {
      if (!updated.includes(item)) {
        updated.push(item);
      }
    });

    setSymptoms(updated);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInput();
    }
  };

  const handleCheck = () => {
    let finalSymptoms = [...symptoms];
    if (input.trim()) {
      const items = input
        .split(",")
        .map((i) => i.trim().toLowerCase().replace(/\s+/g, "_"))
        .filter(Boolean);

      items.forEach((item) => {
        if (!finalSymptoms.includes(item)) {
          finalSymptoms.push(item);
        }
      });
      setSymptoms(finalSymptoms);
      setInput("");
    }

    if (finalSymptoms.length > 0) {
      onPredict(finalSymptoms);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--text-main)]">
          What symptoms are you experiencing?
        </h2>
        <p className="text-sm text-[var(--text-sub)] mt-0.5">
          Select from popular symptoms below or type in your own.
        </p>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Type a symptom (e.g. headache, fever, back pain)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] py-3 pl-10 pr-4 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] transition-all outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleAddInput}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-40 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Selected Symptoms */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-sub)]">
          <span>Selected symptoms ({symptoms.length})</span>
          {symptoms.length > 0 && (
            <button
              onClick={() => setSymptoms([])}
              className="text-[var(--danger)] hover:underline font-normal"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="min-h-[48px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-3">
          {symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 text-xs font-medium text-[var(--text-main)] shadow-xs"
                >
                  <span className="capitalize">{symptom.replace(/_/g, " ")}</span>
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                    aria-label={`Remove ${symptom}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] py-1">
              No symptoms added yet. Click from the suggestions below to add them.
            </p>
          )}
        </div>
      </div>

      {/* Common Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[var(--text-sub)] flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
          Quick add common symptoms:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {commonSymptoms.map((name) => {
            const val = name.toLowerCase().replace(/\s+/g, "_");
            const isSelected = symptoms.includes(val);
            return (
              <button
                key={name}
                type="button"
                onClick={() => (isSelected ? removeSymptom(val) : addSymptom(name))}
                disabled={loading}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)] font-semibold"
                    : "bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-main)]"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={loading || (symptoms.length === 0 && !input.trim())}
          className="w-full rounded-xl bg-[var(--primary)] py-3.5 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all text-center"
        >
          {loading ? "Analyzing symptoms..." : "Analyze My Symptoms"}
        </button>
      </div>
    </div>
  );
}
