import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import {
  Send,
  RotateCcw,
  Download,
  Bot,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const QUESTIONS = [
  "Do you have a fever or high temperature?",
  "Are you experiencing any nausea, dizziness, or stomach upset?",
  "Do you feel unusually tired or fatigued?",
  "Are you having any joint, muscle, or body aches?",
  "Have you experienced any vomiting?",
  "Do you have a cough or sore throat?",
  "Have you noticed any unexplained weight loss recently?",
];

export default function ChatBot() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! I'm your AI health assistant. I can guide you through a few quick questions to help identify possible health conditions.",
    },
    {
      sender: "bot",
      text: "To start, what is the main symptom you are feeling today? (e.g. fever, headache, stomach pain)",
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
      .replace(/Do you have |Are you experiencing |Do you feel |Are you having |Have you experienced |Have you noticed |any |a |recently\?/gi, "")
      .replace("?", "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
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
    addMessage("bot", "Analyzing your answers to find the best match...");

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
        method: "POST",
        headers,
        body: JSON.stringify({ symptoms }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      const payload = data?.data || data;

      if (data?.error || !payload?.prediction) {
        addMessage("bot", "I wasn't able to complete the check. Please try starting over with clear symptoms.");
        return;
      }

      addMessage(
        "bot",
        `Based on your answers, the most likely condition is ${payload.prediction}. I've prepared a health summary for you below.`,
      );

      setSummary({
        symptoms,
        prediction: payload.prediction,
        top3: payload.top3 || [],
        precautions: payload.precautions || {},
        time: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
        id: `REPORT-${Math.floor(Math.random() * 90000) + 10000}`,
      });
    } catch {
      addMessage("bot", "I'm having trouble reaching the prediction server. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const processUserMessage = (text) => {
    const lower = text.trim().toLowerCase();

    if (!symptoms.length) {
      const clean = lower.replace(/\s+/g, "_");
      setSymptoms([clean]);
      addMessage("bot", "Got it. Let me ask a few quick follow-up questions.");
      setTimeout(() => askNextQuestion(), 500);
      return;
    }

    if (lower === "yes" || lower === "y") {
      const previousQuestion = QUESTIONS[questionIndex - 1];
      if (previousQuestion) {
        const derived = extractSymptomFromQuestion(previousQuestion);
        setSymptoms((prev) => [...prev, derived]);
      }
    }

    if (questionIndex < QUESTIONS.length) {
      setTimeout(() => askNextQuestion(), 400);
    } else {
      finalizeDiagnosis();
    }
  };

  const handleSend = (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim() || loading) return;

    if (msg.trim().toLowerCase() === "restart") {
      resetChat();
      return;
    }

    addMessage("user", msg.trim());
    setInput("");
    processUserMessage(msg.trim());
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Conversation reset! What is your main symptom today?",
      },
    ]);
    setInput("");
    setLoading(false);
    setSymptoms([]);
    setQuestionIndex(0);
    setSummary(null);
  };

  const exportPDF = async () => {
    const element = document.getElementById("chat-summary-report");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save(`Health-Summary-${summary.id}.pdf`);
  };

  const isQuestionActive =
    symptoms.length > 0 && questionIndex > 0 && questionIndex <= QUESTIONS.length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        badge="Interactive AI"
        title="Health Assistant"
        description="Chat with our guided assistant to narrow down your symptoms and generate a shareable health report."
      />

      {/* Chat Window */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Chat Top bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Health Guide
              </h3>
              <p className="text-xs text-[var(--text-sub)]">
                Online & Ready to Help
              </p>
            </div>
          </div>

          <button
            onClick={resetChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Restart</span>
          </button>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isUser
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] border border-[var(--border-color)]"
                  }`}
                >
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[var(--primary)] text-white rounded-tr-none font-medium"
                      : "bg-[var(--bg-surface-subtle)] text-[var(--text-main)] rounded-tl-none border border-[var(--border-color)]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] px-4 py-3 text-xs text-[var(--text-sub)] w-fit">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
              <span>Analyzing your answers...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Yes/No Options */}
        {isQuestionActive && !loading && (
          <div className="flex items-center gap-2 border-t border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-6 py-2">
            <span className="text-xs text-[var(--text-sub)]">Quick reply:</span>
            <button
              type="button"
              onClick={() => handleSend("Yes")}
              className="rounded-lg border border-[var(--primary)] bg-[var(--primary-light)] px-4 py-1 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSend("No")}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-1 text-xs font-semibold text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              No
            </button>
          </div>
        )}

        {/* Text Input */}
        <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-surface)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={
                symptoms.length === 0
                  ? "Describe your main symptom (e.g. fever, headache)..."
                  : "Type your answer or click Yes / No above..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-[var(--bg-surface)] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Generated Report */}
      {summary && (
        <div
          id="chat-summary-report"
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-color)] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Health Summary Report ({summary.id})
              </span>
              <h3 className="text-xl font-bold text-[var(--text-main)] mt-0.5">
                Symptom Conversation Results
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)]">
                {summary.time}
              </span>
              <button
                type="button"
                onClick={exportPDF}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Report (PDF)</span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-4 space-y-2">
              <span className="text-xs font-bold text-[var(--text-sub)] uppercase">
                Reported Symptoms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {summary.symptoms.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 text-xs font-medium capitalize text-[var(--text-main)]"
                  >
                    {s.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-4 space-y-1">
              <span className="text-xs font-bold text-[var(--text-sub)] uppercase">
                Most Likely Match
              </span>
              <div className="flex items-center gap-2 pt-1">
                <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                <span className="text-lg font-bold text-[var(--text-main)] capitalize">
                  {summary.prediction}
                </span>
              </div>
            </div>
          </div>

          {summary.top3 && summary.top3.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-sub)] uppercase">
                Top Probable Conditions
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {summary.top3.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-3 text-xs"
                  >
                    <span className="font-semibold text-[var(--text-main)] capitalize">
                      {item.disease}
                    </span>
                    <span className="font-bold text-[var(--primary)]">
                      {Math.round(Number(item.confidence || 0) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
