const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/", async (req, res) => {
  const { symptoms, location } = req.body;

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      error: "Symptoms must be a non-empty array",
    });
  }
  try {
    console.log("Calling ML at:", `${process.env.ML_SERVICE_URL}/predict`);

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      { symptoms },
      { timeout: 20000 },
    );

    const result = mlResponse.data;

    await Prediction.create({
      symptoms: symptoms.split(",").map((s) => s.trim().toLowerCase()),
      predictedDisease: result.prediction,
      userLocation: location || null,
    });

    return res.json(result);
  } catch (error) {
    console.error("ML Service Error:", error.response?.data || error.message);

    return res.status(503).json({
      error: "Prediction service unavailable",
    });
  }
});

module.exports = router;
