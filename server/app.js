const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
connectDB();
// Allow React frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// Load prediction route
const predictRoute = require("./routes/predict");
app.use("/api/predict", predictRoute);

app.listen(5000, () => {
    console.log("🚀 Server running at http://localhost:5000");
});
