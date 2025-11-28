import React, { useState } from "react";

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      setResult({ error: "Please enter all required fields." });
      return;
    }

    // BMR Calculation 
    const BMR =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // Activity multipliers
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      intense: 1.9,
    };

    const TDEE = BMR * multipliers[activity];

    // Goals
    const maintain = TDEE;
    const loss = TDEE - 400;  
    const gain = TDEE + 300;   

    const protein = weight * 1.6; 
    const fat = (0.25 * maintain) / 9;
    const carbs = (maintain - (protein * 4 + fat * 9)) / 4;

    setResult({
      bmr: Math.round(BMR),
      tdee: Math.round(TDEE),
      maintain: Math.round(maintain),
      loss: Math.round(loss),
      gain: Math.round(gain),
      protein: Math.round(protein),
      fats: Math.round(fat),
      carbs: Math.round(carbs),
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl border">

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          🔥 Calorie Requirement Calculator
        </h1>

        {/* FORM */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Activity Level */}
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="sedentary">Sedentary (No exercise)</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="active">Active (5–6 days/week)</option>
            <option value="intense">Intense Athlete Training</option>
          </select>

          <button
            onClick={calculateCalories}
            className="w-full bg-orange-600 text-white text-lg p-3 rounded-xl hover:bg-orange-700"
          >
            Calculate Calories
          </button>
        </div>

        {/* RESULTS */}
        {result && !result.error && (
          <div className="mt-6 bg-orange-50 p-5 rounded-xl border text-gray-800">

            <h2 className="text-xl font-bold text-orange-700 mb-3">
              Your Daily Calorie Breakdown
            </h2>

            <p><b>BMR:</b> {result.bmr} kcal</p>
            <p><b>TDEE:</b> {result.tdee} kcal</p>
            <p><b>Maintain Weight:</b> {result.maintain} kcal/day</p>
            <p><b>Weight Loss:</b> {result.loss} kcal/day</p>
            <p><b>Weight Gain:</b> {result.gain} kcal/day</p>

            <h3 className="text-lg font-bold mt-4">🍽 Macro Requirements</h3>
            <p><b>Protein:</b> {result.protein} g/day</p>
            <p><b>Fats:</b> {result.fats} g/day</p>
            <p><b>Carbs:</b> {Math.round(result.carbs)} g/day</p>

            <p className="mt-3 text-sm text-gray-700">
              A balanced macro diet helps boost metabolism, muscle growth, and fat loss.
            </p>
          </div>
        )}

        {result?.error && (
          <div className="text-red-600 mt-4 text-center">{result.error}</div>
        )}
      </div>
    </div>
  );
}
