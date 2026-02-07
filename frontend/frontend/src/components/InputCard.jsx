import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Activity, Sparkles, Loader2, Command } from "lucide-react";

const ALL_SYMPTOMS = [
  "fever", "headache", "nausea", "vomiting", "fatigue",
  "joint_pain", "skin_rash", "cough", "weight_loss", "yellow_eyes",
];

export default function InputCard({ onPredict }) {
  const [query, setQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

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
    await onPredict(selectedSymptoms.join(", "));
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 border border-slate-200/60 dark:border-slate-800 transition-all">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analysis Engine</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add symptoms for real-time diagnosis</p>
          </div>
        </div>
        <div className="self-start px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> AI v2.4 Active
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SELECTED SYMPTOMS AREA */}
        <div className="min-h-[50px]">
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedSymptoms.map((sym) => (
                <motion.span
                  key={sym}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="group flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-2xl border border-transparent hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-default"
                >
                  <span className="capitalize">{sym.replace("_", " ")}</span>
                  <button
                    type="button"
                    onClick={() => removeSymptom(sym)}
                    className="p-0.5 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* PREMIUM SEARCH INPUT */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500/50 dark:focus:border-indigo-400/50 rounded-2xl py-4 pl-14 pr-5 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all shadow-sm focus:shadow-indigo-500/10 dark:focus:shadow-none"
            placeholder="Search symptoms (e.g., headache, fever)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
             <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                <Command className="w-2.5 h-2.5" /> K
             </kbd>
          </div>

          {/* FLOATING SUGGESTIONS */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl mt-3 overflow-hidden"
              >
                <div className="p-2">
                  {suggestions.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => addSymptom(sym)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-left rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-500 transition-colors" />
                        <span className="capitalize font-medium">{sym.replace("_", " ")}</span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PREDICT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting || selectedSymptoms.length === 0}
          className="w-full relative overflow-hidden group bg-slate-900 dark:bg-indigo-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.99] shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="tracking-wide">Synthesizing Data...</span>
            </>
          ) : (
            <>
              <span className="tracking-wide">Analyze Symptoms</span>
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Activity className="w-3 h-3 text-white" />
              </div>
            </>
          )}
        </button>
      </form>
    </div>
  );
}