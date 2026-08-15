import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  X,
  ArrowRight,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const suggestedSymptoms = [
  "fever",
  "cough",
  "headache",
  "fatigue",
  "sore throat",
  "vomiting",
  "chest pain",
  "shortness of breath",
];

export default function InputCard({ onPredict, loading }) {
  const [input, setInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  const normalizedSymptoms = useMemo(() => {
    return symptoms.filter(Boolean);
  }, [symptoms]);

  const addSymptom = (value) => {
    const cleaned = value.trim().toLowerCase();

    if (!cleaned) return;
    if (symptoms.includes(cleaned)) return;

    setSymptoms((prev) => [...prev, cleaned]);
  };

  const removeSymptom = (value) => {
    setSymptoms((prev) => prev.filter((item) => item !== value));
  };

  const handleAddFromInput = () => {
    const entries = input
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (!entries.length) return;

    const nextSymptoms = [...symptoms];

    entries.forEach((entry) => {
      if (!nextSymptoms.includes(entry)) {
        nextSymptoms.push(entry);
      }
    });

    setSymptoms(nextSymptoms);
    setInput("");
  };

  const handlePredict = () => {
    const typedEntries = input
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    const merged = [...normalizedSymptoms];

    typedEntries.forEach((entry) => {
      if (!merged.includes(entry)) {
        merged.push(entry);
      }
    });

    if (!merged.length) return;

    setSymptoms(merged);
    setInput("");
    onPredict(merged);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddFromInput();
    }
  };

  const helperText =
    normalizedSymptoms.length === 0
      ? "Add at least one symptom to begin analysis."
      : normalizedSymptoms.length === 1
        ? "Add one or two more symptoms for better matching."
        : "Your symptom set is ready for analysis.";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0b1824] p-6 md:p-7">
      <div className="mb-5 flex items-start gap-4">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
          <Stethoscope className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            Symptom Input
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
            Tell us what you’re feeling
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Add symptoms one by one or separate multiple symptoms with commas.
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
        <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Symptoms
        </label>

        <div className="flex flex-wrap gap-2">
          {normalizedSymptoms.map((symptom) => (
            <motion.div
              key={symptom}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100"
            >
              <span>{symptom}</span>
              <button
                type="button"
                onClick={() => removeSymptom(symptom)}
                className="rounded-full p-0.5 text-cyan-200 transition hover:bg-white/10 hover:text-white"
                aria-label={`Remove ${symptom}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}

          {normalizedSymptoms.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">
              No symptoms added yet
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Example: fever, cough, sore throat"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full rounded-2xl border border-white/10 bg-[#07111a] px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
          />

          <button
            type="button"
            onClick={handleAddFromInput}
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-300/15 bg-amber-300/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 text-amber-200" />
          <p className="text-sm leading-6 text-amber-50/85">{helperText}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <Sparkles className="h-4 w-4 text-cyan-200" />
          Suggested symptoms
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedSymptoms.map((symptom) => (
            <button
              key={symptom}
              type="button"
              onClick={() => addSymptom(symptom)}
              disabled={loading}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          {normalizedSymptoms.length} symptom
          {normalizedSymptoms.length === 1 ? "" : "s"} selected
        </div>

        <button
          type="button"
          onClick={handlePredict}
          disabled={loading || (!normalizedSymptoms.length && !input.trim())}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Predict now"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
