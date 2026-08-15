import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import NearbyHospitals from "../components/NearbyHospitals";
import {
  HeartPulse,
  Activity,
  Flame,
  Apple,
  MessageSquare,
  Stethoscope,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  Minus,
  Edit3,
  X,
  Save,
  Shield,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";

export default function Dashboard() {
  const { user, updateProfile, updateVitals, getHistory, deleteHistoryItem } =
    useAuth();

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPrecautions, setSelectedPrecautions] = useState(null);

  // Editable profile state for modal
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [ageInput, setAgeInput] = useState(user?.profile?.age || 25);
  const [genderInput, setGenderInput] = useState(user?.profile?.gender || "male");
  const [weightInput, setWeightInput] = useState(user?.profile?.weight || 70);
  const [heightInput, setHeightInput] = useState(user?.profile?.height || 175);
  const [activityInput, setActivityInput] = useState(
    user?.profile?.activityLevel || "moderate",
  );
  const [goalInput, setGoalInput] = useState(user?.profile?.goal || "maintain");
  const [bloodGroupInput, setBloodGroupInput] = useState(
    user?.profile?.bloodGroup || "O+",
  );
  const [allergiesInput, setAllergiesInput] = useState(
    (user?.profile?.allergies || []).join(", "),
  );
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync edit state when user changes
  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setAgeInput(user.profile?.age || 25);
      setGenderInput(user.profile?.gender || "male");
      setWeightInput(user.profile?.weight || 70);
      setHeightInput(user.profile?.height || 175);
      setActivityInput(user.profile?.activityLevel || "moderate");
      setGoalInput(user.profile?.goal || "maintain");
      setBloodGroupInput(user.profile?.bloodGroup || "O+");
      setAllergiesInput((user.profile?.allergies || []).join(", "));
    }
  }, [user]);

  // Load prediction history on mount
  const loadHistory = async () => {
    setHistoryLoading(true);
    const data = await getHistory();
    setHistory(data || []);
    setHistoryLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Compute Live Biometrics
  const weight = Number(user?.profile?.weight) || 70;
  const height = Number(user?.profile?.height) || 175;
  const age = Number(user?.profile?.age) || 25;
  const gender = user?.profile?.gender || "male";
  const activity = user?.profile?.activityLevel || "moderate";
  const goal = user?.profile?.goal || "maintain";

  const heightM = height / 100;
  const bmiScore = (weight / (heightM * heightM)).toFixed(1);

  let bmiCategory = "Healthy weight";
  let bmiBadgeColor = "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
  if (bmiScore < 18.5) {
    bmiCategory = "Underweight";
    bmiBadgeColor = "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  } else if (bmiScore >= 25 && bmiScore < 30) {
    bmiCategory = "Overweight";
    bmiBadgeColor = "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  } else if (bmiScore >= 30) {
    bmiCategory = "Obese";
    bmiBadgeColor = "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
  }

  // TDEE calculation
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    intense: 1.9,
  };
  const tdee = Math.round(bmr * (activityMultipliers[activity] || 1.55));
  let targetCalories = tdee;
  if (goal === "loss") targetCalories = Math.round(tdee - 450);
  if (goal === "gain") targetCalories = Math.round(tdee + 350);

  // Water intake vitals
  const waterGlasses = user?.vitals?.waterIntakeGlasses ?? 4;
  const waterGoal = user?.vitals?.waterGoalGlasses ?? 8;

  const handleWaterChange = (delta) => {
    const nextVal = Math.max(0, Math.min(20, waterGlasses + delta));
    updateVitals({
      ...(user?.vitals || {}),
      waterIntakeGlasses: nextVal,
    });
  };

  // Checklist habit toggle
  const checklist = user?.vitals?.checklist || {
    vitamins: false,
    workout: false,
    hydration: false,
    sleep: false,
  };

  const handleChecklistToggle = (key) => {
    const updated = {
      ...checklist,
      [key]: !checklist[key],
    };
    updateVitals({
      ...(user?.vitals || {}),
      checklist: updated,
    });
  };

  // Save profile modal
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    const parsedAllergies = allergiesInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    await updateProfile({
      name: nameInput.trim(),
      profile: {
        age: Number(ageInput),
        gender: genderInput,
        weight: Number(weightInput),
        height: Number(heightInput),
        activityLevel: activityInput,
        goal: goalInput,
        bloodGroup: bloodGroupInput,
        allergies: parsedAllergies,
      },
    });

    setSavingProfile(false);
    setShowProfileModal(false);
  };

  // Delete prediction history item
  const handleDeleteHistory = async (id) => {
    const success = await deleteHistoryItem(id);
    if (success) {
      setHistory((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* ── 1. Top Welcome Banner ── */}
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-48 w-48 rounded-full bg-[var(--primary-light)] blur-3xl pointer-events-none opacity-60" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span>Personal Clinical Profile Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-main)]">
              Welcome back, {user?.name || "Member"}
            </h1>

            <p className="text-sm text-[var(--text-sub)] max-w-lg">
              Here is your synchronized health overview, diagnostic triage logs, and daily biometric targets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-all shadow-xs cursor-pointer"
            >
              <Edit3 className="h-4 w-4 text-[var(--text-muted)]" />
              <span>Edit Biometrics</span>
            </button>

            <Link
              to="/predict"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white hover:bg-[var(--primary-hover)] transition-all shadow-sm cursor-pointer"
            >
              <Stethoscope className="h-4 w-4" />
              <span>New Symptom Scan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Biometric & Metabolic Vitals Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* BMI Card */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              BMI Score
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-main)]">
                {bmiScore}
              </span>
              <span className="text-xs text-[var(--text-muted)]">kg/m²</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${bmiBadgeColor}`}>
                {bmiCategory}
              </span>
              <Link to="/bmi" className="text-[11px] font-semibold text-[var(--primary)] hover:underline">
                Recalculate →
              </Link>
            </div>
          </div>
        </div>

        {/* Daily Calorie Intake Goal */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Target Energy
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Flame className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--text-main)]">
                {targetCalories}
              </span>
              <span className="text-xs text-[var(--text-muted)]">kcal/day</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-sub)]">
              <span className="capitalize">{goal === "loss" ? "Weight Loss" : goal === "gain" ? "Muscle Gain" : "Maintenance"}</span>
              <Link to="/calories" className="font-semibold text-[var(--primary)] hover:underline">
                Plan Meals →
              </Link>
            </div>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Hydration (250ml)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Droplet className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[var(--text-main)]">
                  {waterGlasses}
                </span>
                <span className="text-xs text-[var(--text-muted)]">/ {waterGoal} glasses</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleWaterChange(-1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                  title="Minus 1 glass"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleWaterChange(1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer shadow-xs"
                  title="Add 1 glass"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Biometrics Summary */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Vital Metrics
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
              <Shield className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="rounded-lg bg-[var(--bg-surface-subtle)] p-2">
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Weight / Height</span>
              <span className="font-bold text-[var(--text-main)]">{weight} kg / {height} cm</span>
            </div>
            <div className="rounded-lg bg-[var(--bg-surface-subtle)] p-2">
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Blood Type</span>
              <span className="font-bold text-[var(--text-main)]">{user?.profile?.bloodGroup || "O+"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Diagnostic & Wellness Quick Launcher ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Clinical & Wellness Applications
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Launch dedicated assessment and calculation modules
            </p>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/predict"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                  Primary Tool
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  Symptom Checker
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  Analyze 130+ clinical symptoms with machine learning triage.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>Start Analysis</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            to="/chat"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-sub)]">
                  Interactive
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  AI Health Assistant
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  Interactive guided interview with downloadable PDF clinical report.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>Open Assistant</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            to="/bmi"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-sub)]">
                  Biometrics
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  WHO BMI Stratification
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  Determine optimal healthy weight boundaries for your height.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>Calculate BMI</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            to="/calories"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-sub)]">
                  Metabolic
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  Calorie & Macro Tracker
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  Calculate BMR, TDEE, and protein/carb/fat targets.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>View Macros</span>
              <span>→</span>
            </div>
          </Link>

          <Link
            to="/diet"
            className="group flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs hover:border-[var(--primary)] hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Apple className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[var(--bg-surface-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--text-sub)]">
                  Nutrition
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  Chrono-Diet Protocol
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  Structured 4-phase daily meal schedule tailored to your fitness goals.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>View Meal Plan</span>
              <span>→</span>
            </div>
          </Link>

          {/* Emergency Quick Hub */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] p-5 shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-red-500/10 text-red-600 px-2.5 py-0.5 text-[10px] font-bold">
                  Urgent Care
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Emergency Medical Hub
                </h3>
                <p className="text-xs text-[var(--text-sub)] mt-0.5 leading-relaxed">
                  National emergency helpline 112 / 911 / 102. Find nearest trauma clinics.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Hotlines: 112 & 102</span>
              <span>⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Daily Habits & Wellness Checklist ── */}
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)]">
              Daily Wellness Protocol
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Check off your daily health commitments to maintain clinical baseline
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => handleChecklistToggle("hydration")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
              checklist.hydration
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] hover:border-[var(--primary)]"
            }`}
          >
            <CheckCircle2
              className={`h-5 w-5 shrink-0 ${
                checklist.hydration ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
            />
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">2.0L Hydration</p>
              <p className="text-[11px] text-[var(--text-sub)]">8 full glasses of water</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChecklistToggle("vitamins")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
              checklist.vitamins
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] hover:border-[var(--primary)]"
            }`}
          >
            <CheckCircle2
              className={`h-5 w-5 shrink-0 ${
                checklist.vitamins ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
            />
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Vitamins & Meds</p>
              <p className="text-[11px] text-[var(--text-sub)]">Daily supplements intake</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChecklistToggle("workout")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
              checklist.workout
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] hover:border-[var(--primary)]"
            }`}
          >
            <CheckCircle2
              className={`h-5 w-5 shrink-0 ${
                checklist.workout ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
            />
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">30m Physical Activity</p>
              <p className="text-[11px] text-[var(--text-sub)]">Brisk walk or exercise</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChecklistToggle("sleep")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
              checklist.sleep
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-[var(--text-sub)] hover:border-[var(--primary)]"
            }`}
          >
            <CheckCircle2
              className={`h-5 w-5 shrink-0 ${
                checklist.sleep ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
            />
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">7–8h Restful Sleep</p>
              <p className="text-[11px] text-[var(--text-sub)]">Quality recovery window</p>
            </div>
          </button>
        </div>
      </section>

      {/* ── 5. Diagnostic Prediction History ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Recent Health & Diagnostic History
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Historical symptom analysis logs linked to your clinical account
            </p>
          </div>

          <button
            onClick={loadHistory}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {historyLoading ? (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-muted)]">
            Loading diagnostic records...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] p-10 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] mx-auto">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                No past symptom checks recorded yet
              </h3>
              <p className="text-xs text-[var(--text-sub)] max-w-sm mx-auto mt-1">
                Your symptom checks and diagnostic predictions will automatically sync here for future reference.
              </p>
            </div>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-hover)] transition-all"
            >
              <span>Run First Symptom Check</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => {
              const topConfidence = record.top3Predictions?.[0]?.confidence
                ? Math.round(record.top3Predictions[0].confidence * 100)
                : null;

              return (
                <div
                  key={record._id}
                  className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-4 hover:border-[var(--primary)]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(record.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 text-xs font-bold capitalize">
                        {record.predictedDisease}
                      </span>
                      {topConfidence && (
                        <span className="text-xs font-mono font-bold text-[var(--text-sub)]">
                          {topConfidence}% Match
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteHistory(record._id)}
                        className="p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Symptoms list */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Evaluated Symptoms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {record.symptoms?.map((sym, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-2 py-0.5 text-xs text-[var(--text-main)] capitalize"
                        >
                          {sym.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top 3 Probabilities if present */}
                  {record.top3Predictions && record.top3Predictions.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-3 pt-1">
                      {record.top3Predictions.map((t, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] px-3 py-2 text-xs flex justify-between items-center"
                        >
                          <span className="font-semibold text-[var(--text-main)] capitalize truncate">
                            {t.disease}
                          </span>
                          <span className="font-bold text-[var(--primary)] shrink-0 ml-2">
                            {Math.round(Number(t.confidence || 0) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 6. Nearby Clinics & Emergency Care ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Nearby Hospitals & Clinical Centers
            </h2>
            <p className="text-xs text-[var(--text-sub)]">
              Real-time proximity geolocation to healthcare facilities
            </p>
          </div>
        </div>

        <NearbyHospitals />
      </section>

      {/* ── 7. Profile & Biometrics Edit Modal ── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  Update Health Biometrics
                </h3>
                <p className="text-xs text-[var(--text-sub)]">
                  Adjust metrics to recalculate BMI, TDEE, and nutrition targets
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-main)]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Gender
                  </label>
                  <select
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="350"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
              </div>

              {/* Activity Level & Fitness Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Activity Level
                  </label>
                  <select
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Very Active</option>
                    <option value="intense">Intense Training</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Fitness Target
                  </label>
                  <select
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  >
                    <option value="maintain">Maintain Weight</option>
                    <option value="loss">Healthy Fat Loss</option>
                    <option value="gain">Build Muscle</option>
                  </select>
                </div>
              </div>

              {/* Blood Group & Allergies */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. O+, A+, B-"
                    value={bloodGroupInput}
                    onChange={(e) => setBloodGroupInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-main)]">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peanuts, Penicillin"
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-main)] focus:border-[var(--primary)] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] py-2.5 text-xs font-bold text-[var(--text-sub)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-2.5 text-xs font-bold text-white hover:bg-[var(--primary-hover)] cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
