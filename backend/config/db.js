const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI is not set. Skipping database connection.");
      console.warn("   Set MONGO_URI in your .env file to enable persistence.");
      return;
    }

    // Detect placeholder values that indicate unconfigured connection strings
    if (
      process.env.MONGO_URI.includes("xxxxx") ||
      process.env.MONGO_URI.includes("your_") ||
      process.env.MONGO_URI.includes("<user>")
    ) {
      console.warn("⚠️ MONGO_URI contains placeholder values. Skipping database connection.");
      console.warn("   Update MONGO_URI in your .env with a real connection string.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🔥 MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Don't crash the app — allow it to run without persistence
    // The predict route already handles disconnected state gracefully
  }
};

// Connection event listeners for operational visibility
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔥 MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

module.exports = connectDB;
