const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const Prediction = require("../models/Prediction");

const router = express.Router();

const PYTHON_PATH = process.env.PYTHON_PATH || "python3";


router.post("/", async (req, res) => {
  const { symptoms, location } = req.body;

  if (!symptoms || !symptoms.trim()) {
    return res.status(400).json({ error: "Please enter symptoms." });
  }

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

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      await Prediction.create({
        symptoms: symptoms.split(",").map((s) => s.trim().toLowerCase()),
        predictedDisease: result.prediction,
        userLocation: location || null,
      });

      res.json(result);
    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({ error: "Invalid response from Python script." });
    }
  });
});

module.exports = router;
