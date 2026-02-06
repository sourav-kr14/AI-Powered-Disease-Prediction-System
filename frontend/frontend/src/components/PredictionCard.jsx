import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export default function PredictionCard({ result }) {
  if (!result || result.error) return null;

  const { prediction, top3 } = result;

  // Logic for a dynamic risk badge
  const getRiskStatus = (confidence) => {
    if (confidence > 0.7) return { label: "High Confidence", color: "text-rose-600 bg-rose-50 border-rose-100", icon: <ShieldAlert className="w-3 h-3" /> };
    if (confidence > 0.4) return { label: "Moderate Confidence", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <AlertTriangle className="w-3 h-3" /> };
    return { label: "Low Confidence", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Info className="w-3 h-3" /> };
  };

  const primaryRisk = getRiskStatus(top3[0]?.confidence || 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold dark:text-white">Analysis Result</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${primaryRisk.color}`}>
          {primaryRisk.icon} {primaryRisk.label}
        </div>
      </div>

      {/* Primary Result Display */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-blue-600 p-8 rounded-[2rem] mb-8 text-white shadow-xl shadow-blue-500/20">
        <div className="relative z-10">
          <p className="text-blue-200 dark:text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Potential Diagnosis</p>
          <h3 className="text-4xl font-black tracking-tight mb-4">{prediction}</h3>
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <CheckCircle2 className="w-4 h-4" /> 
            AI matches your symptoms with {prediction}
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Probability Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Probability Distribution</h3>
          <span className="text-[10px] text-slate-400">Top 3 Candidates</span>
        </div>

        {top3.map((item, index) => {
          const percent = item.confidence * 100;
          return (
            <div key={index} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                  {item.disease}
                </span>
                <span className="text-xs font-black text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {percent.toFixed(1)}%
                </span>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "circOut", delay: 0.2 + index * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Footer Disclaimer */}
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex gap-3 items-start border border-slate-100 dark:border-slate-800">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
          This AI model provides an analysis based on statistical likelihood. It does not replace clinical testing or professional consultation. Please visit the "Nearby Hospitals" section for immediate care.
        </p>
      </div>
    </motion.div>
  );
}