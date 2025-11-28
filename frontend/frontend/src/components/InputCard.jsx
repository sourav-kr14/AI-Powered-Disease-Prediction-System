import React, { useState, useMemo } from "react";

const ALL_SYMPTOMS = [
  "fever",
  "headache",
  "nausea",
  "vomiting",
  "fatigue",
  "joint_pain",
  "skin_rash",
  "cough",
  "weight_loss",
  "yellow_eyes",
];

export default function InputCard({ onPredict }) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSymptoms = useMemo(
    () =>
      input
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    [input]
  );

  const currentToken = useMemo(() => {
    const parts = input.split(",");
    return parts[parts.length - 1].trim().toLowerCase();
  }, [input]);

  const suggestions = useMemo(() => {
    if (!currentToken) return [];
    return ALL_SYMPTOMS.filter(
      (sym) =>
        sym.includes(currentToken) && !currentSymptoms.includes(sym)
    ).slice(0, 5);
  }, [currentToken, currentSymptoms]);

  const handleAddSuggestion = (symptom) => {
    const parts = input.split(",");
    parts[parts.length - 1] = " " + symptom;
    setInput(parts.join(","));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    await onPredict(input);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-blue-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Enter Symptoms</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. fever, cough, headache"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            {suggestions.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => handleAddSuggestion(sym)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-blue-600 text-white p-3 rounded-xl text-sm hover:bg-blue-700"
        >
          {isSubmitting ? "Predicting..." : "Predict Disease"}
        </button>
      </form>
    </div>
  );
}
