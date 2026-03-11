import React from 'react';
import { EDUCATION } from '../../config/constants';

const Education: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3">
            {EDUCATION.map((edu) => (
                <div
                    key={edu.id}
                    className="group relative p-5 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-border-light dark:hover:border-border-dark/50"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 mb-1">
                        <h3 className="font-semibold text-base text-text-light dark:text-text-dark tracking-tight leading-tight">
                            {edu.institution}
                        </h3>
                        {edu.period && (
                            <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark opacity-70 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                {edu.period}
                            </span>
                        )}
                    </div>
                    {edu.degree && (
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2 font-medium leading-snug">
                            {edu.degree}
                        </p>
                    )}
                    {edu.details && (
                        <div className="flex flex-col gap-1 mt-1">
                            {edu.details.map((detail, idx) => (
                                <div key={idx} className="flex items-center gap-2 group/item">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-90 group-hover:opacity-100 transition-opacity leading-snug">
                                        {detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Education;
