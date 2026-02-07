import React from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
        
        {/* Social Links */}
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <FiGithub size={20} />
          </a>
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <FiLinkedin size={20} />
          </a>
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <FiMail size={20} />
          </a>
        </div>

        {/* Brand & Rights */}
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Sympto Scan
          </p>
          <p className="text-[14px] text-slate-400/60 mt-1 max-w-xs mx-auto">
            AI-driven insights for educational purposes. 
            Always consult a medical professional.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;