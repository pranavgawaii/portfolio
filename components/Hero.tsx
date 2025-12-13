import React from 'react';
import { PROFILE, ICONS_MAP } from '../constants';
import { Link as LinkIcon, FileText, Mail, Database, Server, Code, Cpu, Layers } from 'lucide-react';

const TechBadge = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <span className="inline-flex items-center gap-1.5 mx-1 font-medium text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-0.5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
    <Icon size={14} className={color} />
    {name}
  </span>
);

const Hero: React.FC = () => {
  return (
    <header className="pt-32 pb-20">
      <div className="flex flex-col items-start">
        
        {/* Profile Picture */}
        <div className="relative mb-8">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#050505] shadow-xl">
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
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-6 h-6 bg-white dark:bg-[#050505] rounded-full flex items-center justify-center">
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
          <a 
            href="/resume.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#050505] text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <FileText size={18} />
            <span>Resume / CV</span>
          </a>
          
          <a 
            href="mailto:pranavgawai1518@gmail.com"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black border border-transparent rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Mail size={18} />
            <span>Get in touch</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6">
          {PROFILE.socials.map((social) => {
            const Icon = ICONS_MAP[social.icon.toLowerCase()] || LinkIcon;
            return (
              <a 
                key={social.name} 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors transform hover:scale-110"
                aria-label={social.name}
              >
                <Icon size={24} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default Hero;
