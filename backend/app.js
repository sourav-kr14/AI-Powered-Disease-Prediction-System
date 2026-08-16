require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Database connection (non-blocking — app starts even if DB is unavailable)
connectDB();

// --- CORS Configuration ---
const defaultOrigins = ["http://localhost:5173", "http://localhost:3000"];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean)
  : defaultOrigins;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, "");

      if (
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(cleanOrigin) ||
        // Support any vercel deployment subdomain if vercel is configured
        (cleanOrigin.endsWith(".vercel.app") && allowedOrigins.some((o) => o.includes("vercel.app") || o === "*"))
      ) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked request from origin: "${origin}". Configured origins:`, allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/hospitals", require("./routes/hospitals"));

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 0
      ? "disconnected"
      : dbState === 1
        ? "connected"
        : dbState === 2
          ? "connecting"
          : "disconnecting";

  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// --- Global Error Handler ---
// Must be after all routes. Catches unhandled errors including CORS rejections.
app.use((err, req, res, _next) => {
  // Log the error server-side with enough context to debug
  console.error(`❌ [${req.method} ${req.path}]`, err.message);

  // Don't leak stack traces or internal details to clients in production
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 CORS origins: ${allowedOrigins.join(", ")}`);
});

// --- Graceful Shutdown ---
const shutdown = (signal) => {
  console.log(`\n⏹️  ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    const mongoose = require("mongoose");
    mongoose.connection.close(false).then(() => {
      console.log("🔌 MongoDB connection closed.");
      process.exit(0);
    });
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Catch unhandled promise rejections (e.g. database errors in async code)
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});
