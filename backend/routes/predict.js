const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { symptoms, location } = req.body;

  // 🔹 Validate ENV
  if (!process.env.ML_SERVICE_URL) {
    return res.status(500).json({
      error: "ML service URL not configured",
    });
  }

  // 🔹 Validate input
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      error: "Symptoms must be a non-empty array",
    });
  }

  // 🔹 Clean symptoms
  const cleanedSymptoms = symptoms
    .map((s) => s?.trim().toLowerCase())
    .filter(Boolean);

  try {
    const mlUrl = `${process.env.ML_SERVICE_URL}/predict`;
    console.log("📡 Calling ML at:", mlUrl);

    const mlResponse = await axios.post(
      mlUrl,
      { symptoms: cleanedSymptoms },
      {
        timeout: 15000, // safer timeout
        headers: { "Content-Type": "application/json" },
      },
    );

    const result = mlResponse.data;

    // 🔹 Save to DB (non-blocking safe)
    try {
      await Prediction.create({
        symptoms: cleanedSymptoms,
        predictedDisease: result.prediction,
        top3Predictions: result.top3,
        precautions: result.precautions,
        userLocation: location || null,
      });
    } catch (dbError) {
      console.warn("⚠️ DB save failed:", dbError.message);
    }

    // 🔹 Response
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "❌ ML Service Error:",
      error.response?.data || error.message,
    );

    return res.status(503).json({
      success: false,
      error: "Prediction service unavailable",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
