require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();


connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ai-powered-disease-prediction-system.vercel.app", 
];


app.use(
  cors({
    origin: function (origin, callback) {
   
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


app.use("/api/predict", require("./routes/predict"));
app.use("/api/hospitals", require("./routes/hospitals"));


app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
