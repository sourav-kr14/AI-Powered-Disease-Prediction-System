import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X, Moon, Sun } from "lucide-react";

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
    // Z-50 ensures it stays above all page content
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "py-2" : "py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <nav className={`relative flex items-center justify-between px-6 py-2.5 rounded-2xl border transition-all duration-500 ${
          isScrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-indigo-500/5" 
            : "bg-transparent border-transparent"
        }`}>
          
          {/* LOGO - Now acts as the primary branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
              Sympto<span className="text-indigo-600">Scan</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${
                  location.pathname === link.path 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-500 hover:text-indigo-600 dark:text-slate-400"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90">
                <Sun className="w-4 h-4 hidden dark:block" />
                <Moon className="w-4 h-4 block dark:hidden" />
             </button>
             
             {/* Mobile Toggle */}
             <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full p-4 md:hidden"
          >
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-bold tracking-wide ${
                    location.pathname === link.path 
                      ? "text-indigo-600" 
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}