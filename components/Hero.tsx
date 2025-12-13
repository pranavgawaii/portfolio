import React, { useState } from 'react';
import { PROFILE, ICONS_MAP } from '../constants';
import { Link as LinkIcon, FileText, Mail, Database, Server, Code, Cpu, Layers, X, Copy, Check } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import ContactModal from './ContactModal';

const TechBadge = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <span className="inline-flex items-center gap-1.5 mx-1 font-medium text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-0.5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
    <Icon size={14} className={color} />
    {name}
  </span>
);

const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
  const [copied, setCopied] = useState(false);
  const isEmail = label === "Email";
  const email = href.replace("mailto:", "");

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      aria-label={label}
    >
      <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isEmail ? '' : 'pointer-events-none'} flex items-center gap-2 z-50`}>
        {label}
        {isEmail && (
          <button 
            onClick={handleCopy}
            className="hover:text-green-400 transition-colors focus:outline-none p-0.5 rounded hover:bg-white/10"
            title="Copy email"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        )}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-700"></span>
        {/* Bridge to prevent tooltip from closing when moving mouse to it */}
        <span className="absolute top-full left-0 w-full h-2 bg-transparent"></span>
      </span>
      <Icon size={20} strokeWidth={1.5} />
    </a>
  );
};

const Hero: React.FC = () => {
  const [showResume, setShowResume] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <header className="pt-32 pb-20">
      <div className="flex flex-col items-start">
        
        {/* Profile Picture */}
        <div className="relative mb-8">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-4 border-white dark:border-[#050505] shadow-xl">
            <img 
              src="/pgg.JPG" 
              alt={PROFILE.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav&backgroundColor=b6e3f4";
              }}
            />
          </div>
          {/* Status Dot */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-[#050505] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#050505]"></div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 whitespace-nowrap">
          Hi, I'm {PROFILE.name.split(' ')[0]} <span className="text-neutral-500 dark:text-neutral-500">— A Full Stack web developer.</span>
        </h1>

        {/* Bio with Badges */}
        <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mb-10">
          <p>
            I build interactive web apps using TypeScript, React, Next.js, Node.js and PostgreSQL. With a focus on UI design. Enthusiastic about AI & ML, driven by a keen eye for design.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button 
            onClick={() => setShowResume(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white dark:bg-[#050505] text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <FileText size={16} />
            <span>Resume / CV</span>
          </button>
          
          <button 
            onClick={() => setShowContact(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-neutral-900 dark:bg-white text-white dark:text-black border border-transparent rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Mail size={16} />
            <span>Get in touch</span>
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-1">
          {PROFILE.socials.map((social) => {
            const Icon = ICONS_MAP[social.icon.toLowerCase()] || LinkIcon;
            return (
              <SocialLink 
                key={social.name}
                href={social.url}
                icon={Icon}
                label={social.name}
              />
            );
          })}
        </div>

        {/* Music Player */}
        <MusicPlayer />

      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      {/* Resume Modal */}
      {showResume && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowResume(false)}>
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Resume Preview</h3>
              <button 
                onClick={() => setShowResume(false)}
                className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-900">
              <iframe 
                src="https://drive.google.com/file/d/1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi/preview" 
                className="w-full h-full border-0"
                title="Resume Preview"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Hero;
