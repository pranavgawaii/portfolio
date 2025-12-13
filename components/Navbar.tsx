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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl grid grid-cols-3 items-center px-4 py-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-full border border-neutral-200 dark:border-neutral-800 shadow-lg">
      
      {/* Left: Empty */}
      <div></div>

      {/* Center: Navigation Links */}
      <div className="flex items-center justify-center gap-6 text-[14px] font-medium text-neutral-600 dark:text-neutral-400">
        <button onClick={() => scrollToSection('home')} className="hover:text-black dark:hover:text-white transition-colors">Home</button>
        <button onClick={() => scrollToSection('experience')} className="hover:text-black dark:hover:text-white transition-colors">Work</button>
        <button onClick={() => scrollToSection('projects')} className="hover:text-black dark:hover:text-white transition-colors">Projects</button>
        <button onClick={() => scrollToSection('skills')} className="hover:text-black dark:hover:text-white transition-colors">Skills</button>
      </div>

      {/* Right: Theme Toggle */}
      <div className="flex items-center justify-end">
        <div className="bg-transparent rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
             <ThemeSwitch className="!static !shadow-none !bg-transparent !p-2" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
