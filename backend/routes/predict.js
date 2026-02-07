const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/", async (req, res) => {
  const { symptoms, location } = req.body;

  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ error: "Please enter symptoms." });
  }

  try {
    console.log("Calling ML at:", `${process.env.ML_SERVICE_URL}/predict`);

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      { symptoms },
      { timeout: 30000 },
    );

    const result = mlResponse.data;

    await Prediction.create({
      symptoms: symptoms.split(",").map((s) => s.trim().toLowerCase()),
      predictedDisease: result.prediction,
      userLocation: location || null,
    });

    return res.json(result);
  } catch (error) {
    console.error("ML Service Error:", error.message);

    return res.status(503).json({
      error: "Prediction service unavailable",
    });
  }
});

module.exports = router;
