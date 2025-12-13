import React from 'react';
import { PROFILE, ICONS_MAP } from '../constants';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#050505]">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Copyright */}
        <div className="text-center md:text-left text-sm text-neutral-500 dark:text-neutral-400 order-2 md:order-1">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 order-1 md:order-2">
          {PROFILE.socials.map((social) => {
            const Icon = ICONS_MAP[social.icon];
            if (!Icon) return null;
            
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                aria-label={social.name}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
