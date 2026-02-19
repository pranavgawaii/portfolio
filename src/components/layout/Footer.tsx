import React from 'react';
import { PROFILE, ICONS_MAP } from '../../constants';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-6">
        {/* Social Links */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-4 mb-2">
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
          <div
            className="text-center font-sans text-[15px] md:text-[16px] text-neutral-400 dark:text-neutral-500 font-normal leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif', letterSpacing: '0.01em' }}
          >
            Design &amp; Developed by <span className="font-bold text-black dark:text-white" style={{ fontWeight: 700 }}>pranavgawai</span><br />
            <span className="text-[14px] md:text-[15px] text-neutral-400 dark:text-neutral-500">© 2025. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
