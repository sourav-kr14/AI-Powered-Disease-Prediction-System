import React, { useState } from "react";

export default function HealthCard() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!age || !weight || !height) {
      setResult({ error: "Please fill all fields." });
      return;
    }

    const h = height / 100;
    const bmi = weight / (h * h);

    let status = "";
    let advice = "";

    if (bmi < 18.5) {
      status = "Underweight";
      advice = "Increase calories, eat protein-rich foods, nuts, eggs, milk.";
    } else if (bmi < 24.9) {
      status = "Normal";
      advice = "Maintain with balanced diet & regular exercise.";
    } else if (bmi < 29.9) {
      status = "Overweight";
      advice = "Reduce junk food, sugar; walk 30 min daily.";
    } else {
      status = "Obese";
      advice = "Consult a doctor. Avoid sugary drinks & high-calorie foods.";
    }

    const idealMin = (18.5 * h * h).toFixed(1);
    const idealMax = (24.9 * h * h).toFixed(1);

    setResult({
      bmi: bmi.toFixed(2),
      status,
      advice,
      idealRange: `${idealMin} kg – ${idealMax} kg`,
    });
  };

  return (
    <div className="bg-white/90 p-6 rounded-2xl shadow-lg border border-blue-100 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">⚕️ General Health Checker</h2>

      <div className="space-y-3">
        <input
          type="number"
          placeholder="Age"
          className="w-full p-3 rounded-xl border border-gray-300"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          className="w-full p-3 rounded-xl border border-gray-300"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (cm)"
          className="w-full p-3 rounded-xl border border-gray-300"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <button
          onClick={calculateBMI}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
        >
          Check Health
        </button>
      </div>

      {result && !result.error && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <h3 className="text-lg font-bold text-blue-700">Your Health Result</h3>
          <p className="mt-2 text-gray-700">BMI: <b>{result.bmi}</b></p>
          <p className="text-gray-700">Status: <b>{result.status}</b></p>
          <p className="text-gray-700">Ideal Weight: <b>{result.idealRange}</b></p>
          <p className="mt-3 text-sm text-gray-600">{result.advice}</p>
        </div>
      )}

      {result?.error && (
        <p className="text-red-600 text-center mt-3">{result.error}</p>
      )}
    </div>
  );
}
