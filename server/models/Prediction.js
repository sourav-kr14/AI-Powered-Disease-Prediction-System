const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  symptoms: {
    type: [String],
    required: true,
  },
  predictedDisease: {
    type: String,
    required: true,
  },
  userLocation: {
    lat: Number,
    lng: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", PredictionSchema);
