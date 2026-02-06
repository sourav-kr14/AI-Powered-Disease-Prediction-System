import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Coffee, Utensils, Moon, Droplets, Lightbulb, ChevronLeft, Target, Scale } from "lucide-react";
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
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm dark:text-white"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  </div>
);

export default function DietPlan() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState(null);

  const calculateDiet = () => {
    if (!age || !weight || !height) {
      setResult({ error: "Please provide your body metrics." });
      return;
    }

    const BMR = gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, intense: 1.9 };
    const TDEE = BMR * multipliers[activity];

    let targetCalories = TDEE;
    if (goal === "loss") targetCalories -= 400;
    else if (goal === "gain") targetCalories += 400;

    const plan = generateDietPlan(goal);
    setResult({ bmr: Math.round(BMR), tdee: Math.round(TDEE), calories: Math.round(targetCalories), plan });
  };

  const generateDietPlan = (goal) => {
    const plans = {
      loss: [
        { time: "Breakfast", meal: "Oats with Berries & 2 Egg Whites", icon: <Coffee className="w-5 h-5" />, color: "text-blue-500" },
        { time: "Lunch", meal: "Grilled Chicken/Paneer Salad with Quinoa", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-500" },
        { time: "Snack", meal: "Greek Yogurt or Handful of Almonds", icon: <Apple className="w-5 h-5" />, color: "text-rose-500" },
        { time: "Dinner", meal: "Baked Fish/Tofu with Steamed Broccoli", icon: <Moon className="w-5 h-5" />, color: "text-indigo-500" }
      ],
      gain: [
        { time: "Breakfast", meal: "Banana Peanut Butter Toast & Whole Milk", icon: <Coffee className="w-5 h-5" />, color: "text-orange-500" },
        { time: "Lunch", meal: "Brown Rice, Dal, Mixed Veg & Extra Ghee", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-500" },
        { time: "Snack", meal: "Protein Shake & Dried Fruits", icon: <Apple className="w-5 h-5" />, color: "text-rose-500" },
        { time: "Dinner", meal: "Sweet Potato, Lean Protein & Avocado", icon: <Moon className="w-5 h-5" />, color: "text-indigo-500" }
      ],
      maintain: [
        { time: "Breakfast", meal: "Scrambled Eggs on Whole Wheat Bread", icon: <Coffee className="w-5 h-5" />, color: "text-blue-500" },
        { time: "Lunch", meal: "Lentil Soup with Rice and Fresh Salad", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-500" },
        { time: "Snack", meal: "Apple with Peanut Butter", icon: <Apple className="w-5 h-5" />, color: "text-rose-500" },
        { time: "Dinner", meal: "Grilled Protein with Roasted Vegetables", icon: <Moon className="w-5 h-5" />, color: "text-indigo-500" }
      ]
    };
    return plans[goal];
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors mb-8 group text-sm font-medium">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Input Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600">
                  <Apple className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black dark:text-white tracking-tight">Diet Setup</h1>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" value={age} onChange={setAge} placeholder="24" unit="yrs" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-rose-500 dark:text-white appearance-none">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Weight" value={weight} onChange={setWeight} placeholder="70" unit="kg" />
                  <InputField label="Height" value={height} onChange={setHeight} placeholder="175" unit="cm" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Activity</label>
                  <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-xs outline-none dark:text-white appearance-none">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fitness Goal</label>
                  <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-xs outline-none dark:text-white appearance-none">
                    <option value="maintain">Maintain Weight</option>
                    <option value="loss">Weight Loss</option>
                    <option value="gain">Muscle Gain</option>
                  </select>
                </div>

                <button onClick={calculateDiet} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 active:scale-95">
                  Generate My Plan
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Summary Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Calories</p>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-black text-rose-600">{result.calories}</span>
                        <span className="text-xs font-bold text-slate-400 pb-1">kcal/day</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Body Status</p>
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-500" />
                        <span className="text-xl font-bold dark:text-white">Normal BMI</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Selected Goal</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-xl font-bold dark:text-white capitalize">{goal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Timeline */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50">
                    <h3 className="text-lg font-bold dark:text-white mb-8 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-rose-500" /> Daily Meal Schedule
                    </h3>
                    
                    <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                      {result.plan.map((item, i) => (
                        <div key={i} className="relative pl-12">
                          <div className={`absolute left-0 top-0 w-10 h-10 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center z-10 ${item.color} shadow-sm`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</p>
                            <p className="text-md font-bold text-slate-800 dark:text-slate-200">{item.meal}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex gap-4">
                      <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-700 uppercase mb-1">Hydration Target</p>
                        <p className="text-sm text-blue-900 font-medium">Drink 2.5L - 3.5L of water daily to maintain metabolism.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex gap-4">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-700 uppercase mb-1">Pro Tip</p>
                        <p className="text-sm text-amber-900 font-medium">Consistency is key. Try to eat within a 10-hour window.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12">
                  <Apple className="w-12 h-12 mb-4 opacity-20 animate-pulse" />
                  <p className="text-sm font-medium uppercase tracking-widest">Input Body Metrics to View Plan</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}