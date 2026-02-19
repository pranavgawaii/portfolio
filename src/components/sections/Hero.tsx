import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { PROFILE, ICONS_MAP } from '../../constants';
import { Link as LinkIcon, FileText, Mail, X, Copy, Check, Download, MoreHorizontal, MessageCircle, Grid, Zap, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from "motion/react";
import SpotifyCard from '../features/SpotifyCard';
import ProgressiveImage from '../ui/ProgressiveImage';
import ContactModal from '../modals/ContactModal';

// --- Main Hero Component ---
const Hero: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [showResume, setShowResume] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showProfileZoom, setShowProfileZoom] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const roles = [
    "Full Stack Engineer",
    "Open Source Contributor",
    "Blockchain Developer",
    "UI Designer"
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <header className="mt-12 mb-16">
        <div className="flex items-start gap-8">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-3xl overflow-hidden shadow-md border border-border-light dark:border-border-dark bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95"
              onClick={() => setShowProfileZoom(true)}
            >
              <ProgressiveImage
                alt={PROFILE.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/avatar.png"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center pt-16">
            <h1 className="font-mono text-4xl text-text-light dark:text-text-dark flex items-center flex-wrap gap-x-5 gap-y-2 tracking-tighter leading-none mb-3">
              <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
                {PROFILE.name}
                <div className="relative flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 fill-current">
                    <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.15-.44.23-.91.23-1.4 0-2.45-1.99-4.44-4.44-4.44-.49 0-.96.08-1.4.23-1.42-1.3-3.08-2.18-3.66-2.18-1.58 0-2.95.88-3.66 2.18-.44-.15-.91-.23-1.4-.23-2.45 0-4.44 1.99-4.44 4.44 0 .49.08.96.23 1.4C1.3 10.08.42 11.74.42 12.5c0 1.58.88 2.95 2.18 3.66-.15.44-.23.91-.23 1.4 0 2.45 1.99 4.44 4.44 4.44.49 0 .96-.08 1.4-.23 1.42 1.3 3.08 2.18 3.66 2.18 1.58 0 2.95-.88 3.66-2.18.44.15.91.23 1.4.23 2.45 0 4.44-1.99 4.44-4.44 0-.49-.08-.96-.23-1.4 1.3-1.42 2.18-3.08 2.18-3.66z" />
                    <path d="M10.2 16.25l-3.45-3.45 1.06-1.06 2.39 2.39 5.39-5.39 1.06 1.06-6.45 6.45z" className="text-white fill-current" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark font-mono text-[11px] uppercase tracking-[0.3em] opacity-40 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                <span>Pune, IND</span>
              </div>
            </h1>
            <div className="flex items-center gap-3 text-text-muted-light dark:text-text-muted-dark text-base font-mono opacity-70">
              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roles[currentRoleIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="block tracking-widest uppercase text-xs"
                  >
                    {roles[currentRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 font-mono text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark max-w-xl">
          <p>
            I build <span className="bg-blue-100/50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-1 rounded font-medium">production-ready web applications</span> from scratch, working across frontend and backend, with a strong focus on clean architecture, performance, and user experience.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Social Links Row */}
          <div className="flex items-center gap-6 text-text-muted-light dark:text-text-muted-dark">
            {PROFILE.socials.map((social) => {
              const Icon = ICONS_MAP[social.icon.toLowerCase()];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                  title={social.name}
                >
                  {Icon && <Icon size={20} strokeWidth={1.5} />}
                </a>
              );
            })}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setShowResume(true)}
              className="group/btn relative flex items-center gap-3 px-6 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
            >
              <FileText size={16} strokeWidth={2.5} />
              <span>View Resume</span>
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="group/btn relative flex items-center gap-3 px-6 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white text-sm font-semibold transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:-translate-y-0.5"
            >
              <Mail size={16} strokeWidth={2.5} className="text-primary" />
              <span>Contact Me</span>
            </button>
          </div>
        </div>

        <div className="mt-10">
          <SpotifyCard />
        </div>

        <div className="mt-16 space-y-6 overflow-hidden">
          <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted-light/50 dark:text-text-muted-dark/50 px-2 flex items-center gap-2">
            <span className="h-px w-4 bg-border-light dark:bg-border-dark opacity-30"></span>
            Technical Expertise
          </h4>

          <div className="relative group/marquee">
            {/* Mask Gradients for smooth fade */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background-light dark:from-background-dark to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background-light dark:from-background-dark to-transparent z-10" />

            <motion.div
              animate={{ x: [0, -1500] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex gap-4 whitespace-nowrap"
            >
              {/* Quadrupled set of logos for seamless loop */}
              {[...PROFILE.skills.flatMap(s => s.skills), ...PROFILE.skills.flatMap(s => s.skills), ...PROFILE.skills.flatMap(s => s.skills), ...PROFILE.skills.flatMap(s => s.skills)].map((skill, idx) => {
                // Map original names to devicon names
                const skillMap: Record<string, string> = {
                  "C++": "cplusplus",
                  "Python": "python",
                  "JavaScript": "javascript",
                  "TypeScript": "typescript",
                  "SQL": "mysql",
                  "HTML5": "html5",
                  "CSS3": "css3",
                  "React": "react",
                  "Node.js": "nodejs",
                  "Express.js": "express",
                  "Django": "django",
                  "Flask": "flask",
                  "Next.js": "nextjs",
                  "Socket.io": "socketio",
                  "Tailwind CSS": "tailwindcss",
                  "PostgreSQL": "postgresql",
                  "MongoDB": "mongodb",
                  "MySQL": "mysql",
                  "Redis": "redis",
                  "Git": "git",
                  "GitHub": "github",
                  "Docker": "docker",
                  "Linux/Unix": "linux",
                  "Figma": "figma",
                  "VS Code": "visualstudio",
                  "Postman": "postman"
                };
                const deviconName = skillMap[skill] || skill.toLowerCase().replace(/[\s\.]+/g, '');
                const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${deviconName}/${deviconName}-original.svg`;

                return (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-xl hover:border-primary/50 transition-colors group">
                    <div className="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <img
                        src={iconUrl}
                        alt={skill}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg';
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[13px] font-mono text-text-muted-light dark:text-text-muted-dark">{skill}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Modals remain the same */}
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <AnimatePresence>
        {showProfileZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowProfileZoom(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/avatar.png"
                alt={PROFILE.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResume && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowResume(false)}>
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white font-sans">Resume Preview</h3>
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
    </>
  );
};

export default Hero;
