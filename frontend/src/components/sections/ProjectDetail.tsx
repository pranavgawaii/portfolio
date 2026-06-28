import React from 'react';
import { ProjectItem } from '../../types/index';
import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { getTechLogo } from '../ui/TechLogo';

interface Props {
  project: ProjectItem;
  onBack: () => void;
}

const NODE_COLORS = [
  { border: '#3B82F6', bg: 'rgba(59,130,246,0.08)', label: '#60A5FA' },
  { border: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', label: '#A78BFA' },
  { border: '#10B981', bg: 'rgba(16,185,129,0.08)', label: '#34D399' },
  { border: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: '#FCD34D' },
  { border: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: '#F87171' },
];

const ArchDiagram: React.FC<{ layers: NonNullable<ProjectItem['architecture']> }> = ({ layers }) => (
  <div className="rounded-xl border border-border-light dark:border-border-dark bg-neutral-50/40 dark:bg-neutral-900/30 p-5 relative overflow-hidden">
    {/* Dot grid background */}
    <div className="absolute inset-0 opacity-[0.05]" style={{
      backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
      backgroundSize: '18px 18px',
    }} />
    <div className="relative flex flex-col items-center gap-0">
      {layers.map((layer, i) => {
        const c = NODE_COLORS[i % NODE_COLORS.length];
        return (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="w-full max-w-sm"
            >
              <div className="rounded-xl border px-4 py-3" style={{ borderColor: c.border, backgroundColor: c.bg }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest block mb-0.5" style={{ color: c.label }}>
                      {layer.layer}
                    </span>
                    <p className="font-sans font-semibold text-sm text-text-light dark:text-text-dark">{layer.tech}</p>
                    {layer.desc && (
                      <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark mt-0.5 opacity-70">{layer.desc}</p>
                    )}
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.border }} />
                </div>
              </div>
            </motion.div>

            {i < layers.length - 1 && (
              <div className="flex flex-col items-center py-0.5">
                <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
                <svg width="8" height="5" viewBox="0 0 8 5" className="text-neutral-400 dark:text-neutral-600">
                  <path d="M0 0L4 5L8 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

const statusCls = (s: string) => {
  if (s.toLowerCase().match(/1st|2nd|top 1%|top 10/)) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
  if (s.toLowerCase().match(/live|launch/)) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
  return 'text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800';
};

const ProjectDetail: React.FC<Props> = ({ project, onBack }) => (
  <div className="pb-2">
    {/* Status */}
    {project.status && (
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3 ${statusCls(project.status)}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {project.status}
      </span>
    )}

    {/* Title + description */}
    <h2 className="font-sans font-bold text-2xl text-text-light dark:text-text-dark tracking-tight mb-2">
      {project.title}
    </h2>
    <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6">
      {project.longDescription || project.description}
    </p>

    {/* Links */}
    <div className="flex gap-2 mb-8">
      {project.link && project.link !== '#' && (
        <a href={project.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark text-xs font-semibold hover:opacity-85 transition-opacity">
          <ExternalLink size={12} /> Live
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-sm text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
          <Github size={12} /> GitHub
        </a>
      )}
    </div>

    {/* System Architecture */}
    {project.architecture && project.architecture.length > 0 && (
      <div className="mb-8">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50 mb-3">
          System Architecture
        </p>
        <ArchDiagram layers={project.architecture} />
      </div>
    )}

    {/* Tech stack */}
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50 mb-3">
        Tech Stack
      </p>
      <div className="flex flex-wrap gap-1.5">
        {(project.tech || project.techStack || []).map(tech => {
          const Logo = getTechLogo(tech);
          return (
            <span key={tech} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-light dark:border-border-dark text-xs text-text-muted-light dark:text-text-muted-dark">
              {Logo && <Logo size={13} />}
              {tech}
            </span>
          );
        })}
      </div>
    </div>
  </div>
);

export default ProjectDetail;
