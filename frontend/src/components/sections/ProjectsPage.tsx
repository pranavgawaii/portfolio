import React from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../../config/constants';
import { ProjectItem } from '../../types/index';
import { ArrowUpRight, Github, PlayCircle, Globe } from 'lucide-react';
import { getTechLogo } from '../ui/TechLogo';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const LinkChip = ({ icon: Icon, label, href, colorClass }: { icon: any, label: string, href: string, colorClass?: string }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" 
       className="flex items-center rounded-xl border border-dashed border-border-light dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden transition-[border-color] duration-150 hover:border-neutral-500"
       style={{ height: 36 }}
       onMouseEnter={() => setHovered(true)}
       onMouseLeave={() => setHovered(false)}
       onClick={e => e.stopPropagation()}
       title={label}>
      <div className="w-9 h-9 flex items-center justify-center p-1.5 shrink-0">
        <Icon size={16} strokeWidth={1.8} className={colorClass || "text-text-light dark:text-text-dark"} />
      </div>
      <div
        className="overflow-hidden whitespace-nowrap text-[11px] font-mono font-medium text-text-light dark:text-text-dark transition-[max-width,padding] duration-200 ease-out"
        style={{ maxWidth: hovered ? 160 : 0, paddingRight: hovered ? 12 : 0 }}
      >
        {label}
      </div>
    </a>
  );
};

interface Props {
  onSelect: (p: ProjectItem) => void;
  onBack: () => void;
}

/* ── TechChip identical to ExperienceCard ─────────────────────────────────── */
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

/* ── bullet points derived from architecture + description ─────────────────── */
const getBullets = (p: ProjectItem): string[] => {
  if (p.architecture && p.architecture.length > 0) {
    return p.architecture.map(a => `${a.tech} - ${a.desc}`);
  }
  return [p.longDescription || p.description];
};

/* ── status badge style ───────────────────────────────────────────────────── */
const badgeClass = (s: string) => {
  if (/live/i.test(s))             return 'border-emerald-600 text-emerald-400 bg-emerald-950/30';
  if (/1st place/i.test(s))        return 'border-amber-600   text-amber-400   bg-amber-950/30';
  if (/top 1%|88/i.test(s))        return 'border-violet-600  text-violet-400  bg-violet-950/30';
  if (/top 10|2nd/i.test(s))       return 'border-blue-600    text-blue-400    bg-blue-950/30';
  if (/progress/i.test(s))         return 'border-sky-600     text-sky-400     bg-sky-950/30';
  return 'border-neutral-600 text-neutral-400 bg-neutral-900';
};

const dotClass = (s: string) => {
  if (/live/i.test(s))       return 'bg-emerald-500';
  if (/1st place/i.test(s))  return 'bg-amber-400';
  if (/top 1%|88/i.test(s))  return 'bg-violet-500';
  if (/top 10|2nd/i.test(s)) return 'bg-blue-500';
  if (/progress/i.test(s))   return 'bg-sky-400 animate-pulse';
  return 'bg-neutral-500';
};

/* derive short badge label */
const badgeLabel = (s: string) => {
  if (/live/i.test(s))       return 'Live';
  if (/1st place/i.test(s))  return '1st Place';
  if (/top 1%/i.test(s))     return 'Top 1%';
  if (/top 10/i.test(s))     return 'Top 10';
  if (/2nd place/i.test(s))  return '2nd Place';
  if (/progress/i.test(s))   return 'Building';
  return s.split('·')[0].trim();
};

/* derive right-side context line (hackathon / event name) */
const contextLine = (s: string) => {
  const parts = s.split('·');
  return parts.length > 1 ? parts.slice(1).join('·').trim() : '';
};

