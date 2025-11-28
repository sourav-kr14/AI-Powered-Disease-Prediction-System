import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import BMI from "./pages/BMI";
import DietPlan from "./pages/DietPlan";
import CalorieCalculator from "./pages/CalorieCalculator";
import ChatBot from "./pages/ChatBot";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/bmi" element={<BMI />} />
        <Route path="/diet" element={<DietPlan />} />
        <Route path="/calories" element={<CalorieCalculator />} />
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}
