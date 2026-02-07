import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Predict", path: "/predict" },
  { name: "BMI", path: "/bmi" },
  { name: "Diet", path: "/diet" },
  { name: "Calories", path: "/calories" },
  { name: "AI Chat", path: "/chat" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500  ${
      isScrolled ? "py-3" : "py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <nav className={`relative flex items-center justify-between px-8 py-3 rounded-[2rem] border transition-all duration-700 ${
          isScrolled 
            ? "bg-[#0a0a0a]/60 backdrop-blur-2xl border-white/10 shadow-2xl shadow-indigo-500/10" 
            : "bg-transparent border-transparent"
        }`}>
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-all duration-500">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-indigo-500 blur-xl -z-10 rounded-full"
              />
            </div>
            <span className="text-xl font-black text-white tracking-tighter italic">
              SYMPTO<span className="text-indigo-500">SCAN</span>
            </span>
          </Link>

          {/* DESKTOP NAV*/}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                  location.pathname === link.path 
                    ? "text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">v2.0 PRO</span>
             </div>
             
             {/* Mobile Toggle */}
             <button 
              className="md:hidden p-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
             </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU*/}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 w-full p-6 md:hidden"
          >
            <div className="bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-xs font-black uppercase tracking-[0.2em] block py-2 ${
                      location.pathname === link.path 
                        ? "text-indigo-400" 
                        : "text-zinc-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}