import React from "react";
import { motion } from "framer-motion";

export default function PredictionCard({ result }) {
  if (!result || result.error) return null;

  const { prediction, top3 } = result;

  return (
    <div className="mt-6 bg-white/95 p-6 rounded-2xl shadow-lg border border-blue-100">
      <h2 className="text-xl font-bold mb-4 text-center">🩺 AI Disease Prediction</h2>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-600">Most Likely Disease</p>
        <h3 className="text-2xl font-bold text-green-700 mt-1">{prediction}</h3>
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">Other Possible Diseases</h3>

      {top3.map((item, index) => {
        const percent = item.confidence * 100;
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">{item.disease}</span>
              <span className="font-semibold text-gray-800">{percent.toFixed(2)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
