import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { ProjectItem } from '../../types/index';
import Badge from '../ui/Badge';

interface ProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const layerColors = [
    'border-blue-500/40 bg-blue-500/5',
    'border-purple-500/40 bg-purple-500/5',
    'border-emerald-500/40 bg-emerald-500/5',
    'border-amber-500/40 bg-amber-500/5',
    'border-rose-500/40 bg-rose-500/5',
  ];
  const dotColors = [
    'bg-blue-400',
    'bg-purple-400',
    'bg-emerald-400',
    'bg-amber-400',
    'bg-rose-400',
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800/60 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {project.title}
            </h3>
            {project.status && (
              <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {project.status}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-4 shrink-0"
            aria-label="Close modal"
          >
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
            {project.longDescription || project.description}
          </p>

          {/* System Architecture */}
          {project.architecture && project.architecture.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                System Architecture
                <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              </h4>

              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-4 top-6 bottom-6 w-px bg-gradient-to-b from-blue-400 via-purple-400/50 to-transparent" />

                <div className="space-y-3">
                  {project.architecture.map((layer, i) => (
                    <div
                      key={i}
                      className={`relative ml-8 pl-4 pr-4 py-3 rounded-xl border ${layerColors[i % layerColors.length]} transition-all hover:scale-[1.01]`}
                    >
                      {/* connector dot */}
                      <div className={`absolute -left-[1.35rem] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${dotColors[i % dotColors.length]} ring-2 ring-white dark:ring-[#0a0a0a] shadow`} />
                      {/* connector line segment */}
                      <div className="absolute -left-[0.85rem] top-1/2 w-3 h-px bg-neutral-300 dark:bg-neutral-700" />

                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                              {layer.layer}
                            </span>
                            <ArrowRight size={10} className="text-neutral-300 dark:text-neutral-600" />
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                              {layer.tech}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {layer.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {(project.tech || project.techStack || []).map((tech: string) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-3">
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity font-semibold text-sm w-full sm:w-auto"
              >
                <ExternalLink size={15} />
                Live Project
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-semibold text-sm w-full sm:w-auto"
              >
                <Github size={15} />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
