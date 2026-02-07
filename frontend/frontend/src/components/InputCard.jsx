import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Sparkles, 
  Loader2, 
  Check, 
  Stethoscope, 
  Thermometer, 
  Brain, 
  AlertCircle 
} from "lucide-react";

// Categorized symptoms for better UX
const SYMPTOM_CATEGORIES = [
  {
    name: "General",
    icon: <Thermometer className="w-4 h-4" />,
    symptoms: ["fever", "fatigue", "weight_loss"],
  },
  {
    name: "Pain & Neurological",
    icon: <Brain className="w-4 h-4" />,
    symptoms: ["headache", "joint_pain"],
  },
  {
    name: "Digestive & Skin",
    icon: <Stethoscope className="w-4 h-4" />,
    symptoms: ["nausea", "vomiting", "yellow_eyes", "skin_rash", "cough"],
  },
];

const InputCard = ({ onPredict }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    await onPredict(selectedSymptoms);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-slate-200/60 dark:border-slate-800 transition-all">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Symptom Selector</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tap to select your current symptoms</p>
          </div>
        </div>
        <div className="self-start px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* CATEGORIZED GRID */}
        <div className="space-y-8">
          {SYMPTOM_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 px-1">
                {category.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{category.name}</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.symptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <motion.button
                      key={sym}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSymptom(sym)}
                      className={`relative flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all duration-200 text-sm font-semibold capitalize ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                      }`}
                    >
                      <span className="truncate mr-2">{sym.replace("_", " ")}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"
                      }`}>
                        {isSelected ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* INFO BOX */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
            Please select all symptoms you are currently experiencing. Our AI will analyze patterns to suggest potential causes. This is not a medical diagnosis.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting || selectedSymptoms.length === 0}
          className="w-full relative overflow-hidden group bg-slate-900 dark:bg-indigo-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.99] shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="tracking-wide text-lg">Analyzing Patterns...</span>
            </>
          ) : (
            <>
              <span className="tracking-wide text-lg">
                Run Diagnostic {selectedSymptoms.length > 0 && `(${selectedSymptoms.length})`}
              </span>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Activity className="w-4 h-4 text-white" />
              </div>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputCard;