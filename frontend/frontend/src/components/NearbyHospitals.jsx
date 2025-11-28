import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NearbyHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "AIzaSyCmWusZjH8RfeX54oZElkUKWhTFmVyMkL0";  // Replace with your key

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=hospital&key=${API_KEY}`;

        try {
          const res = await axios.get(url);
          setHospitals(res.data.results);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      },
      () => {
        alert("Location access denied. Cannot fetch hospitals.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="mt-6 bg-white p-5 rounded-xl shadow border">
      <h2 className="text-xl font-bold text-red-600 mb-3">🏥 Nearby Hospitals</h2>

      {loading && <p className="text-gray-600">Fetching nearby hospitals...</p>}

      {!loading && hospitals.length === 0 && (
        <p className="text-gray-600">No hospitals found near you.</p>
      )}

      <ul className="space-y-3 mt-3">
        {hospitals.map((h, i) => (
          <li key={i} className="p-3 bg-gray-50 rounded-xl shadow-sm">
            <h3 className="font-bold">{h.name}</h3>
            <p className="text-sm text-gray-700">📍 {h.vicinity}</p>
            {h.rating && <p className="text-sm">⭐ {h.rating}</p>}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${h.geometry.location.lat},${h.geometry.location.lng}`}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              Open in Google Maps →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
