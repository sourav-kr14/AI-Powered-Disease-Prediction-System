import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Stethoscope,
  MessageSquare,
  Activity,
  Apple,
  Flame,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  {
    path: "/",
    title: "Clinical Triage Hub",
    group: "Navigation",
    shortcut: "1",
    icon: LayoutDashboard,
  },
  {
    path: "/predict",
    title: "Symptom Analysis & Differential ML",
    group: "Clinical Diagnostics",
    shortcut: "2",
    icon: Stethoscope,
  },
  {
    path: "/chat",
    title: "Clinical Intake Assistant",
    group: "Clinical Diagnostics",
    shortcut: "3",
    icon: MessageSquare,
  },
  {
    path: "/bmi",
    title: "WHO Anthropometric BMI Engine",
    group: "Biometrics & Nutrition",
    shortcut: "4",
    icon: Activity,
  },
  {
    path: "/calories",
    title: "Metabolic Expenditure & Macro Split",
    group: "Biometrics & Nutrition",
    shortcut: "5",
    icon: Flame,
  },
  {
    path: "/diet",
    title: "Chronobiological Dietary Protocol",
    group: "Biometrics & Nutrition",
    shortcut: "6",
    icon: Apple,
  },
];

const popularSymptoms = [
  "high_fever",
  "chest_pain",
  "cough",
  "fatigue",
  "shortness_of_breath",
  "vomiting",
  "headache",
  "joint_pain",
  "skin_rash",
  "dizziness",
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNav = navigationItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredSymptoms = popularSymptoms.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase().replace(" ", "_")),
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  const handleSymptomJump = (symptom) => {
    navigate("/predict", { state: { initialSymptom: symptom } });
    onClose();
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-[var(--border-base)] bg-[var(--surface-base)] shadow-[var(--shadow-overlay)] animate-in fade-in zoom-in-95 duration-100">
        {/* Search Header */}
        <div className="flex items-center border-b border-[var(--border-subtle)] px-3.5 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <input
            type="text"
            autoFocus
            placeholder="Type a clinical tool or symptom name (e.g. chest_pain, BMI)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="ml-3 flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-[var(--border-base)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Navigation Items */}
          {filteredNav.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Workstation Modules
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                        selectedIndex === idx
                          ? "bg-[var(--brand-soft)] text-[var(--brand-text)] font-medium"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {item.group}
                        </span>
                        <kbd className="rounded border border-[var(--border-base)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
                          {item.shortcut}
                        </kbd>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Symptom Queries */}
          {filteredSymptoms.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Clinical Symptom Identifiers
              </p>
              <div className="flex flex-wrap gap-1.5 px-2 py-1">
                {filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomJump(symptom)}
                    className="inline-flex items-center gap-1.5 rounded border border-[var(--border-base)] bg-[var(--surface-elevated)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-text)] transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-[var(--brand-text)]" />
                    <span className="font-mono">{symptom.replace("_", " ")}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-[var(--text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredSymptoms.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No matching clinical tools or symptoms located.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-[11px] text-[var(--text-muted)]">
          <span>Navigate with ↵ or click</span>
          <span className="font-mono">SymptoScan Command v3.0</span>
        </div>
      </div>
    </div>
  );
}
