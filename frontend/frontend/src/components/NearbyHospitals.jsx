import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Star,
  Hospital,
  Loader2,
  AlertTriangle,
  LocateFixed,
  ExternalLink,
} from "lucide-react";

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchHospitals = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/hospitals`,
            { lat, lng },
          );

          setHospitals(res.data?.results || []);
        } catch (error) {
          setError(
            error.response?.data?.message ||
              "Unable to connect to the medical directory right now.",
          );
          setHospitals([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Location access was denied. Enable location permission to find nearby hospitals.",
        );
        setHospitals([]);
        setLoading(false);
      },
    );
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">
            <Hospital className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Care Support
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
              Nearby hospitals
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Use your location to find nearby medical facilities and open
              directions in Google Maps when needed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchHospitals}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4" />
              Find nearby care
            </>
          )}
        </button>
      </div>

      {!hasSearched && (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-[#0b1824] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Find emergency and nearby medical care
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            We only request your location when you choose to search. This helps
            us show relevant hospitals near your current area.
          </p>
        </div>
      )}

      {loading && (
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/20 bg-rose-400/10 text-rose-100">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-100">
            Searching nearby facilities
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Checking available hospitals around your current location.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-400/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-200" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
                Location unavailable
              </p>
              <p className="mt-2 text-sm leading-7 text-amber-50/85">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && hasSearched && !error && hospitals.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-[#0b1824] p-8 text-center">
          <MapPin className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          <h3 className="text-lg font-bold text-white">No hospitals found</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            We couldn’t find nearby facilities from the current search. Please
            try again or refine backend location support.
          </p>
        </div>
      )}

      {!loading && hospitals.length > 0 && (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Search results
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              {hospitals.length} found nearby
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {hospitals.map((hospital, index) => {
                const lat = hospital?.geometry?.location?.lat;
                const lng = hospital?.geometry?.location?.lng;
                const mapsUrl =
                  lat && lng
                    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                    : null;

                return (
                  <motion.div
                    key={`${hospital.name}-${index}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-5 transition hover:border-cyan-300/20 hover:bg-[#102132]"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold leading-tight text-white">
                          {hospital.name}
                        </h3>
                        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-400">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                          <span>
                            {hospital.vicinity || "Address unavailable"}
                          </span>
                        </p>
                      </div>

                      {hospital.rating ? (
                        <div className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-100">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {hospital.rating}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex gap-3">
                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                        >
                          <Navigation className="h-4 w-4" />
                          Directions
                        </a>
                      ) : (
                        <div className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-slate-500">
                          Directions unavailable
                        </div>
                      )}

                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                          aria-label={`Open ${hospital.name} in maps`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
