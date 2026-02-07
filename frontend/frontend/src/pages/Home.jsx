import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  MessageSquare,
  Activity,
  Apple,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    to: "/predict",
    title: "Predict Disease",
    description: "Multi-parameter ML analysis for early symptom detection.",
    icon: <Stethoscope className="w-6 h-6 text-indigo-400" />,
    tag: "High Accuracy",
    glow: "group-hover:shadow-indigo-500/20",
  },
  {
    to: "/chat",
    title: "Symptom Chatbot",
    description: "NLP-driven assistant for instant health-related queries.",
    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
    tag: "AI Powered",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    to: "/bmi",
    title: "BMI Calculator",
    description: "Comprehensive body metric analysis and health indexing.",
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    to: "/diet",
    title: "Diet Planner",
    description: "Nutritional optimization based on biometric data.",
    icon: <Apple className="w-6 h-6 text-rose-400" />,
    glow: "group-hover:shadow-rose-500/20",
  },
  {
    to: "/calories",
    title: "Calorie Tracker",
    description: "Metabolic rate calculation for precise daily intake.",
    icon: <Flame className="w-6 h-6 text-orange-400" />,
    glow: "group-hover:shadow-orange-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#02040a] text-zinc-300 selection:bg-indigo-500/30 font-sans relative overflow-hidden">
      
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
  
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-32 relative z-10 pt-28">
        
        {/* HERO SECTION */}
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] tracking-[0.2em] mb-8"
          >
            <Sparkles className="w-3 h-3" /> SECURE AI DIAGNOSTICS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter"
          >
            Your health, <br />
            <span className="text-zinc-700">Deciphered by AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-2xl font-medium"
          >
            A comprehensive suite of medical intelligence tools designed for
            unrivaled accuracy, privacy, and clinical-grade insights.
          </motion.p>
        </div>

        {/* TOOLS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.to}
              variants={itemVariants}
              className="group"
            >
              <Link
                to={tool.to}
                className={`relative block h-full bg-zinc-900/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-white/10 hover:bg-zinc-900/40 ${tool.glow} hover:shadow-2xl`}
              >
                {/* Subtle Inner Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-12">
                      <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl group-hover:scale-110 group-hover:bg-zinc-900 transition-all duration-500">
                        {tool.icon}
                      </div>
                      {tool.tag && (
                        <span className="px-3 py-1 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest rounded-full text-zinc-500 border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                          {tool.tag}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors tracking-tight">
                      {tool.title}
                    </h2>

                    <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-indigo-400 transition-all">
                    Launch Module
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* FOOTER-STYLE DECORATION */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-zinc-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap">
          SymptoScan Neural Network
        </span>
        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-zinc-500" />
      </div>
    </div>
  );
}