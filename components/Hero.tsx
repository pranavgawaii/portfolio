import React from 'react';
import { PROFILE, ICONS_MAP } from '../constants';
import { Link as LinkIcon, FileText, Mail, Database, Server, Code, Cpu, Layers } from 'lucide-react';

const TechBadge = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mx-1 text-sm font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md align-middle transform hover:-translate-y-0.5 transition-transform cursor-default">
    <Icon size={14} className={color} />
    <span className="text-neutral-700 dark:text-neutral-300">{name}</span>
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
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
          Hi, I'm {PROFILE.name.split(' ')[0]} <span className="text-neutral-400 dark:text-neutral-600">—</span> A Full Stack web developer.
        </h1>

        {/* Bio with Badges */}
        <div className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mb-10">
          <p>
            I build interactive web apps using 
            <TechBadge icon={Code} name="TypeScript" color="text-blue-500" />
            ,
            <TechBadge icon={Cpu} name="React" color="text-cyan-500" />
            ,
            <TechBadge icon={Layers} name="Next.js" color="text-black dark:text-white" />
            ,
            <TechBadge icon={Server} name="Node.js" color="text-green-600" />
            and
            <TechBadge icon={Database} name="PostgreSQL" color="text-blue-400" />
            . With a focus on <span className="font-semibold text-neutral-900 dark:text-white">UI</span> design. Enthusiastic about <span className="font-semibold text-neutral-900 dark:text-white">AI & ML</span>, driven by a keen eye for design.
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
