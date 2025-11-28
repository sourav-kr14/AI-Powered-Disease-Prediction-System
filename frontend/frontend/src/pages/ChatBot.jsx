import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 I'm your AI Medical Assistant." },
    { sender: "bot", text: "Tell me one symptom you're experiencing." }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [summary, setSummary] = useState(null);

  const chatRef = useRef(null);

  const QUESTIONS = [
    "Do you have fever?",
    "Are you feeling nausea?",
    "Any body fatigue?",
    "Do you have joint pain?",
    "Any vomiting?",
    "Do you have a cough?",
    "Are you experiencing weight loss?"
  ];

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const processUserMessage = (text) => {
    if (symptoms.length === 0) {
      setSymptoms([text.toLowerCase()]);
      addMessage("bot", "Got it. Let me ask a few questions…");
      setTimeout(() => askNextQuestion(), 800);
      return;
    }

    if (text.toLowerCase() === "yes") {
      setSymptoms((prev) => [
        ...prev,
        QUESTIONS[questionIndex - 1]
          .replace("Do you have ", "")
          .replace("Any ", "")
          .replace("Are you ", "")
          .replace("?", "")
      ]);
    }

    if (questionIndex < QUESTIONS.length) {
      setTimeout(() => askNextQuestion(), 600);
    } else {
      finalizeDiagnosis();
    }
  };

  const askNextQuestion = () => {
    if (questionIndex >= QUESTIONS.length) {
      finalizeDiagnosis();
      return;
    }

    addMessage("bot", QUESTIONS[questionIndex]);
    setQuestionIndex((prev) => prev + 1);
  };

  const finalizeDiagnosis = async () => {
    addMessage("bot", "Analyzing your symptoms… 🤖");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.join(", ") })
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        addMessage("bot", `⚠️ Error: ${data.error}`);
      } else {
        addMessage("bot", `🩺 Most likely disease: ${data.prediction}`);

        const summaryData = {
          symptoms: symptoms,
          prediction: data.prediction,
          time: new Date().toLocaleString(),
        };

        setSummary(summaryData);
        addMessage("bot", "Your summary is ready below. You can export it as PDF.");
      }
    } catch {
      setLoading(false);
      addMessage("bot", "⚠️ Connection issue. Try again later.");
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    addMessage("user", userText);

    if (userText.toLowerCase() === "restart") {
      resetChat();
      return;
    }

    setInput("");
    processUserMessage(userText);
  };

  const resetChat = () => {
    setMessages([
      { sender: "bot", text: "Chat restarted 🔄" },
      { sender: "bot", text: "Tell me one symptom you're experiencing." }
    ]);
    setInput("");
    setSymptoms([]);
    setQuestionIndex(0);
    setSummary(null);
  };

 
 const exportPDF = async () => {
  const element = document.getElementById("summary-card");

  if (!element) {
    alert("Summary not found!");
    return;
  }


  window.scrollTo(0, 0);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Health-Summary.pdf");
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl flex flex-col">

        <div className="bg-blue-600 text-white p-4 rounded-t-2xl font-semibold text-lg flex items-center gap-2">
          🤖 AI Medical Assistant
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ height: "70vh" }}>
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={
                  msg.sender === "bot"
                    ? "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt={msg.sender}
                className="w-9 h-9 rounded-full"
              />

              <div
                className={`max-w-xs p-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-gray-200 p-3 rounded-xl w-20 text-center">
              <div className="flex justify-center space-x-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={chatRef}></div>
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-3 border rounded-xl"
            placeholder="Type your answer…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>

     {summary && (
  <div
    id="summary-card"
    className="max-w-lg w-full mt-6 p-6 rounded-2xl shadow-xl border"
    style={{
      backgroundColor: "#ffffff",   
      color: "#1e293b",          
      borderColor: "#e2e8f0"       
    }}
  >
    <h2
      className="text-xl font-bold mb-3"
      style={{ color: "#2563eb" }}  
    >
      📝 Chat Summary
    </h2>

    <p><b>Symptoms:</b> {summary.symptoms.join(", ")}</p>
    <p><b>Predicted Disease:</b> {summary.prediction}</p>
    <p><b>Time:</b> {summary.time}</p>

    <button
      onClick={exportPDF}
      className="mt-4 w-full p-3 rounded-xl font-semibold"
      style={{
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none"
      }}
    >
      📄 Export as PDF
    </button>
  </div>
)}

    </div>
  );
}
