import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  Info,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function PredictionCard({ result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="rounded-[2rem] border border-rose-300/20 bg-rose-400/10 p-6 text-sm text-rose-100">
        {result.error}
      </div>
    );
  }

  const { prediction, top3, precautions } = result;

  if (!top3 || !top3.length) return null;

  const topMatch = top3[0];
  const topConfidence = Number(topMatch?.confidence || 0);
  const confidencePercent = (topConfidence * 100).toFixed(1);

  const getConfidenceMeta = (confidence) => {
    if (confidence >= 0.6) {
      return {
        label: "High confidence",
        classes: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
        icon: <CheckCircle2 className="h-4 w-4" />,
        note: "The model found a comparatively stronger symptom match.",
      };
    }

    if (confidence >= 0.25) {
      return {
        label: "Moderate confidence",
        classes: "border-amber-300/20 bg-amber-400/10 text-amber-100",
        icon: <AlertTriangle className="h-4 w-4" />,
        note: "This match is useful, but should be reviewed carefully.",
      };
    }

    return {
      label: "Limited confidence",
      classes: "border-sky-300/20 bg-sky-400/10 text-sky-100",
      icon: <Info className="h-4 w-4" />,
      note: "The model confidence is low, so this result should be treated cautiously.",
    };
  };

  const confidenceMeta = getConfidenceMeta(topConfidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-emerald-100">
            <Activity className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Analysis Result
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
              Most likely match
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              This is the top-ranked condition based on the symptoms you
              entered. It is not a confirmed diagnosis.
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${confidenceMeta.classes}`}
        >
          {confidenceMeta.icon}
          {confidenceMeta.label}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            Primary prediction
          </p>

          <h3 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">
            {prediction || topMatch?.disease || "Unknown"}
          </h3>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
              Confidence: {confidencePercent}%
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
              Ranked #1 by the model
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 text-cyan-200" />
              <div>
                <p className="text-sm font-bold text-white">Interpretation</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {confidenceMeta.note}
                </p>
              </div>
            </div>
          </div>

          {topConfidence < 0.15 && (
            <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-200" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
                    Low-certainty result
                  </p>
                  <p className="mt-2 text-sm leading-7 text-amber-50/85">
                    The model scores are quite low, so this result should be
                    treated as a possible direction rather than a strong
                    conclusion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            Top ranked matches
          </p>

          <div className="mt-5 space-y-4">
            {top3.map((item, index) => {
              const percent = Number(item.confidence || 0) * 100;

              return (
                <div
                  key={`${item.disease}-${index}`}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Rank {index + 1}
                      </p>
                      <h4 className="mt-1 text-base font-bold text-white">
                        {item.disease}
                      </h4>
                    </div>

                    <div className="text-sm font-bold text-slate-300">
                      {percent.toFixed(1)}%
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.08 }}
                      className={`h-full rounded-full ${
                        index === 0
                          ? "bg-cyan-300"
                          : index === 1
                            ? "bg-emerald-300"
                            : "bg-orange-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {precautions && Object.keys(precautions).length > 0 && (
        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            Suggested precautions
          </p>

          <div className="mt-5 space-y-5">
            {Object.entries(precautions).map(([disease, tips]) => (
              <div
                key={disease}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                  {disease}
                </h4>

                <ul className="mt-3 space-y-2">
                  {tips.map((tip, index) => (
                    <li
                      key={`${disease}-${index}`}
                      className="flex items-start gap-3 text-sm leading-7 text-slate-300"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-200" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
              Important disclaimer
            </p>
            <p className="mt-2 text-sm leading-7 text-amber-50/85">
              This AI result is informational only and does not replace clinical
              evaluation, testing, or professional medical advice. If symptoms
              persist, worsen, or feel urgent, please contact a licensed doctor
              or emergency care provider.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
