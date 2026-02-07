import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Apple, Coffee, Utensils, Moon, Droplets, 
  Lightbulb, ChevronLeft, Target, Scale, Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";

const InputField = ({ label, value, onChange, placeholder, unit }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-3 rounded-2xl focus:border-rose-500/50 outline-none transition-all text-sm text-white placeholder:text-zinc-700 shadow-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500 uppercase">{unit}</span>
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
    if (!age || !weight || !height) return;

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
        { time: "Breakfast", meal: "Oats with Berries & 2 Egg Whites", icon: <Coffee className="w-5 h-5" />, color: "text-blue-400" },
        { time: "Lunch", meal: "Grilled Chicken/Paneer Salad", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-400" },
        { time: "Snack", meal: "Greek Yogurt or Handful of Almonds", icon: <Apple className="w-5 h-5" />, color: "text-rose-400" },
        { time: "Dinner", meal: "Baked Tofu with Steamed Broccoli", icon: <Moon className="w-5 h-5" />, color: "text-indigo-400" }
      ],
      gain: [
        { time: "Breakfast", meal: "Banana Peanut Butter Toast & Milk", icon: <Coffee className="w-5 h-5" />, color: "text-orange-400" },
        { time: "Lunch", meal: "Brown Rice, Dal & Mixed Veg", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-400" },
        { time: "Snack", meal: "Protein Shake & Dried Fruits", icon: <Apple className="w-5 h-5" />, color: "text-rose-400" },
        { time: "Dinner", meal: "Sweet Potato & Lean Protein", icon: <Moon className="w-5 h-5" />, color: "text-indigo-400" }
      ],
      maintain: [
        { time: "Breakfast", meal: "Scrambled Eggs on Whole Wheat", icon: <Coffee className="w-5 h-5" />, color: "text-blue-400" },
        { time: "Lunch", meal: "Lentil Soup with Rice and Salad", icon: <Utensils className="w-5 h-5" />, color: "text-emerald-400" },
        { time: "Snack", meal: "Apple with Peanut Butter", icon: <Apple className="w-5 h-5" />, color: "text-rose-400" },
        { time: "Dinner", meal: "Grilled Protein with Vegetables", icon: <Moon className="w-5 h-5" />, color: "text-indigo-400" }
      ]
    };
    return plans[goal];
  };

  return (
    <div className="min-h-screen bg-black py-10 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER NAVIGATION */}
        <div className="flex justify-between items-center mb-10 px-2">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-rose-400 transition-all font-bold text-xs group">
            <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-rose-500/50">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
            Dashboard
          </Link>
          <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">Nutrition Suite</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUT SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-500/20">
                  <Apple className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Diet Setup</h1>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" value={age} onChange={setAge} placeholder="24" unit="yrs" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-xs font-bold outline-none focus:border-rose-500/50 text-white appearance-none cursor-pointer">
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
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Activity</label>
                  <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-xs font-bold outline-none focus:border-rose-500/50 text-white appearance-none cursor-pointer">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Fitness Goal</label>
                  <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-xs font-bold outline-none focus:border-rose-500/50 text-white appearance-none cursor-pointer">
                    <option value="maintain">Maintain</option>
                    <option value="loss">Weight Loss</option>
                    <option value="gain">Muscle Gain</option>
                  </select>
                </div>

                <button onClick={calculateDiet} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-rose-500/20 active:scale-95 mt-4">
                  Generate Plan
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS CONTENT */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* Summary Metric Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] shadow-sm">
                      <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Target Intake</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-rose-500">{result.calories}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">kcal/day</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] shadow-sm">
                      <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">BMR Value</p>
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-400" />
                        <span className="text-xl font-bold text-white">{result.bmr} kcal</span>
                      </div>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] shadow-sm">
                      <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Protocol</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="text-xl font-bold text-white capitalize">{goal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Timeline */}
                  <div className="bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[3rem] border border-zinc-800/50 shadow-2xl relative">
                    <h3 className="text-lg font-black text-white mb-10 flex items-center gap-3">
                      <div className="p-2 bg-rose-600/10 rounded-lg"><Utensils className="w-5 h-5 text-rose-500" /></div>
                      Nutritional Timeline
                    </h3>
                    
                    <div className="space-y-10 relative before:absolute before:inset-0 before:left-[23px] before:w-0.5 before:bg-zinc-800/50">
                      {result.plan.map((item, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="relative pl-14">
                          <div className={`absolute left-0 top-0 w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center z-10 ${item.color} shadow-lg shadow-black/50`}>
                            {item.icon}
                          </div>
                          <div className="bg-black/20 p-4 rounded-2xl border border-zinc-800/30">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{item.time}</p>
                            <p className="text-md font-bold text-zinc-100">{item.meal}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 flex gap-4">
                      <Droplets className="w-6 h-6 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Hydration Matrix</p>
                        <p className="text-sm text-zinc-400 font-medium tracking-tight">Aim for 3.2L daily to optimize nutrient transport.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex gap-4">
                      <Lightbulb className="w-6 h-6 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">AI Protocol</p>
                        <p className="text-sm text-zinc-400 font-medium tracking-tight">Consistency is key. Try to eat within a 10-hour window.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-zinc-700 border-2 border-dashed border-zinc-800 rounded-[3rem] p-12">
                  <Apple className="w-16 h-16 mb-6 opacity-10 animate-pulse text-rose-500" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Awaiting Biometric Data</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}