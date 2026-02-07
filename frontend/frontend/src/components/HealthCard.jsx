import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ArrowRight,
  Activity,
  TrendingUp,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const InputField = ({ label, value, onChange, placeholder, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-3 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-zinc-600 shadow-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500 uppercase">
        {unit}
      </span>
    </div>
  </div>
);

export default function HealthCard() {
  const [view, setView] = useState("input");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!age || !weight || !height) return;
    const h = height / 100;
    const bmi = weight / (h * h);
    let status = "";
    let advice = "";

    if (bmi < 18.5) {
      status = "Underweight";
      advice = "Consider a calorie-dense diet.";
    } else if (bmi < 24.9) {
      status = "Healthy";
      advice = "Maintain your current lifestyle.";
    } else if (bmi < 29.9) {
      status = "Overweight";
      advice = "Focus on cardio and portion control.";
    } else {
      status = "Obese";
      advice = "Consult a professional for a plan.";
    }

    setResult({
      bmi: bmi.toFixed(1),
      status,
      advice,
      idealRange: `${(18.5 * h * h).toFixed(1)}kg – ${(24.9 * h * h).toFixed(1)}kg`,
      percent: Math.min(Math.max((bmi / 40) * 100, 5), 100),
    });
    setView("dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-6 px-4 transition-colors duration-500">
      
      {/* HEADER NAVIGATION */}
      <div className="max-w-md w-full flex justify-between items-center mb-8 px-1">
        <Link
          to="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-all font-bold text-xs group"
        >
          <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-indigo-500/50">
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </div>
          Dashboard
        </Link>

        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
            Health Suite
          </span>
        </div>
      </div>

      {/* GLASSMORPHISM CARD */}
      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] p-2 shadow-2xl shadow-indigo-500/5 border border-zinc-800/50 overflow-hidden">
        
        {/* VIEW TOGGLE */}
        <div className="flex p-1.5 bg-black/40 backdrop-blur-md rounded-[2rem] mb-4">
          <button
            onClick={() => setView("input")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-extrabold transition-all ${view === "input" ? "bg-indigo-600 shadow-md text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Assessment
          </button>
          <button
            onClick={() => result && setView("dashboard")}
            disabled={!result}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-extrabold transition-all ${view === "dashboard" ? "bg-indigo-600 shadow-md text-white" : "text-zinc-500 hover:text-zinc-300 disabled:opacity-20"}`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Results
          </button>
        </div>

        <div className="px-4 pb-6">
          <AnimatePresence mode="wait">
            {view === "input" ? (
              <motion.div
                key="input-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 ml-1">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-black text-white tracking-tight">
                    Biometric Scan
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Age" value={age} onChange={setAge} placeholder="24" unit="yrs" />
                    <InputField label="Weight" value={weight} onChange={setWeight} placeholder="70" unit="kg" />
                  </div>
                  <InputField label="Height" value={height} onChange={setHeight} placeholder="175" unit="cm" />
                </div>

                <button
                  onClick={calculateBMI}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Analyze Metrics <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5"
              >
                {/* COMPACT RESULT CARD */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                      BMI Score
                    </p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <h3 className="text-5xl font-black">{result.bmi}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded-lg">
                        {result.status}
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-black/40 rounded-full relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ left: `${result.percent}%` }}
                        className="absolute -top-1 w-3.5 h-3.5 bg-white rounded-full border-2 border-indigo-600 shadow-md"
                      />
                    </div>
                  </div>
                </div>

                {/* INSIGHTS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1 tracking-wider">
                      Ideal Range
                    </p>
                    <p className="text-sm font-bold text-white leading-none">
                      {result.idealRange}
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1 tracking-wider">
                      AI Suggestion
                    </p>
                    <p className="text-[11px] font-medium text-zinc-400 leading-tight">
                      {result.advice}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setView("input")}
                  className="w-full py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-[0.98]"
                >
                  New Assessment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}