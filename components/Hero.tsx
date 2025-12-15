import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PROFILE, ICONS_MAP } from '../constants';
import { Link as LinkIcon, FileText, Mail, Database, Server, Code, Cpu, Layers, X, Copy, Check, Download } from 'lucide-react';
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
  const { resolvedTheme } = useTheme();
  const [showResume, setShowResume] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showProfileZoom, setShowProfileZoom] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="pt-12 pb-20">
      <div className="flex flex-col items-start">
        
        {/* Profile Picture */}
        <div className="relative mb-8 cursor-pointer group" onClick={() => setShowProfileZoom(true)}>
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border border-black/10 dark:border-white/10 shadow-xl relative bg-neutral-100 dark:bg-neutral-900 transition-transform duration-300 group-hover:scale-105">
            <img 
              src="/coollight.png" 
              alt={PROFILE.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
            />
            <img 
              src="/cooldark.png" 
              alt={PROFILE.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          {/* Status Dot */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-[#050505] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#050505]"></div>
          </div>
        </div>

        {/* Profile Zoom Modal */}
        {showProfileZoom && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfileZoom(false)}>
            <div className="relative w-full max-w-lg flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowProfileZoom(false)}
                className="absolute top-4 right-4 p-2 text-neutral-200 hover:text-white bg-black/40 rounded-full z-10"
                aria-label="Close profile zoom"
              >
                <X size={28} />
              </button>
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl relative bg-neutral-100 dark:bg-neutral-900 transition-transform duration-300">
                <img 
                  src="/coollight.png" 
                  alt={PROFILE.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
                />
                <img 
                  src="/cooldark.png" 
                  alt={PROFILE.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${mounted && resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Status Dot removed */}
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{PROFILE.name}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 break-words whitespace-normal text-center sm:text-left">
          Hi, I'm {PROFILE.name.split(' ')[0]} <span className="text-neutral-500 dark:text-neutral-500">— A Full Stack web developer.</span>
        </h1>

        {/* Bio with Badges */}
        <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mb-10">
          <p>
            I build production-ready web applications from scratch, working across frontend and backend, with a strong focus on clean architecture, performance, and user experience.
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Resume Preview</h3>
              <div className="flex items-center gap-2">
                <a
                  href="https://drive.google.com/uc?export=download&id=1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#18181b] text-neutral-700 dark:text-neutral-200 rounded-full shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all duration-200"
                  title="Download Resume"
                >
                  <Download size={20} strokeWidth={2.2} />
                </a>
                <button 
                  onClick={() => setShowResume(false)}
                  className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X size={20} />
                </button>
              </div>
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
