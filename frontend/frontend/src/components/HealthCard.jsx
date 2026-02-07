import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Weight,
  Ruler,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  unit,
  icon: Icon,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
      </div>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-2xl py-4 pl-11 pr-14 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500/60 uppercase">
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
    let color = "";

    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-amber-400";
    } else if (bmi < 24.9) {
      status = "Optimal";
      color = "text-emerald-400";
    } else if (bmi < 29.9) {
      status = "Overweight";
      color = "text-orange-400";
    } else {
      status = "Obese";
      color = "text-red-400";
    }

    setResult({
      bmi: bmi.toFixed(1),
      status,
      color,
      idealRange: `${(18.5 * h * h).toFixed(0)} - ${(24.9 * h * h).toFixed(0)}kg`,
      percent: Math.min(Math.max(((bmi - 15) / 20) * 100, 0), 100),
    });
    setView("result");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden relative">
      {/* PREMUM BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center py-12 px-6">
        {/* TOP NAV */}
        <div className="w-full flex justify-between items-center mb-12 px-2">
            <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors mb-8 group text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>

          <div className="px-4 py-1.5 bg-indigo-500/5 border border-indigo-500/20 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Live Core
            </span>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="w-full bg-zinc-900/20 backdrop-blur-3xl rounded-[3rem] p-3 shadow-2xl border border-white/10 relative">
          {/* INTERNAL GLOW */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* TAB SYSTEM */}
          <div className="flex p-1.5 bg-zinc-950/60 rounded-[2.2rem] mb-6 border border-white/5">
            {["input", "result"].map((t) => (
              <button
                key={t}
                onClick={() => (t === "input" || result) && setView(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] text-xs font-bold transition-all duration-500 ${
                  view === t
                    ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg"
                    : "text-zinc-500 hover:text-zinc-300 disabled:opacity-10"
                }`}
                disabled={t === "result" && !result}
              >
                {t === "input" ? (
                  <Calculator className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="px-5 pb-8">
            <AnimatePresence mode="wait">
              {view === "input" ? (
                <motion.div
                  key="input-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter italic">
                      VITAL SCAN
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                      Enter metrics for biometric analysis
                    </p>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      label="Age Group"
                      value={age}
                      onChange={setAge}
                      placeholder="25"
                      unit="yrs"
                      icon={User}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Weight"
                        value={weight}
                        onChange={setWeight}
                        placeholder="72"
                        unit="kg"
                        icon={Weight}
                      />
                      <InputField
                        label="Height"
                        value={height}
                        onChange={setHeight}
                        placeholder="180"
                        unit="cm"
                        icon={Ruler}
                      />
                    </div>
                  </div>

                  <button
                    onClick={calculateBMI}
                    className="group relative w-full bg-white text-black font-black py-5 rounded-[2rem] transition-all hover:bg-indigo-50 active:scale-95 overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3 tracking-tighter text-lg">
                      START ANALYSIS{" "}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-6"
                >
                  {/* SCORE DISPLAY */}
                  <div className="relative aspect-square max-w-[240px] mx-auto flex flex-col items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-zinc-800"
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * result.percent) / 100,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-indigo-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black text-white tracking-tighter">
                        {result.bmi}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-[0.3em] ${result.color}`}
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-zinc-950/50 border border-white/5 rounded-3xl group">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">
                        Ideal Weight
                      </p>
                      <p className="text-xl font-black text-white">
                        {result.idealRange}
                      </p>
                    </div>
                    <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                      <Sparkles className="w-4 h-4 text-indigo-400 mb-2" />
                      <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">
                        Status
                      </p>
                      <p className="text-[11px] font-semibold text-indigo-200/70 leading-tight">
                        Your BMI indicates a {result.status.toLowerCase()}{" "}
                        profile.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setView("input")}
                    className="w-full py-5 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                  >
                    Recalibrate Metrics
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-12 text-zinc-600 text-[10px] font-medium tracking-[0.2em] uppercase">
          Precision Health Engine • v2.0.4
        </p>
      </div>
    </div>
  );
}
