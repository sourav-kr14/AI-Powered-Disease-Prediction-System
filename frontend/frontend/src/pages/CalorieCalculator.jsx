import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Info, ChevronLeft, Target, Beef, Croissant, Droplet, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const InputField = ({ label, value, onChange, placeholder, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm dark:text-white"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  </div>
);

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      setResult({ error: "Please fill in all biometric data." });
      return;
    }

    const BMR = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, intense: 1.9 };
    const TDEE = BMR * multipliers[activity];

    setResult({
      bmr: Math.round(BMR),
      tdee: Math.round(TDEE),
      goals: [
        { label: "Weight Loss", value: Math.round(TDEE - 450), desc: "0.5kg/week reduction", color: "text-blue-500", bg: "bg-blue-50/50" },
        { label: "Maintain", value: Math.round(TDEE), desc: "Current weight stability", color: "text-orange-500", bg: "bg-orange-50/50" },
        { label: "Bulk Up", value: Math.round(TDEE + 350), desc: "Lean muscle growth", color: "text-emerald-500", bg: "bg-emerald-50/50" },
      ],
      macros: [
        { label: "Protein", value: Math.round(weight * 1.8), unit: "g", icon: <Beef className="w-4 h-4" />, color: "bg-rose-500" },
        { label: "Carbs", value: Math.round((TDEE * 0.45) / 4), unit: "g", icon: <Croissant className="w-4 h-4" />, color: "bg-amber-500" },
        { label: "Fats", value: Math.round((TDEE * 0.25) / 9), unit: "g", icon: <Droplet className="w-4 h-4" />, color: "bg-indigo-500" },
      ]
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 group text-sm font-medium">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600">
                <Flame className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black dark:text-white tracking-tight">Metabolic Analysis</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" value={age} onChange={setAge} placeholder="25" unit="yrs" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500 dark:text-white">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Weight" value={weight} onChange={setWeight} placeholder="75" unit="kg" />
              <InputField label="Height" value={height} onChange={setHeight} placeholder="180" unit="cm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Activity Intensity</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500 dark:text-white">
                <option value="sedentary">Sedentary (Office job)</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="intense">Intense (Athlete)</option>
              </select>
            </div>

            <button onClick={calculateCalories} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95">
              Generate Nutrition Plan
            </button>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Energy Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {result.goals.map((goal, i) => (
                      <div key={i} className={`${goal.bg} p-4 rounded-3xl border border-white dark:border-slate-800 text-center`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{goal.label}</p>
                        <p className={`text-xl font-black ${goal.color}`}>{goal.value}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">kcal/day</p>
                      </div>
                    ))}
                  </div>

                  {/* Macros Section */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-500" /> Target Macros
                      </h3>
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        TDEE: {result.tdee}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {result.macros.map((macro, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                              {macro.icon} {macro.label}
                            </div>
                            <span className="text-sm font-black dark:text-white">{macro.value}{macro.unit}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full ${macro.color} rounded-full`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-800 flex gap-4">
                    <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your <strong>BMR ({result.bmr} kcal)</strong> is the energy used at rest. To lose fat, stick to the Weight Loss goal while maintaining protein intake to preserve muscle.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12">
                  <Info className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium uppercase tracking-widest">Awaiting Biometric Data</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}