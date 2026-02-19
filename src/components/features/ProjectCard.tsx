import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { Github, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectCardProps {
    project: ProjectItem;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="group flex flex-col -mx-3 rounded-2xl border border-transparent hover:border-border-light dark:hover:border-border-dark hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-500 overflow-hidden">
            <div className="flex items-center justify-between py-4 px-4 cursor-default">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={toggleExpand}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-all duration-300 ${isExpanded ? 'rotate-180 bg-primary/10 border-primary/20 text-primary' : ''}`}
                    >
                        <span className="material-icons-outlined text-[18px]">expand_more</span>
                    </button>

                    <div className="flex flex-col flex-1">
                        <h4
                            onClick={onClick}
                            className="font-display text-lg text-text-light dark:text-text-dark cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-2 group/title"
                        >
                            {project.title}
                            <span className="material-icons-outlined text-[14px] opacity-0 group-hover/title:opacity-100 transition-opacity text-primary">call_made</span>
                        </h4>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-1 opacity-70">
                            {project.techStack?.join(" • ")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-white dark:hover:bg-neutral-800 hover:text-text-light dark:hover:text-text-dark shadow-sm hover:shadow transition-all"
                            aria-label="View Source on GitHub"
                        >
                            <Github size={18} strokeWidth={1.5} />
                        </a>
                    )}
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-white dark:hover:bg-neutral-800 hover:text-primary shadow-sm hover:shadow transition-all group/link"
                            aria-label="View Live Project"
                        >
                            <Globe size={18} strokeWidth={1.5} className="group-hover/link:text-primary transition-colors" />
                        </a>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="px-12 pb-6">
                            <div className="pt-2 border-t border-border-light dark:border-border-dark border-dashed">
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack?.map((tech) => (
                                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark border border-border-light dark:border-border-dark">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectCard;
