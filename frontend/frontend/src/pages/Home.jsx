import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          🩺 AI Healthcare Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Choose a tool to get started with your health analysis.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
        
          <Link
            to="/predict"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              🤖 Predict Disease
            </h2>
            <p className="text-gray-600 text-sm">
              Enter symptoms and get AI-powered diagnosis.
            </p>
          </Link>
            <Link
            to="/chat"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold text-purple-600 mb-2">
              💬 Symptom Chatbot
            </h2>
            <p className="text-gray-600 text-sm">
              Chat with an AI assistant to diagnose your symptoms.
            </p>
          </Link>

          {/* BMI Calculator */}
          <Link
            to="/bmi"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold text-green-600 mb-2">
              ⚕️ BMI Calculator
            </h2>
            <p className="text-gray-600 text-sm">
              Check your BMI, ideal weight & health advice.
            </p>
          </Link>

          {/* Diet Plan Generator */}
          <Link
            to="/diet"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold text-pink-600 mb-2">
              🍎 Diet Plan Generator
            </h2>
            <p className="text-gray-600 text-sm">
              Get a personalized daily diet plan based on your goals.
            </p>
          </Link>
          {/* Calorie Calculator */}
          <Link
            to="/calories"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold text-orange-600 mb-2">
              🔥 Calorie Calculator
            </h2>
            <p className="text-gray-600 text-sm">
              Calculate daily calories based on age, height, weight & activity.
            </p>
          </Link>
        
        </div>
      </div>
    </div>
  );
}
