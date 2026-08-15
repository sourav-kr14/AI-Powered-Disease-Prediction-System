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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  userName: {
    type: String,
    default: "",
  },
  top3Predictions: [
    {
      disease: { type: String, required: true },
      confidence: { type: Number, required: true },
    }
  ],
  precautions: {
    type: Map,
    of: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", PredictionSchema);
