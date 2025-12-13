import React, { useState } from 'react';
import { LeadershipItem } from '../types';

const LeadershipCard: React.FC<{ item: LeadershipItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group relative p-6 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden cursor-pointer`}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(v => !v)}
      aria-expanded={open}
    >
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 pr-4">
          {item.title}
        </h3>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wide">
          {item.role}
        </p>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${open ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
        >
          {item.description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadershipCard;
