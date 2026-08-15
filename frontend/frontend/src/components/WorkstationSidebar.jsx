import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  Activity,
  Flame,
  Apple,
  ShieldAlert,
  Server,
  Layers,
  X,
  ExternalLink,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Clinical Diagnostics",
    items: [
      {
        path: "/",
        label: "Clinical Triage Hub",
        shortcut: "1",
        icon: LayoutDashboard,
      },
      {
        path: "/predict",
        label: "Symptom Analysis Matrix",
        shortcut: "2",
        icon: Stethoscope,
      },
      {
        path: "/chat",
        label: "Clinical Intake Assistant",
        shortcut: "3",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Anthropometrics & Nutrition",
    items: [
      {
        path: "/bmi",
        label: "WHO BMI Stratification",
        shortcut: "4",
        icon: Activity,
      },
      {
        path: "/calories",
        label: "Metabolic Expenditure (TDEE)",
        shortcut: "5",
        icon: Flame,
      },
      {
        path: "/diet",
        label: "Chrono-Dietary Protocol",
        shortcut: "6",
        icon: Apple,
      },
    ],
  },
];

export default function WorkstationSidebar({ onClose }) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col justify-between bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] text-xs select-none">
      {/* Top Header / Navigation Sections */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Mobile close button row */}
        {onClose && (
          <div className="flex items-center justify-between p-3 border-b border-[var(--border-subtle)] lg:hidden">
            <span className="font-semibold text-[var(--text-primary)]">
              Workstation Navigation
            </span>
            <button
              onClick={onClose}
              className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="p-2 space-y-4">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {group.title}
              </span>
              <ul className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 font-medium transition-colors duration-100 ${
                          isActive
                            ? "bg-[var(--brand-soft)] text-[var(--brand-text)] border border-[var(--brand-primary)]/20"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isActive
                                ? "text-[var(--brand-primary)]"
                                : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <kbd
                          className={`font-mono text-[9px] px-1 py-0.2 rounded border ${
                            isActive
                              ? "border-[var(--brand-primary)]/30 text-[var(--brand-text)]"
                              : "border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--surface-elevated)]"
                          }`}
                        >
                          {item.shortcut}
                        </kbd>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status & Diagnostic Info */}
      <div className="border-t border-[var(--border-base)] p-3 space-y-2.5 bg-[var(--surface-inset)]">
        {/* Model Spec Badge */}
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-[var(--brand-text)]" />
            <span>ML Ensemble v2.4</span>
          </div>
          <span className="text-[var(--status-success)]">131 Features</span>
        </div>

        {/* Clinical Disclaimer Accordion / Link */}
        <div className="rounded border border-[var(--status-warning-border)] bg-[var(--status-warning-soft)] p-2 text-[10px] text-[var(--status-warning)] leading-normal">
          <p className="font-semibold flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Clinical Decision Support
          </p>
          <p className="text-[var(--text-secondary)] mt-0.5">
            Informational triage tool. Outputs do not constitute clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
