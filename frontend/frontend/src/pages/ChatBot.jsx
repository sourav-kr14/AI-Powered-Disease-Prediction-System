import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  RefreshCcw,
  FileText,
  Bot,
  User,
  CheckCircle2,
  ChevronLeft,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

export default function ChatBot({ onBack }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your AI Medical Assistant. I'll help you analyze your symptoms today.",
    },
    {
      sender: "bot",
      text: "To start, please describe your primary symptom in one or two words.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [summary, setSummary] = useState(null);

  const chatRef = useRef(null);
  const QUESTIONS = [
    "Are you currently running a fever?",
    "Are you experiencing any nausea or dizziness?",
    "Do you feel unusually fatigued or tired?",
    "Are you noticing any joint or muscle pain?",
    "Have you experienced any vomiting?",
    "Do you have a persistent cough?",
    "Have you noticed any recent unexplained weight loss?",
  ];

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const processUserMessage = (text) => {
    const lowerText = text.toLowerCase();

    if (symptoms.length === 0) {
      setSymptoms([lowerText]);
      addMessage(
        "bot",
        "I've noted that. Now, I'll ask a few quick 'Yes' or 'No' questions to narrow things down.",
      );
      setTimeout(() => askNextQuestion(), 800);
      return;
    }

    if (lowerText.includes("yes") || lowerText === "y") {
      const formattedSymptom = QUESTIONS[questionIndex - 1]
        .replace(
          /Are you |Do you |Have you |any |currently |experienced |noticed |recent |running a |persistent /gi,
          "",
        )
        .replace("?", "")
        .trim();
      setSymptoms((prev) => [...prev, formattedSymptom]);
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
    addMessage("bot", "Analyzing symptoms against our medical database... 🤖");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.join(", ") }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        addMessage("bot", `⚠️ Analysis Error: ${data.error}`);
      } else {
        addMessage(
          "bot",
          `Based on your inputs, the most likely condition is: ${data.prediction.toUpperCase()}`,
        );
        setSummary({
          symptoms: symptoms,
          prediction: data.prediction,
          time: new Date().toLocaleString(),
          id: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
        });
        addMessage("bot", "Your clinical summary is ready below.");
      }
    } catch {
      setLoading(false);
      addMessage(
        "bot",
        "I'm having trouble connecting to the diagnostic server.",
      );
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    if (userText.toLowerCase() === "restart") {
      resetChat();
      return;
    }
    addMessage("user", userText);
    setInput("");
    processUserMessage(userText);
  };

  const resetChat = () => {
    setMessages([
      { sender: "bot", text: "Session reset. How can I help you today?" },
      { sender: "bot", text: "Tell me one symptom you're experiencing." },
    ]);
    setSymptoms([]);
    setQuestionIndex(0);
    setSummary(null);
  };

  const exportPDF = async () => {
    const element = document.getElementById("summary-card");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      (canvas.height * pdfWidth) / canvas.width,
    );
    pdf.save(`Medical-Report-${summary.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-10 px-4">
      <div className="max-w-xl w-full flex justify-between items-center mb-6 px-2">
       <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors mb-8 group text-sm font-medium">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
            Premium AI
          </span>
        </div>
      </div>

      <div className="max-w-xl w-full bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold leading-tight text-lg">
                Medical Assistant
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                  Secure Session
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              title="Restart Chat"
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div
          className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-900/50"
          style={{ height: "55vh" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 p-2 rounded-full ${msg.sender === "user" ? "bg-indigo-600" : "bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"}`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-transparent focus-within:border-indigo-500/30 transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent p-2.5 text-sm outline-none dark:text-white ml-2"
              placeholder="Type 'Yes' or 'No'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card  */}
      <AnimatePresence>
        {summary && (
          <motion.div
            id="summary-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full mt-8 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <FileText className="w-32 h-32 text-slate-900" />
            </div>

            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Clinical Summary
                </h2>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  {summary.id}
                </p>
              </div>
              <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Issued: {summary.time}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Logged Symptoms
                </p>
                <div className="flex flex-wrap gap-2">
                  {summary.symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                    AI Diagnosis
                  </p>
                  <h3 className="text-xl font-black text-indigo-900 capitalize">
                    {summary.prediction}
                  </h3>
                </div>
                <CheckCircle2 className="w-8 h-8 text-indigo-500 opacity-40" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={exportPDF}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <FileText className="w-5 h-5" /> Export PDF
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
