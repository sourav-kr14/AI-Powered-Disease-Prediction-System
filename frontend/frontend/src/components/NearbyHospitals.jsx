import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  Navigation,
  Star,
  Hospital,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchHospitals = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by your browser.");
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
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Could not load nearby hospitals at this moment.",
          );
          setHospitals([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Location access was denied. Please enable location permissions in your browser to discover nearby clinics.",
        );
        setHospitals([]);
        setLoading(false);
      },
    );
  };

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Hospital className="h-5 w-5 text-[var(--primary)]" />
            <span>Need to see a doctor?</span>
          </h3>
          <p className="text-sm text-[var(--text-sub)] mt-0.5">
            Locate nearby clinics and emergency care centers in your area.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHospitals}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Locating clinics...</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              <span>Find Nearby Clinics</span>
            </>
          )}
        </button>
      </div>

      {/* State views */}
      {error && (
        <div className="rounded-xl border border-[var(--warning)] bg-[var(--warning-light)] p-4 text-xs text-[var(--text-main)] flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-[var(--warning)] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {hasSearched && !loading && !error && hospitals.length === 0 && (
        <p className="text-center py-6 text-sm text-[var(--text-muted)]">
          No medical facilities were found in your immediate area.
        </p>
      )}

      {hospitals.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {hospitals.map((hospital, idx) => {
            const lat = hospital?.geometry?.location?.lat;
            const lng = hospital?.geometry?.location?.lng;
            const mapsUrl =
              lat && lng
                ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
                : null;

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-4 space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[var(--text-main)] line-clamp-1">
                      {hospital.name}
                    </h4>
                    {hospital.rating && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs font-bold text-amber-500 border border-[var(--border-color)]">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{hospital.rating}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-sub)] line-clamp-2">
                    {hospital.vicinity || "Address unlisted"}
                  </p>
                </div>

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors w-full"
                  >
                    <Navigation className="h-3.5 w-3.5 text-[var(--primary)]" />
                    <span>Get Directions</span>
                    <ExternalLink className="h-3 w-3 text-[var(--text-muted)] ml-auto" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
