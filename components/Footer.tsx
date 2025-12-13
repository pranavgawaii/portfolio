import React from 'react';
import { PROFILE } from '../constants';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'github': return <Github size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'mail': return <Mail size={20} />;
      default: return null;
    }
  };

  return (
    <footer className="mt-20 pb-10 border-t border-neutral-200 dark:border-neutral-800 pt-10">
      <div className="flex flex-col items-center justify-center gap-6">
        
        {/* Social Links */}
        <div className="flex items-center gap-6">
          {PROFILE.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
              aria-label={social.name}
            >
              {getIcon(social.icon)}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <p className="mt-1"></p>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors group"
          aria-label="Back to top"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
