import React from 'react';
import { ThemeSwitch } from './ThemeSwitch';

const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    // Try to scroll, and if not found, retry after a short delay (for async rendering)
    const tryScroll = (attempts = 0) => {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 100);
      }
    };
    tryScroll();
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-2xl grid grid-cols-3 items-center px-2 py-1.5 sm:px-4 sm:py-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-full border border-neutral-200 dark:border-neutral-800 shadow-lg transition-all duration-300">
      
      {/* Left: Empty */}
      <div></div>

      {/* Center: Navigation Links */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 text-[12px] sm:text-[14px] font-medium text-neutral-600 dark:text-neutral-400">
        <button onClick={() => scrollToSection('home')} className="hover:text-black dark:hover:text-white transition-colors">Home</button>
        <button onClick={() => scrollToSection('experience')} className="hover:text-black dark:hover:text-white transition-colors">Work</button>
        <button onClick={() => scrollToSection('projects')} className="hover:text-black dark:hover:text-white transition-colors">Projects</button>
        <button onClick={() => scrollToSection('about-me')} className="hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">About Me</button>
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
