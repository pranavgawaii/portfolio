import React from 'react';
import { LeadershipItem } from '../../types';
import { Award, Briefcase, GraduationCap, Medal, Star } from 'lucide-react';

interface LeadershipCardProps {
    item: LeadershipItem;
}

const LeadershipCard: React.FC<LeadershipCardProps> = ({ item }) => {
    const getIcon = () => {
        switch (item.category) {
            case 'award':
                return <Medal size={16} className="text-primary" />;
            case 'role':
                return <Briefcase size={16} className="text-primary" />;
            case 'certification':
                return <GraduationCap size={16} className="text-primary" />;
            default:
                return <Star size={16} className="text-primary" />;
        }
    };

    const getCategoryLabel = () => {
        switch (item.category) {
            case 'award':
                return 'Award';
            case 'role':
                return 'Role';
            case 'certification':
                return 'Certification';
            default:
                return '';
        }
    };

    return (
        <div className="group relative p-5 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-border-light dark:hover:border-border-dark/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/5 group-hover:bg-primary/20 dark:group-hover:bg-primary/10 transition-colors">
                        {getIcon()}
                    </div>
                    <h3 className="font-semibold text-text-light dark:text-text-dark tracking-tight">{item.title}</h3>
                </div>
                <span className="text-[10px] font-mono font-medium text-text-muted-light dark:text-text-muted-dark opacity-60 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {getCategoryLabel()}
                </span>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark pl-9 font-medium leading-snug">{item.role}</p>
            {item.description && (
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark pl-9 mt-2 opacity-70 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            )}
        </div>
    );
};

export default LeadershipCard;
