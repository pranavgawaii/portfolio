import React from 'react';
import { ThemeSwitch } from './ThemeSwitch';

const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-6 py-6 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md">
      
      {/* Left: Empty */}
      <div></div>

      {/* Center: Navigation Links */}
      <div className="flex items-center justify-center gap-8 text-[15px] font-medium text-neutral-600 dark:text-neutral-400">
        <button onClick={() => scrollToSection('experience')} className="hover:text-black dark:hover:text-white transition-colors">Work</button>
        <button onClick={() => scrollToSection('projects')} className="hover:text-black dark:hover:text-white transition-colors">Projects</button>
        <button onClick={() => scrollToSection('skills')} className="hover:text-black dark:hover:text-white transition-colors">Skills</button>
      </div>

      {/* Right: Theme Toggle */}
      <div className="flex items-center justify-end gap-4">
        <div className="bg-white dark:bg-[#111] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
             <ThemeSwitch className="!static !shadow-none !bg-transparent !p-2.5" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
