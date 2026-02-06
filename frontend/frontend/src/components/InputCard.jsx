import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Activity, Sparkles, Loader2 } from "lucide-react";

const ALL_SYMPTOMS = [
  "fever", "headache", "nausea", "vomiting", "fatigue",
  "joint_pain", "skin_rash", "cough", "weight_loss", "yellow_eyes",
];

export default function InputCard({ onPredict }) {
  const [query, setQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  // Filter suggestions based on what's typed and NOT already selected
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return ALL_SYMPTOMS.filter(
      (sym) =>
        sym.toLowerCase().includes(query.toLowerCase()) && 
        !selectedSymptoms.includes(sym)
    ).slice(0, 5);
  }, [query, selectedSymptoms]);

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setQuery("");
    inputRef.current?.focus();
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    setIsSubmitting(true);
    // Send comma-separated string to backend to maintain compatibility
    await onPredict(selectedSymptoms.join(", "));
    setIsSubmitting(false);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold dark:text-white">Diagnostic Input</h2>
        </div>
        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-bold uppercase rounded-full tracking-widest flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> AI Analysis Ready
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tag Container */}
        <div className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl transition-all focus-within:border-indigo-400">
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {selectedSymptoms.map((sym) => (
                <motion.span
                  key={sym}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 group"
                >
                  {sym.replace("_", " ")}
                  <button
                    type="button"
                    onClick={() => removeSymptom(sym)}
                    className="p-0.5 hover:bg-rose-50 hover:text-rose-500 rounded-md transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            
            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 p-1.5 text-sm dark:text-white"
              placeholder={selectedSymptoms.length === 0 ? "Type symptoms (e.g. fever)..." : "Add more..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          {selectedSymptoms.length === 0 && !query && (
            <div className="flex flex-col items-center justify-center h-16 text-slate-400">
              <Search className="w-5 h-5 mb-1 opacity-20" />
              <p className="text-[10px] font-medium uppercase tracking-tighter">Enter at least one symptom</p>
            </div>
          )}
        </div>

        {/* Suggestion Dropdown */}
        <div className="relative">
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl mt-2 overflow-hidden"
              >
                {suggestions.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => addSymptom(sym)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 group"
                  >
                    <span className="capitalize">{sym.replace("_", " ")}</span>
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || selectedSymptoms.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Logic...
            </>
          ) : (
            "Run Predictive Analysis"
          )}
        </button>
      </form>
    </div>
  );
}