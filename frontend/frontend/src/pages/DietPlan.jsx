import React, { useState } from "react";

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
      setResult({ error: "Please fill all fields correctly." });
      return;
    }

  
    const h = height / 100;

  
    let BMR =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

 
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      intense: 1.9,
    };

    const TDEE = BMR * multipliers[activity];

   
    let targetCalories = TDEE;
    if (goal === "loss") targetCalories -= 350;
    else if (goal === "gain") targetCalories += 350;

    
    const plan = generateDietPlan(goal);

    setResult({
      bmr: Math.round(BMR),
      tdee: Math.round(TDEE),
      calories: Math.round(targetCalories),
      plan,
    });
  };

  
  const generateDietPlan = (goal) => {
    if (goal === "loss") {
      return {
        breakfast: "Oats + Apple + 2 Egg Whites",
        lunch: "1 Cup Rice + Dal + Mixed Veg + Salad",
        dinner: "2 Rotis + Paneer/Chicken + Vegetables",
        snacks: "Green Tea + Nuts",
        hydration: "2.5 - 3L water",
        tips: "Avoid sugar, fried food & walk 30 minutes daily.",
      };
    }

    if (goal === "gain") {
      return {
        breakfast: "Banana Shake + Oats + Peanut Butter",
        lunch: "2 Cups Rice + Dal + Paneer/Chicken + Ghee",
        dinner: "3 Rotis + Paneer/Chicken + Veg",
        snacks: "Dry Fruits + Eggs + Milk",
        hydration: "3 - 3.5L water",
        tips: "Increase protein & calorie-dense foods.",
      };
    }

    return {
      breakfast: "Oats + Eggs + Milk",
      lunch: "Rice/Roti + Dal + Veg + Salad",
      dinner: "Roti + Paneer/Chicken + Veg",
      snacks: "Fruits + Nuts",
      hydration: "2.5 - 3L water",
      tips: "Maintain balanced protein, carbs & fats.",
    };
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl border">

        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🍎 Personalized Diet Plan Generator
        </h1>

        {/* FORM */}
        <div className="space-y-4">
          <input type="number" placeholder="Age"
            value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 border rounded-xl" />

          <input type="number" placeholder="Weight (kg)"
            value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 border rounded-xl" />

          <input type="number" placeholder="Height (cm)"
            value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full p-3 border rounded-xl" />

          {/* GENDER */}
          <select value={gender} onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border rounded-xl">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* ACTIVITY LEVEL */}
          <select value={activity} onChange={(e) => setActivity(e.target.value)}
            className="w-full p-3 border rounded-xl">
            <option value="sedentary">Sedentary (No exercise)</option>
            <option value="light">Light Exercise (1–3 days)</option>
            <option value="moderate">Moderate Exercise (3–5 days)</option>
            <option value="active">Active (5–6 days)</option>
            <option value="intense">Athlete Training</option>
          </select>

          {/* GOAL */}
          <select value={goal} onChange={(e) => setGoal(e.target.value)}
            className="w-full p-3 border rounded-xl">
            <option value="maintain">Maintain Weight</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Weight Gain</option>
          </select>

          <button
            onClick={calculateDiet}
            className="w-full bg-pink-600 text-white text-lg p-3 rounded-xl hover:bg-pink-700 mt-3"
          >
            Generate Diet Plan
          </button>
        </div>

        {/* RESULTS */}
        {result && !result.error && (
          <div className="mt-6 bg-pink-50 p-5 rounded-xl border">
            <h2 className="text-xl font-bold text-pink-700 mb-3">Your Daily Summary</h2>

            <p><b>BMR:</b> {result.bmr} kcal</p>
            <p><b>TDEE:</b> {result.tdee} kcal</p>
            <p><b>Target Calories:</b> {result.calories} kcal/day</p>

            <h3 className="text-lg font-bold mt-4">🍽 Diet Plan</h3>
            <p><b>Breakfast:</b> {result.plan.breakfast}</p>
            <p><b>Lunch:</b> {result.plan.lunch}</p>
            <p><b>Dinner:</b> {result.plan.dinner}</p>
            <p><b>Snacks:</b> {result.plan.snacks}</p>
            <p><b>Hydration:</b> {result.plan.hydration}</p>

            <p className="mt-3 text-sm text-gray-700"><b>Tips:</b> {result.plan.tips}</p>
          </div>
        )}

        {result?.error && (
          <div className="text-red-600 mt-4 text-center">{result.error}</div>
        )}

      </div>
    </div>
  );
}
