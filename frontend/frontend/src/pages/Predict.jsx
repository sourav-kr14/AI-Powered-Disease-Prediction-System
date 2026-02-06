import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, BrainCircuit, Loader2, Info } from "lucide-react";
import { Link } from "react-router-dom";
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Diagnostic server is currently unreachable." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>

        {/* Page Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black dark:text-white tracking-tight">
              AI Diagnostics
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Our neural network analyzes your symptoms against global medical
            data to provide a statistical health outlook.
          </p>
        </header>

        {/* Input Section */}
        <section className="mb-10">
          <InputCard onPredict={predictDisease} />
        </section>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Cross-referencing medical datasets...
              </p>
            </motion.div>
          )}

          {!loading && result && !result.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <PredictionCard result={result} />

              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <NearbyHospitals />
              </div>
            </motion.div>
          )}

          {result?.error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-center text-rose-600 font-medium text-sm flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4" /> {result.error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
