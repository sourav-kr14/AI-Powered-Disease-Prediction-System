import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import InputCard from "../components/InputCard";
import PredictionCard from "../components/PredictionCard";
import NearbyHospitals from "../components/NearbyHospitals";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const predictDisease = async (input) => {
    setLoading(true);
    setResult(null);

    try {
      const symptomsArray = Array.isArray(input)
        ? input.map((item) => item.trim().toLowerCase().replace(/\s+/g, "_")).filter(Boolean)
        : input
            .split(",")
            .map((item) => item.trim().toLowerCase().replace(/\s+/g, "_"))
            .filter(Boolean);

      if (!symptomsArray.length) {
        setResult({ error: "Please enter at least one symptom to check." });
        return;
      }

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
        method: "POST",
        headers,
        body: JSON.stringify({ symptoms: symptomsArray }),
      });

      if (!res.ok) {
        throw new Error("Unable to complete prediction request.");
      }

      const data = await res.json();

      if (data?.success && data?.data) {
        setResult(data.data);
      } else {
        setResult({
          error: data?.error || "We couldn't analyze those symptoms. Please try adding different symptoms.",
        });
      }
    } catch {
      setResult({
        error: "Unable to connect to the server. Please check your internet connection or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        badge="AI Health Check"
        title="Check your symptoms"
        description="Select what you are feeling to see potential health conditions, recommended precautions, and nearby clinics."
      />

      {/* Input */}
      <InputCard onPredict={predictDisease} loading={loading} />

      {/* Loading Indicator */}
      {loading && (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-12 text-center shadow-sm space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)] mx-auto" />
          <p className="text-base font-bold text-[var(--text-main)]">
            Analyzing your symptoms...
          </p>
          <p className="text-xs text-[var(--text-sub)]">
            Comparing your input against health patterns
          </p>
        </div>
      )}

      {/* Error Message */}
      {!loading && result?.error && (
        <div className="rounded-2xl border border-[var(--danger)] bg-[var(--danger-light)] p-5 text-sm text-[var(--text-main)] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[var(--danger)] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[var(--danger)]">Analysis Notice</p>
            <p className="mt-0.5">{result.error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && result && !result.error && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-main)]">
              Analysis Results
            </h2>
            <button
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Start over</span>
            </button>
          </div>

          <PredictionCard result={result} />
          <NearbyHospitals />
        </div>
      )}
    </div>
  );
}
