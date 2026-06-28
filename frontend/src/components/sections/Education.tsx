import React, { useState } from 'react';
import { EDUCATION } from '../../config/constants';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Education: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-0">
      <div className="divide-y divide-border-light dark:divide-border-dark border-t border-border-light dark:border-border-dark">
        {EDUCATION.map(edu => (
          <div key={edu.id}>
            <button
              onClick={() => setOpen(open === edu.id ? null : edu.id)}
              className="group w-full flex items-start justify-between gap-4 py-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-base text-text-light dark:text-text-dark mb-0.5">
                  {edu.institution}
                </p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {edu.degree}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 pt-0.5">
                <div className="text-right hidden sm:block">
                  {edu.period && (
                    <p className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark opacity-60 whitespace-nowrap">
                      {edu.period}
                    </p>
                  )}
                  {edu.location && (
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark opacity-40 whitespace-nowrap">
                      {edu.location}
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: open === edu.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-text-muted-light dark:text-text-muted-dark opacity-40 group-hover:opacity-80 transition-opacity"
                >
                  <ChevronDown size={15} />
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {open === edu.id && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">
                    {edu.details && (
                      <ul className="space-y-2">
                        {edu.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
