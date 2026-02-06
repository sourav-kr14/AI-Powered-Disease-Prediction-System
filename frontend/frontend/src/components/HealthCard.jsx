import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, AlertCircle, CheckCircle2, Info } from "lucide-react";

const InputField = ({ label, value, onChange, placeholder, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
        {unit}
      </span>
    </div>
  </div>
);

export default function HealthCard() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!age || !weight || !height) {
      setResult({ error: "Please enter all details to proceed." });
      return;
    }

    const h = height / 100;
    const bmi = weight / (h * h);
    let status = "";
    let color = "";

    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-amber-500";
    } else if (bmi < 24.9) {
      status = "Normal";
      color = "text-emerald-500";
    } else if (bmi < 29.9) {
      status = "Overweight";
      color = "text-orange-500";
    } else {
      status = "Obese";
      color = "text-rose-500";
    }

    const idealMin = (18.5 * h * h).toFixed(1);
    const idealMax = (24.9 * h * h).toFixed(1);

    setResult({
      bmi: bmi.toFixed(1),
      status,
      color,
      idealRange: `${idealMin}kg – ${idealMax}kg`,
      percent: Math.min(Math.max((bmi / 40) * 100, 10), 100), // For the visual bar
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold dark:text-white">Biometric Inputs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InputField label="Age" value={age} onChange={setAge} placeholder="24" unit="yrs" />
        <InputField label="Weight" value={weight} onChange={setWeight} placeholder="70" unit="kg" />
        <InputField label="Height" value={height} onChange={setHeight} placeholder="175" unit="cm" />
      </div>

      <button
        onClick={calculateBMI}
        className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
      >
        Calculate Assessment
      </button>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {result.error ? (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                <AlertCircle className="w-5 h-5" /> {result.error}
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Results</span>
                    <div className={`text-4xl font-black ${result.color}`}>{result.bmi}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {result.status}
                    </span>
                  </div>
                </div>

                {/* Visual Gauge */}
                <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.percent}%` }}
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ideal Weight</p>
                    <p className="text-sm font-bold dark:text-white">{result.idealRange}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Body Status</p>
                    <p className={`text-sm font-bold ${result.color}`}>{result.status}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}