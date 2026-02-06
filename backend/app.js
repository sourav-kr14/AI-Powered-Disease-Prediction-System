const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ai-powered-disease-prediction-syste.vercel.app",
];

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ai-powered-disease-prediction-syste.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const predictRoute = require("./routes/predict");
app.use("/api/predict", predictRoute);

app.use("/api/hospitals", require("./routes/hospitals"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
