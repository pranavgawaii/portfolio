import React from 'react';
import { ProjectItem } from '../../types/index';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
    project: ProjectItem;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group flex flex-col rounded-2xl border border-border-light dark:border-[#222222] bg-white dark:bg-[#0c0c0c] hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-md h-full"
        >
            {/* Image Container */}
            <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-neutral-100 dark:bg-[#111111] border-b border-border-light dark:border-[#222222]">
                {project.image ? (
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted-light dark:text-neutral-500">
                        <span className="text-sm font-medium">Image not available</span>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-text-light dark:text-white group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    {project.status && (
                        <p className="mt-1.5 text-sm font-medium text-text-muted-light dark:text-neutral-400">
                            {project.status}
                        </p>
                    )}
                </div>

                <p className="text-sm text-text-muted-light dark:text-neutral-400 mb-6 leading-relaxed flex-1">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.map((tech) => (
                        <span 
                            key={tech} 
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-neutral-100 dark:bg-[#1a1a1a] text-text-light dark:text-neutral-300 border border-transparent dark:border-[#333333]"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 mt-auto">
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-200 rounded-lg bg-text-light dark:bg-white text-background-light dark:text-black transition-colors text-sm font-semibold shadow-sm"
                            aria-label="View Source on GitHub"
                        >
                            <Github size={16} strokeWidth={2} />
                            Source
                        </a>
                    )}
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-200 rounded-lg bg-text-light dark:bg-white text-background-light dark:text-black transition-colors text-sm font-semibold shadow-sm"
                            aria-label="View Live Project"
                        >
                            <ExternalLink size={16} strokeWidth={2} />
                            Live
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
