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
    icon: <Stethoscope className="w-6 h-6 text-blue-500" />,
    tag: "High Accuracy",
  },
  {
    to: "/chat",
    title: "Symptom Chatbot",
    description: "NLP-driven assistant for instant health-related queries.",
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    tag: "AI Powered",
  },
  {
    to: "/bmi",
    title: "BMI Calculator",
    description: "Comprehensive body metric analysis and health indexing.",
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
  },
  {
    to: "/diet",
    title: "Diet Planner",
    description: "Nutritional optimization based on biometric data.",
    icon: <Apple className="w-6 h-6 text-rose-500" />,
  },
  {
    to: "/calories",
    title: "Calorie Tracker",
    description: "Metabolic rate calculation for precise daily intake.",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 transition-colors duration-500 selection:bg-indigo-100">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[120px]" />
      </div>

      {/* MAIN CONTENT 
          The 'pt-20' provides extra breathing room below the fixed global header 
      */}
      <main className="max-w-6xl mx-auto px-6 pb-24 relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-20 pt-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" /> SECURE AI DIAGNOSTICS
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] mb-6 tracking-tighter"
          >
            Your health, <br />
            <span className="text-slate-400 dark:text-slate-600">Deciphered by AI.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl"
          >
            A comprehensive suite of medical intelligence tools designed for 
            accuracy, privacy, and clinical-grade insights.
          </motion.p>
        </div>

        {/* TOOLS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.to} variants={itemVariants}>
              <Link
                to={tool.to}
                className="group relative block h-full p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent hover:from-indigo-400 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-[2.45rem] p-8 flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all duration-500">
                        {tool.icon}
                      </div>
                      {tool.tag && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-full text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                          {tool.tag}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all relative z-10">
                    Launch Module
                    <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}