/* ── single project entry ─────────────────────────────────────────────────── */
const ProjectEntry: React.FC<{
  project: ProjectItem;
  index: number;
  onSelect: (p: ProjectItem) => void;
  isAnyHovered: boolean;
  isThisHovered: boolean;
  onHover: (id: string | null) => void;
}> = ({ project, index, onSelect, isAnyHovered, isThisHovered, onHover }) => {
  const bullets   = getBullets(project);
  const badge     = project.status ? badgeLabel(project.status) : null;
  const bc        = project.status ? badgeClass(project.status) : '';
  const dc        = project.status ? dotClass(project.status) : '';
  const ctx       = project.status ? contextLine(project.status) : '';
  const hasYT     = !!project.youtube;
  const hasLink   = project.link && project.link !== project.github;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ 
        opacity: isAnyHovered && !isThisHovered ? 0.28 : 1,
        filter: isAnyHovered && !isThisHovered ? 'blur(1.2px)' : 'blur(0px)',
        y: 0
      }}
      onHoverStart={() => onHover(project.id)}
      onHoverEnd={() => onHover(null)}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: isAnyHovered ? 0 : (0.08 + index * 0.07) }}
      className="transition-all"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={() => onSelect(project)} className="group text-left">
            <h2 className="font-sans font-bold text-lg text-text-light dark:text-text-dark group-hover:opacity-60 transition-opacity">
              {project.title}
            </h2>
          </button>

          {badge && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${bc}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dc}`} />
              {badge}
            </span>
          )}
        </div>

        {/* Right side: Icons + Context */}
        <div className="flex items-center gap-4 shrink-0 mt-0.5">
          <div className="flex items-center gap-2">
            {project.github && (
              <LinkChip icon={Github} label="repo" href={project.github} />
            )}
            {hasLink && (
              <LinkChip icon={Globe} label={getDomain(project.link!)} href={project.link!} colorClass="text-blue-500 dark:text-blue-400" />
            )}
            {hasYT && (
              <LinkChip icon={PlayCircle} label="demo" href={project.youtube!} colorClass="text-red-500 dark:text-red-400" />
            )}
          </div>
          
          {ctx && (
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-50 text-right hidden sm:block whitespace-nowrap">
              {ctx}
            </span>
          )}
        </div>
      </div>

      {/* Subtitle - description (one line) */}
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
        {project.description}
      </p>

      {/* Divider */}
      <div className="border-t border-border-light dark:border-border-dark mb-5" />

      {/* Technologies & Tools */}
      <p className="text-sm font-sans font-semibold text-text-light dark:text-text-dark mb-3">
        Technologies &amp; Tools
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {(project.techStack ?? []).map(tech => (
          <TechChip key={tech} tech={tech} />
        ))}
      </div>

      {/* What I've done */}
      <p className="text-sm font-sans font-semibold text-text-light dark:text-text-dark mb-3">
        What I built
      </p>
      <ul className="space-y-2 mb-5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="mt-2 w-1 h-1 rounded-full bg-neutral-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      {/* Links row */}
      <div className="flex justify-end mb-2">
        <button onClick={() => onSelect(project)}
          className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors underline underline-offset-4 decoration-dashed">
          Full details →
        </button>
      </div>
    </motion.div>
  );
};

/* ── page ─────────────────────────────────────────────────────────────────── */
const ProjectsPage: React.FC<Props> = ({ onSelect }) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className="pt-10 pb-28">

    {/* Hero */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-12"
    >
      <h1 className="font-sans font-bold text-2xl sm:text-3xl text-text-light dark:text-text-dark tracking-tight mb-2">
        Projects
      </h1>
    </motion.div>

    {/* Entries with dividers between them */}
    <div className="space-y-10 divide-y divide-border-light dark:divide-border-dark">
      {PROJECTS.map((p, i) => (
        <div key={p.id} className={i > 0 ? 'pt-10' : ''}>
          <ProjectEntry 
            project={p} 
            index={i} 
            onSelect={onSelect} 
            isAnyHovered={hoveredId !== null}
            isThisHovered={hoveredId === p.id}
            onHover={setHoveredId}
          />
        </div>
      ))}
    </div>
  </div>
  );
};

export default ProjectsPage;
