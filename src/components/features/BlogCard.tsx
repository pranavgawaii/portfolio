import React from 'react';
import { motion } from 'framer-motion';

interface BlogCardProps {
    title: string;
    description: string;
    link: string;
    date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, description, link, date }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col -mx-3 rounded-2xl border border-transparent hover:border-border-light dark:hover:border-border-dark hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-500 overflow-hidden"
        >
            <div className="flex items-center justify-between py-6 px-4">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{date}</span>
                        <div className="h-px w-4 bg-border-light dark:bg-border-dark border-dashed opacity-40"></div>
                    </div>
                    <h4 className="font-display text-2xl text-text-light dark:text-text-dark group-hover:text-primary transition-colors inline-flex items-center gap-2">
                        {title}
                        <span className="material-icons-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 text-primary">call_made</span>
                    </h4>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-2 opacity-70 max-w-xl">
                        {description}
                    </p>
                </div>

                <div className="shrink-0 ml-4 hidden sm:block">
                    <div className="w-12 h-12 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <span className="material-icons-outlined text-[24px]">arrow_forward</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default BlogCard;
