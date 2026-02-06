const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4000&type=hospital&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    console.error("Google API error:", err);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

module.exports = router;
