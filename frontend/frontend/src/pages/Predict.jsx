import { useState } from "react";
import InputCard from "../components/InputCard";
import PredictionCard from "../components/PredictionCard";
import NearbyHospitals from "../components/NearbyHospitals";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictDisease = async (symptoms) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Connection error" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-4">
          🤖 AI Disease Predictor
        </h1>

        <InputCard onPredict={predictDisease} />

        {loading && <p className="mt-4 text-center">Analyzing...</p>}

        {/* Prediction successful */}
        {!loading && result && !result.error && (
          <>
            <PredictionCard result={result} />

            {/* ⭐ Show Nearby Hospitals*/}
            <NearbyHospitals />
          </>
        )}

        {/* Error message */}
        {result?.error && (
          <div className="text-center text-red-600 mt-5">{result.error}</div>
        )}

      </div>
    </div>
  );
}
