const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const Prediction = require("../models/Prediction");

const router = express.Router();

// Use exact Python path
const PYTHON_PATH = "C:\\Program Files\\Python311\\python.exe";

router.post("/", async (req, res) => {
  const { symptoms, location } = req.body;

  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ error: "Please enter symptoms." });
  }

  // Run Python Script
  const python = spawn(PYTHON_PATH, [
    path.join(__dirname, "..", "..", "ml", "predict.py"),
  ]);

  let outputData = "";
  let errorOccurred = false;

  python.stdin.write(JSON.stringify({ symptoms }));
  python.stdin.end();

  python.stdout.on("data", (data) => {
    outputData += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
    errorOccurred = true;
  });

  python.on("close", async () => {
    if (errorOccurred) {
      return res.status(500).json({ error: "Python script error." });
    }

    try {
      const result = JSON.parse(outputData);

      // If Python returns an internal error
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      // SAVE TO MONGODB
      await Prediction.create({
        symptoms: symptoms.split(",").map((s) => s.trim().toLowerCase()),
        predictedDisease: result.prediction,
        userLocation: location || null,
      });

      // Return the prediction to frontend
      res.json(result);

    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({ error: "Invalid response from Python script." });
    }
  });
});

module.exports = router;
