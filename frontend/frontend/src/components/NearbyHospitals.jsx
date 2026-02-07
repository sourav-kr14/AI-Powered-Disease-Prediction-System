import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Star,
  Phone,
  ExternalLink,
  Hospital,
  Loader2,
} from "lucide-react";

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        try {
          const res = await axios.post("http://localhost:5000/api/hospitals", {
            lat,
            lng,
          });
          setHospitals(res.data.results || []);
        } catch (err) {
          setError("Unable to connect to the medical directory.");
          console.error("Hospital fetch error:", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Location access denied. Please enable GPS to find nearby emergency care.",
        );
        setLoading(false);
      },
    );
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold dark:text-white">
            Emergency Facilities
          </h2>
        </div>
        {!loading && hospitals.length > 0 && (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {hospitals.length} Found Nearby
          </span>
        )}
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20" />
            <div className="relative bg-rose-50 p-4 rounded-full">
              <Navigation className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">
            Scanning nearby medical facilities...
          </p>
        </div>
      )}

      {!loading && (error || hospitals.length === 0) && (
        <div className="py-12 px-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium italic">
            {error || "No hospitals found within your immediate vicinity."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {hospitals.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800 dark:text-white leading-tight group-hover:text-rose-600 transition-colors">
                  {h.name}
                </h3>
                {h.rating && (
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg text-amber-600 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {h.rating}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  {h.vicinity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${h.geometry.location.lat},${h.geometry.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-[11px] font-bold rounded-xl transition-all"
                >
                  <Navigation className="w-3 h-3" /> Directions
                </a>
                <button className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
