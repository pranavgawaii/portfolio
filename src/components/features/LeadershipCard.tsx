import React from 'react';
import { LeadershipItem } from '../../types';

import { Award, Star } from 'lucide-react';

interface LeadershipCardProps {
    item: LeadershipItem;
}

const LeadershipCard: React.FC<LeadershipCardProps> = ({ item }) => {
    return (
        <div className="group p-4 -mx-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-text-light dark:text-text-dark">{item.title}</h3>
                <span className="text-[10px] font-mono border border-dashed border-border-light dark:border-border-dark px-2 py-0.5 rounded-full uppercase text-primary">Award</span>
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{item.role}</p>
        </div>
    );
};

export default LeadershipCard;
