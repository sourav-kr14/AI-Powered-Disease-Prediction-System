const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/", async (req, res) => {
  const { symptoms, location } = req.body;

  if (!process.env.ML_SERVICE_URL) {
    throw new Error("ML_SERVICE_URL is not defined");
  }

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      error: "Symptoms must be a non-empty array",
    });
  }

  const cleanedSymptoms = symptoms.map((s) => s.trim().toLowerCase());

  try {
    console.log("Calling ML at:", `${process.env.ML_SERVICE_URL}/predict`);

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      { symptoms: cleanedSymptoms },
      { timeout: 20000 },
    );

    const result = mlResponse.data;

    await Prediction.create({
      symptoms: cleanedSymptoms,
      predictedDisease: result.prediction,
      top3Predictions: result.top3,
      precautions: result.precautions,
      userLocation: location || null,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("ML Service Error:", error.response?.data || error.message);

    return res.status(503).json({
      error: "Prediction service unavailable",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
