import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Github, Youtube } from 'lucide-react';
import { ProjectItem } from '../../types';
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {project.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Preview Tab for Project Images */}

          {(project.title === 'Sahara' || project.title === 'MedSecure24') && (
            <div className="mb-6 flex flex-col items-center">
              <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 mb-2">
                <img
                  src={project.title === 'Sahara' ? '/saharaar.png' : '/medcare24ar.png'}
                  alt={project.title + ' Preview'}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="block text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide mb-1" style={{ letterSpacing: '0.04em' }}>System Architecture Diagram</span>
            </div>
          )}

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {project.description}
          </p>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wider">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {(project.tech || project.techStack || []).map((tech: string) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink size={18} />
                View Project
              </a>
            )}
            {/* YouTube Icon (if available) */}
            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                <Youtube size={18} />
                YouTube
              </a>
            )}
            {/* GitHub Icon */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium"
              >
                <Github size={18} />
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
