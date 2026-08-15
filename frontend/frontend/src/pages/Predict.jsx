import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BrainCircuit,
  Loader2,
  Info,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import InputCard from "../components/InputCard";
import PredictionCard from "../components/PredictionCard";
import NearbyHospitals from "../components/NearbyHospitals";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictDisease = async (input) => {
    setLoading(true);
    setResult(null);

    try {
      const symptomsArray = Array.isArray(input)
        ? input.map((item) => item.trim().toLowerCase()).filter(Boolean)
        : input
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);

      if (!symptomsArray.length) {
        setResult({ error: "Please enter at least one symptom." });
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: symptomsArray }),
      });

      if (!res.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await res.json();

      if (data?.success && data?.data) {
        setResult(data.data);
      } else {
        setResult({
          error: data?.error || "Unable to generate a prediction right now.",
        });
      }
    } catch {
      setResult({
        error:
          "We could not reach the server. Please check the backend and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111a] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                AI Diagnostic Engine
              </div>

              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-200">
                  <BrainCircuit className="h-7 w-7" />
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                    Predict possible conditions
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
                    Enter symptoms in natural language and get likely matches,
                    confidence levels, precaution guidance, and nearby medical
                    support options.
                  </p>
                </div>
              </div>

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Step 1
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Add symptoms like fever, cough, fatigue, chest pain, or sore
                    throat.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Step 2
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Our model compares symptom patterns and ranks likely
                    matches.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0b1824] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Step 3
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Review precautions carefully and consult a doctor when
                    needed.
                  </p>
                </div>
              </div>

              <div className="mb-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-200" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">
                      Medical Safety Note
                    </p>
                    <p className="mt-2 text-sm leading-7 text-amber-50/85">
                      This tool is for educational support only. If symptoms are
                      severe, sudden, or include breathing difficulty, chest
                      pain, fainting, or uncontrolled bleeding, seek urgent
                      medical care immediately.
                    </p>
                  </div>
                </div>
              </div>

              <InputCard onPredict={predictDisease} loading={loading} />
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Best Input Style
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Describe symptoms clearly
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <p>Use commas between symptoms for better parsing.</p>
                <p>Example: `fever, dry cough, sore throat, fatigue`</p>
                <p>
                  Adding 2 to 5 relevant symptoms usually gives better results.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                What You Get
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#0b1824] p-4 text-sm text-slate-300">
                  Ranked prediction list
                </div>
                <div className="rounded-2xl bg-[#0b1824] p-4 text-sm text-slate-300">
                  Confidence-aware explanation
                </div>
                <div className="rounded-2xl bg-[#0b1824] p-4 text-sm text-slate-300">
                  Precaution guidance
                </div>
                <div className="rounded-2xl bg-[#0b1824] p-4 text-sm text-slate-300">
                  Nearby care support
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur-2xl"
              >
                <div className="mx-auto flex max-w-md flex-col items-center">
                  <div className="mb-5 rounded-full border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-200">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-200">
                    Analyzing symptoms
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Validating your symptom pattern and preparing the most
                    likely matches.
                  </p>
                </div>
              </motion.div>
            )}

            {!loading && result && !result.error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="space-y-8"
              >
                <PredictionCard result={result} />
                <NearbyHospitals />
              </motion.div>
            )}

            {!loading && result?.error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className="rounded-[2rem] border border-rose-300/20 bg-rose-400/10 p-6"
              >
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-rose-200" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-100">
                      Prediction unavailable
                    </p>
                    <p className="mt-2 text-sm leading-7 text-rose-50/85">
                      {result.error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
            SymptoScan Analysis Flow
            <ArrowRight className="h-4 w-4" />
            Symptoms to guidance
          </div>
        </div>
      </div>
    </div>
  );
}
