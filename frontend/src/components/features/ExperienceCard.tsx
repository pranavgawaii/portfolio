import React, { useState } from 'react';
import { ExperienceItem } from '../../types/index';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTechLogo } from '../ui/TechLogo';

const TechChip = ({ tech }: { tech: string }) => {
  const Logo = getTechLogo(tech);
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="flex items-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900 overflow-hidden cursor-default transition-[border-color] duration-150 hover:border-neutral-500"
      style={{ height: 36 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 h-9 flex items-center justify-center p-1.5 shrink-0">
        {Logo
          ? <Logo size={22} />
          : <span className="text-[10px] font-bold font-mono text-neutral-400">{tech.slice(0, 2).toUpperCase()}</span>
        }
      </div>
      <div
        className="overflow-hidden whitespace-nowrap text-[10px] font-sans font-medium text-neutral-300 transition-[max-width,padding] duration-200 ease-out"
        style={{ maxWidth: hovered ? 96 : 0, paddingRight: hovered ? 10 : 0 }}
      >
        {tech}
      </div>
    </div>
  );
};

const ExperienceCard: React.FC<{ experience: ExperienceItem }> = ({ experience }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="group w-full flex items-start justify-between gap-4 py-2.5 text-left"
      >
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-sans font-bold text-sm text-text-light dark:text-text-dark">
              {experience.company}
            </span>
            {experience.type === 'Current' && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Working
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            {experience.role}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-sans text-text-muted-light dark:text-text-muted-dark opacity-80 whitespace-nowrap">
              {experience.period}
            </p>
            {experience.location && (
              <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark opacity-50 whitespace-nowrap mt-0.5">
                {experience.location}
              </p>
            )}
          </div>
          {/* Subtle chevron so functionality remains */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-muted-light dark:text-text-muted-dark opacity-0 group-hover:opacity-40 transition-opacity"
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </button>

      {/* Mobile period */}
      <div className="sm:hidden pb-1 flex justify-between text-[11px] text-text-muted-light dark:text-text-muted-dark opacity-60">
        <span>{experience.period}</span>
        <span>{experience.location}</span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 space-y-4">
              {/* Description bullets */}
              {experience.description && experience.description.length > 0 && (
                <ul className="space-y-2">
                  {experience.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                      <span className="mt-2 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech stack — branded icon chips */}
              {experience.techStack && experience.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 overflow-visible">
                  {experience.techStack.map(tech => (
                    <TechChip key={tech} tech={tech} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceCard;
