import React, { useState } from 'react';
import { ExperienceItem } from '../types';
import { ChevronDown, ChevronUp, Globe, MapPin, Calendar } from 'lucide-react';

interface ExperienceCardProps {
  experience: ExperienceItem;
}

const TechBadge = ({ name }: { name: string }) => {
  // Map tech names to icons (reusing the logic or similar style)
  const iconMap: Record<string, string> = {
    "React": "/React (1).png",
    "React.js": "/React (1).png",
    "TypeScript": "/TypeScript.png",
    "JavaScript": "/JavaScript.png",
    "PostgreSQL": "/PostgresSQL.png",
    "MongoDB": "/MongoDB.png",
    "Java": "/Java.png",
    "HTML5": "/HTML5.png",
    "CSS3": "/CSS3.png",
    "Vite": "https://vitejs.dev/logo.svg",
    "Framer Motion": "https://www.vectorlogo.zone/logos/framer/framer-icon.svg",
    "Lucide React": "https://lucide.dev/logo.light.svg",
    "Django": "https://cdn.worldvectorlogo.com/logos/django.svg", // Fallback or external
    "GPT-4": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  };

  const src = iconMap[name];

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors hover:border-neutral-300 dark:hover:border-neutral-600">
      {src ? (
        <img src={src} alt={name} className="w-4 h-4 object-contain" />
      ) : (
        <div className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-600" />
      )}
      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{name}</span>
    </div>
  );
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="group relative pb-12 last:pb-0">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-12 h-12 rounded-lg bg-white border border-neutral-200 dark:border-neutral-800 flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-sm">
               {experience.logo ? (
                 <img src={experience.logo} alt={experience.company} loading="lazy" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-lg font-bold text-neutral-500">{experience.company.charAt(0)}</span>
               )}
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                  {experience.company}
                </h3>
                {/* Optional Company Links - Placeholders based on reference */}
                <div className="flex items-center gap-2 text-neutral-400">
                   <Globe size={14} className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
              <p className="text-base font-medium text-neutral-600 dark:text-neutral-400 mt-1 flex items-center gap-3">
                {experience.role}
                {experience.type === 'Current' && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">Currently Working</span>
                    </div>
                  )}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-sm text-neutral-500 dark:text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{experience.period}</span>
            </div>
            {experience.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{experience.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section (Collapsible logic could go here, but reference shows it open) */}
        <div className={`space-y-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-50'}`}>
          
          {/* Tech Stack */}
          {experience.techStack && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.techStack.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <ul className="space-y-3">
            {experience.description.map((desc, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 flex-shrink-0" />
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Accordion Toggle (Visual only for now as per reference style) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-0 right-0 md:hidden p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
      >
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
    </div>
  );
};

export default ExperienceCard;
