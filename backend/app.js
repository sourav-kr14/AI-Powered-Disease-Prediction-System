const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:5173" }));


app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, "public")));


const predictRoute = require("./routes/predict");
app.use("/api/predict", predictRoute);

app.use("/api/hospitals", require("./routes/hospitals"));


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
