import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function PredictionCard({ result }) {
  // 🔹 Loading / Error Handling
  if (!result) {
    return (
      <p className="text-center text-sm text-slate-500">
        Analyzing symptoms...
      </p>
    );
  }

  if (result.error) {
    return <p className="text-center text-sm text-red-500">{result.error}</p>;
  }

  const { prediction, top3, precautions } = result;

  if (!top3 || top3.length === 0) return null;

  // 🔹 Risk classification
  const getRiskStatus = (confidence) => {
    if (confidence > 0.7)
      return {
        label: "High Confidence",
        color: "text-rose-600 bg-rose-50 border-rose-100",
        icon: <ShieldAlert className="w-3 h-3" />,
      };
    if (confidence > 0.4)
      return {
        label: "Moderate Confidence",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        icon: <AlertTriangle className="w-3 h-3" />,
      };
    return {
      label: "Low Confidence",
      color: "text-blue-600 bg-blue-50 border-blue-100",
      icon: <Info className="w-3 h-3" />,
    };
  };

  const primaryRisk = getRiskStatus(top3[0]?.confidence || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold dark:text-white">Analysis Result</h2>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${primaryRisk.color}`}
        >
          {primaryRisk.icon} {primaryRisk.label}
        </div>
      </div>

      {/* MAIN RESULT */}
      <div className="bg-slate-900 dark:bg-blue-600 p-8 rounded-[2rem] mb-8 text-white">
        <p className="text-blue-200 text-xs font-bold uppercase mb-1">
          Potential Diagnosis
        </p>

        <h3 className="text-4xl font-black mb-2">{prediction}</h3>

        <p className="text-sm opacity-80 mb-3">
          Confidence: {(top3[0]?.confidence * 100).toFixed(1)}%
        </p>

        <div className="flex items-center gap-2 text-sm opacity-90">
          <CheckCircle2 className="w-4 h-4" />
          AI matched your symptoms with {prediction}
        </div>
      </div>

      {/* PROBABILITY SECTION */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase">
          Top 3 Predictions
        </h3>

        {top3.map((item, index) => {
          const percent = item.confidence * 100;

          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold dark:text-white">
                  {item.disease}
                </span>
                <span className="text-xs">{percent.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 PRECAUTIONS (NEW FEATURE) */}
      {precautions && Object.keys(precautions).length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase">
            Recommended Precautions
          </h3>

          {Object.entries(precautions).map(([disease, tips], idx) => (
            <div key={idx} className="mb-4">
              <p className="text-xs font-semibold mb-1 dark:text-white">
                {disease}
              </p>

              <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="mt-8 p-4 bg-slate-100 rounded-2xl flex gap-3">
        <Info className="w-4 h-4 text-slate-400 mt-1" />
        <p className="text-xs text-slate-500 italic">
          This AI model provides statistical predictions and does not replace
          medical advice. Please consult a doctor.
        </p>
      </div>
    </motion.div>
  );
}
