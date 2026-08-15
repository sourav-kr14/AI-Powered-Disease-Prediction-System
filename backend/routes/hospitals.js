const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Google API key not configured" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=hospital&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    if (response.data.status && response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
      console.error("❌ Google Places API failure status:", response.data.status, response.data.error_message);
      return res.status(502).json({
        error: "Google API error",
        status: response.data.status,
        message: response.data.error_message || `API key error: ${response.data.status}`,
      });
    }

    res.json(response.data);
  } catch (err) {
    console.error("Google API error:", err.message);
    res.status(500).json({ error: "Failed to fetch hospitals", details: err.message });
  }
});

module.exports = router;
