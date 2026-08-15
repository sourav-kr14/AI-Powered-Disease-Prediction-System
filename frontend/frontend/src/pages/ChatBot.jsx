import React, { useEffect, useRef, useState } from "react";
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
  ShieldAlert,
  Loader2,
  MessageSquareHeart,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

const QUESTIONS = [
  "Are you currently running a fever?",
  "Are you experiencing any nausea or dizziness?",
  "Do you feel unusually fatigued or tired?",
  "Are you noticing any joint or muscle pain?",
  "Have you experienced any vomiting?",
  "Do you have a persistent cough?",
  "Have you noticed any recent unexplained weight loss?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello. I’m your AI medical assistant. I can help you organize symptoms and generate a guided health summary.",
    },
    {
      sender: "bot",
      text: "To begin, type your main symptom in one or two words.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [summary, setSummary] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const extractSymptomFromQuestion = (question) => {
    return question
      .replace(
        /Are you |Do you |Have you |any |currently |experienced |noticed |recent |running a |persistent /gi,
        "",
      )
      .replace("?", "")
      .trim()
      .toLowerCase();
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
    setLoading(true);
    addMessage(
      "bot",
      "Analyzing your responses and checking likely matches against the medical model...",
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!res.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await res.json();
      const payload = data?.data || data;

      if (data?.error || !payload?.prediction) {
        addMessage(
          "bot",
          `I couldn't complete the analysis right now${data?.error ? `: ${data.error}` : "."}`,
        );
        return;
      }

      addMessage(
        "bot",
        `The most likely match from the current symptom pattern is ${payload.prediction}. Please interpret this cautiously.`,
      );

      addMessage(
        "bot",
        "Your clinical summary is ready below. This is informational only and should not replace a doctor's evaluation.",
      );

      setSummary({
        symptoms,
        prediction: payload.prediction,
        top3: payload.top3 || [],
        precautions: payload.precautions || {},
        time: new Date().toLocaleString(),
        id: `REF-${Math.floor(Math.random() * 90000) + 10000}`,
      });
    } catch {
      addMessage(
        "bot",
        "I’m having trouble connecting to the diagnostic server right now. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const processUserMessage = (text) => {
    const lowerText = text.trim().toLowerCase();

    if (!symptoms.length) {
      setSymptoms([lowerText]);
      addMessage(
        "bot",
        "Noted. I’ll ask a few quick yes-or-no questions to refine the result.",
      );
      setTimeout(() => askNextQuestion(), 700);
      return;
    }

    if (lowerText === "yes" || lowerText === "y") {
      const previousQuestion = QUESTIONS[questionIndex - 1];
      if (previousQuestion) {
        const derivedSymptom = extractSymptomFromQuestion(previousQuestion);
        setSymptoms((prev) => [...prev, derivedSymptom]);
      }
    }

    if (questionIndex < QUESTIONS.length) {
      setTimeout(() => askNextQuestion(), 500);
    } else {
      finalizeDiagnosis();
    }
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;

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
      {
        sender: "bot",
        text: "Session reset. Tell me your main symptom and we’ll begin again.",
      },
    ]);
    setInput("");
    setLoading(false);
    setSymptoms([]);
    setQuestionIndex(0);
    setSummary(null);
  };

  const exportPDF = async () => {
    const element = document.getElementById("summary-card");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save(`Medical-Report-${summary.id}.pdf`);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111a] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            AI Symptom Chat
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl"
          >
            <div className="border-b border-white/10 bg-[#0b1824] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-cyan-200">
                    <Bot className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                      Medical Assistant
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
                      Guided symptom conversation
                    </h1>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      Answer a short sequence of prompts to generate a
                      structured AI health summary.
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetChat}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  title="Restart chat"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="space-y-5 overflow-y-auto p-6"
              style={{ height: "58vh" }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={`${msg.sender}-${index}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`shrink-0 rounded-full p-2.5 ${
                        msg.sender === "user"
                          ? "bg-cyan-300 text-slate-950"
                          : "border border-white/10 bg-white/5 text-cyan-200"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-4 text-sm leading-7 shadow-sm ${
                        msg.sender === "user"
                          ? "rounded-tr-none bg-cyan-300 text-slate-950"
                          : "rounded-tl-none border border-white/10 bg-[#0b1824] text-slate-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0b1824] px-4 py-4 text-sm text-slate-300"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                  Processing your clinical summary...
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-[#0b1824] p-2">
                <input
                  type="text"
                  className="ml-2 flex-1 bg-transparent p-2.5 text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder={
                    symptoms.length === 0
                      ? "Type your main symptom..."
                      : "Reply with yes, no, or restart"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                />

                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-cyan-300 p-3 text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                How It Works
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  1. Enter your primary symptom
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  2. Answer a few short yes-or-no prompts
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1824] p-4 text-sm text-slate-300">
                  3. Review the generated AI summary
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-300/20 bg-amber-400/10 p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-200" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">
                    Safety note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-amber-50/85">
                    This assistant is for informational use only. If symptoms
                    are severe or urgent, seek immediate medical care instead of
                    relying on chat guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-2xl">
              <div className="flex items-start gap-3">
                <MessageSquareHeart className="mt-0.5 h-5 w-5 text-cyan-200" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                    Best results
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Keep answers short and accurate. Start with a clear symptom
                    like fever, cough, headache, vomiting, or fatigue.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        <AnimatePresence>
          {summary && (
            <motion.div
              id="summary-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
            >
              <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                    Clinical Summary
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white">
                    Session report
                  </h2>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {summary.id}
                  </p>
                </div>

                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Issued: {summary.time}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Logged symptoms
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {summary.symptoms.map((symptom, index) => (
                      <span
                        key={`${symptom}-${index}`}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium capitalize text-slate-200"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-900/70">
                        Most likely match
                      </p>
                      <h3 className="mt-2 text-2xl font-black capitalize text-slate-950">
                        {summary.prediction}
                      </h3>
                    </div>

                    <CheckCircle2 className="h-7 w-7 text-slate-950/40" />
                  </div>
                </div>
              </div>

              {summary.top3 && summary.top3.length > 0 && (
                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#0b1824] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Ranked matches
                  </p>

                  <div className="mt-4 space-y-3">
                    {summary.top3.map((item, index) => (
                      <div
                        key={`${item.disease}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-bold text-white">
                            {item.disease}
                          </span>
                          <span className="text-sm font-semibold text-slate-300">
                            {(Number(item.confidence || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={exportPDF}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>

                <Link
                  to="/"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
