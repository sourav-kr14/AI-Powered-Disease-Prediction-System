import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X, Sparkles, ArrowRight } from "lucide-react";

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
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.nav
          initial={false}
          animate={{
            paddingTop: isScrolled ? 12 : 18,
            paddingBottom: isScrolled ? 12 : 18,
          }}
          className={`relative flex items-center justify-between rounded-[2rem] border px-5 transition-all duration-500 md:px-7 ${
            isScrolled
              ? "border-white/10 bg-[#07111a]/75 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl"
              : "border-white/5 bg-white/[0.03] backdrop-blur-xl"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(120deg,rgba(34,211,238,0.08),transparent_30%,transparent_70%,rgba(251,146,60,0.08))]" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Activity className="h-5 w-5" />
              <div className="absolute inset-0 rounded-2xl bg-cyan-300/10 blur-xl" />
            </div>

            <div className="leading-none">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Sympto
              </p>
              <h1 className="text-lg font-black tracking-[-0.08em] text-white md:text-xl">
                SCAN
              </h1>
            </div>
          </Link>

          <div className="relative z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] transition-colors ${
                    isActive
                      ? "text-slate-950"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-cyan-300"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 lg:flex">
              <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200">
                AI Health Suite
              </span>
            </div>

            <Link
              to="/predict"
              className="hidden items-center gap-2 rounded-full bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-200 md:inline-flex"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="mt-3 md:hidden"
            >
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111a]/95 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl">
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          className={`flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] transition ${
                            isActive
                              ? "bg-cyan-300 text-slate-950"
                              : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {link.name}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <Link
                  to="/predict"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-4 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200"
                >
                  Start Health Check
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
