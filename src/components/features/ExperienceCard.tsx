import React from 'react';
import { ExperienceItem } from '../../types';

import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface ExperienceCardProps {
    experience: ExperienceItem;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
    return (
        <div className="group flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 mt-1 bg-white dark:bg-black border border-border-light dark:border-border-dark rounded-lg flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                {experience.logo ? (
                    <img alt={experience.company} className="w-6 h-6 rounded object-contain" src={experience.logo} />
                ) : (
                    <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-800" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-text-light dark:text-text-dark truncate">{experience.company}</h3>
                    <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark shrink-0">{experience.period}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-text-muted-light dark:text-text-muted-dark">
                    <div className="flex items-center gap-2">
                        <span>{experience.role}</span>
                        {experience.type === 'Current' && (
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0.5 rounded-full font-medium border border-green-200 dark:border-green-800">Currently Working</span>
                        )}
                    </div>
                    <span className="text-xs hidden sm:block">{experience.location}</span>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;
