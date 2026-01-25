import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PROFILE, ICONS_MAP } from '../constants';
import { Link as LinkIcon, FileText, Mail, Database, Server, Code, Cpu, Layers, X, Copy, Check, Download } from 'lucide-react';
import { AnimatePresence, motion } from "motion/react";
import SpotifyCard from './SpotifyCard';
import ProgressiveImage from './ProgressiveImage';
import ContactModal from './ContactModal';

const TechBadge = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <span className="inline-flex items-center gap-1.5 mx-1 font-medium text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-0.5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
    <Icon size={14} className={color} />
    {name}
  </span>
);

const SocialLink: React.FC<{ href: string, icon: any, label: string }> = ({ href, icon: Icon, label }) => {
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

  const titles = ["- Full Stack Developer", "- Open Source Contributor", "- UI/UX Designer", "- Tech Enthusiast"];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="pb-16 sm:pb-20">

      <div className="flex flex-col items-center sm:items-start w-full px-3 sm:px-0 relative z-10">

        {/* Profile Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 w-full mt-8 sm:mt-12">

          {/* Profile Picture */}
          <div className="relative shrink-0 cursor-pointer group" onClick={() => setShowProfileZoom(true)}>
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-xl relative bg-neutral-100 dark:bg-neutral-900 transition-transform duration-300 group-hover:scale-105">
              <ProgressiveImage
                src={mounted && resolvedTheme === 'dark' ? "/cooldark.png" : "/coollight.png"}
                alt={PROFILE.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Title - Stacked Layout */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:pt-14">
            <div className="flex items-center gap-1.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
                heyitspranav
              </h1>
              <div className="text-blue-500 flex items-center pt-1" title="Verified">
                {/* High Quality Verified Badge */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 12.5C22.5 12.9806 22.3622 13.4478 22.1064 13.8475L20.8976 15.7362C20.6698 16.0922 20.5513 16.5163 20.5638 16.9405L20.6302 19.1824C20.6443 19.658 20.4735 20.1218 20.1508 20.4851C19.8281 20.8484 19.381 21.0805 18.8953 21.1373L16.6585 21.399C16.2361 21.4484 15.8368 21.6423 15.5147 21.9546L13.8055 23.6122C13.4447 23.9622 12.9723 24.1377 12.5 24.1377C12.0277 24.1377 11.5553 23.9622 11.1945 23.6122L9.48529 21.9546C9.16324 21.6423 8.76387 21.4484 8.34151 21.399L6.10473 21.1373C5.61904 21.0805 5.17191 20.8484 4.84918 20.4851C4.52646 20.1218 4.35568 19.658 4.36976 19.1824L4.43618 16.9405C4.44872 16.5163 4.33017 16.0922 4.10239 15.7362L2.89356 13.8475C2.63777 13.4478 2.5 12.9806 2.5 12.5C2.5 12.0194 2.63777 11.5522 2.89356 11.1525L4.10239 9.26383C4.33017 8.90776 4.44872 8.48373 4.43618 8.05949L4.36976 5.81759C4.35568 5.342 4.52646 4.87817 4.84918 4.51487C5.17191 4.15157 5.61904 3.91953 6.10473 3.86273L8.34151 3.60105C8.76387 3.55163 9.16324 3.35773 9.48529 3.04535L11.1945 1.38779C11.5553 1.03784 12.0277 0.862305 12.5 0.862305C12.9723 0.862305 13.4447 1.03784 13.8055 1.38779L15.5147 3.04535C15.8368 3.35773 16.2361 3.55163 16.6585 3.60105L18.8953 3.86273C19.381 3.91953 19.8281 4.15157 20.1508 4.51487C20.4735 4.87817 20.6443 5.342 20.6302 5.81759L20.5638 8.05949C20.5513 8.48373 20.6698 8.90776 20.8976 9.26383L22.1064 11.1525C22.3622 11.5522 22.5 12.0194 22.5 12.5Z" />
                  <path d="M10.0945 16.3201L6.68018 12.9056L8.09439 11.4913L10.0945 13.4915L16.9056 6.68042L18.3198 8.09463L10.0945 16.3201Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Animated Subtitle - Stacked Under */}
            <div className="flex items-center gap-2 text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 font-medium tracking-wide h-6 sm:h-auto font-sans">
              {/* <span className="hidden sm:inline">—</span> Removed the dash for stacked layout */}
              <div className="relative w-80 sm:w-96 text-center sm:text-left h-7 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titles[titleIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 truncate flex items-center justify-center sm:justify-start"
                  >
                    {titles[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Bio with Badges */}
        <div className="text-base xs:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl sm:max-w-3xl mb-8 sm:mb-10 w-full">
          <p>
            I build production-ready web applications from scratch, working across frontend and backend, with a strong focus on clean architecture, performance, and user experience.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 w-full justify-center sm:justify-start">
          <button
            className="group flex min-w-[170px] decoration-0 transition-transform active:scale-95 cursor-pointer outline-none w-auto h-[44px] px-6 relative items-center justify-center"
            type="button"
            onClick={() => {
              setShowResume(true);
              fetch('/api/track-resume?type=view').catch(console.error);
            }}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "none" }}
          >
            {/* Glow Layer */}
            <div className="pointer-events-none transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-0 opacity-100 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(15% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px", filter: "blur(15px)" }}></div>

            {/* Glow Hover Layer */}
            <div className="pointer-events-none transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-100 opacity-0 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(60.6% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px", filter: "blur(18px)" }}></div>

            {/* Stroke Layer */}
            <div className="pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-0 opacity-100 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(10.7% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px" }}></div>

            {/* Stroke Hover Layer */}
            <div className="pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-100 opacity-0 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(60.1% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px" }}></div>

            {/* Fill Layer */}
            <div className="rounded-[7px] absolute top-[1px] right-[1px] bottom-[1px] left-[1px] bg-white dark:bg-black opacity-100"></div>

            {/* Content Layer */}
            <div className="relative z-20 flex items-center justify-center gap-2 opacity-100">
              <FileText size={16} className="text-black dark:text-white" />
              <span className="m-0 p-0 font-sans text-[14px] font-medium text-black dark:text-white tracking-wide" style={{ WebkitFontSmoothing: "antialiased", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                Resume / CV
              </span>
            </div>
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
        <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start w-full">
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
        <div className="w-full mt-10">
          <SpotifyCard />
        </div>

      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      {/* Resume Modal */}
      {
        showResume && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowResume(false)}>
            <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 gap-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Resume Preview</h3>
                <div className="flex items-center gap-2">
                  <a
                    href="https://drive.google.com/uc?export=download&id=1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi"
                    onClick={() => fetch('/api/track-resume?type=download').catch(console.error)}
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
        )
      }
    </header >
  );
};

export default Hero;
