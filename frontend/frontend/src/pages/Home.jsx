import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Stethoscope, MessageSquare, Activity, 
  Apple, Flame, ArrowRight, ShieldCheck, Sparkles 
} from "lucide-react";

const tools = [
  {
    to: "/predict",
    title: "Predict Disease",
    description: "Multi-parameter ML analysis for early symptom detection.",
    icon: <Stethoscope className="w-6 h-6 text-blue-500" />,
    accent: "blue",
    tag: "High Accuracy"
  },
  {
    to: "/chat",
    title: "Symptom Chatbot",
    description: "NLP-driven assistant for instant health-related queries.",
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    accent: "purple",
    tag: "AI Powered"
  },
  {
    to: "/bmi",
    title: "BMI Calculator",
    description: "Comprehensive body metric analysis and health indexing.",
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    accent: "emerald"
  },
  {
    to: "/diet",
    title: "Diet Planner",
    description: "Nutritional optimization based on biometric data.",
    icon: <Apple className="w-6 h-6 text-rose-500" />,
    accent: "rose"
  },
  {
    to: "/calories",
    title: "Calorie Tracker",
    description: "Metabolic rate calculation for precise daily intake.",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    accent: "orange"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[120px]" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight italic">
          <div className="p-2 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="dark:text-white">Health<span className="text-blue-600">Sync</span></span>
        </div>
        <button className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-white transition-all dark:text-slate-300">
          Sign In
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <header className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" /> SECURE AI DIAGNOSTICS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Your health, <br />
            <span className="text-slate-400 dark:text-slate-500">Deciphered by AI.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            A comprehensive suite of medical intelligence tools designed for accuracy, 
            privacy, and speed.
          </motion.p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {tools.map((tool) => (
            <motion.div key={tool.to} variants={itemVariants}>
              <Link
                to={tool.to}
                className="group relative block h-full p-1 rounded-[2rem] bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent hover:from-blue-400 transition-all duration-500"
              >
                <div className="h-full bg-white dark:bg-slate-900 rounded-[1.9rem] p-8 flex flex-col justify-between overflow-hidden relative">
                  {/* Hover Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-500">
                        {tool.icon}
                      </div>
                      {tool.tag && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-full dark:text-slate-400">
                          {tool.tag}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed relative z-10">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 transition-all">
                    Launch Module <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
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