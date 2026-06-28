import React from 'react';
import { ProjectItem } from '../../types/index';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  project: ProjectItem;
  onClick: () => void;
}

const ProjectCard: React.FC<Props> = ({ project, onClick }) => (
  <button
    onClick={onClick}
    className="group w-full text-left flex items-center gap-4 py-4 border-b border-border-light dark:border-border-dark last:border-0 first:border-t hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className="font-sans font-semibold text-base text-text-light dark:text-text-dark group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </span>
        {project.status && (
          <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 truncate">
            {project.status.split('·')[0].trim()}
          </span>
        )}
      </div>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-2 leading-snug">
        {project.description}
      </p>
    </div>
    <ArrowUpRight size={15} className="shrink-0 text-text-muted-light dark:text-text-muted-dark opacity-0 group-hover:opacity-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all -translate-x-1 group-hover:translate-x-0" />
  </button>
);

export default ProjectCard;
