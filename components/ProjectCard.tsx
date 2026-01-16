import React from 'react';
import { ProjectItem } from '../types';
import { Github, Globe, ArrowRight, Youtube } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  onClick?: () => void;
}

const TechIcon: React.FC<{ name: string }> = ({ name }) => {
  // Map tech names to icons
  const iconMap: Record<string, string> = {
    "React": "/React (1).png",
    "TypeScript": "/TypeScript.png",
    "JavaScript": "/JavaScript.png",
    "PostgreSQL": "/PostgresSQL.png",
    "MongoDB": "/MongoDB.png",
    "Java": "/Java.png",
    "HTML5": "/HTML5.png",
    "CSS3": "/CSS3.png",
  };

  const src = iconMap[name];

  if (src) {
    return (
      <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-1.5 flex items-center justify-center transition-transform hover:-translate-y-1" title={name}>
        <img src={src} alt={name} className="w-full h-full object-contain" />
      </div>
    );
  }

  // Fallback for text only
  return (
    <div className="px-2.5 py-1.5 text-[11px] font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {name}
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 cursor-pointer flex flex-col h-full hover:shadow-2xl dark:hover:shadow-none hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="h-52 w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Floating Title on Image (Optional, but looks cool) */}
        <div className="absolute bottom-4 left-4 right-4">
          {/* Can put something here if needed */}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-3 text-neutral-500 dark:text-neutral-400">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe size={18} />
              </a>
            )}
            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Youtube size={18} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto space-y-6">
          {/* Technologies */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 mb-3 uppercase tracking-wider">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <TechIcon key={tech} name={tech} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {project.status ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  {project.status}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
                  Completed
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm font-medium text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
              View Details <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
