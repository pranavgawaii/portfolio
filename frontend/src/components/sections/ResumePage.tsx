import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'motion/react';

const ResumePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen pt-4 pb-24">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-[85vh]">
        
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div>
            <h1 className="font-sans font-bold text-3xl sm:text-[36px] text-neutral-900 dark:text-neutral-100 tracking-tight leading-none mb-1.5">
              Resume
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-[13px] sm:text-[14px] font-medium">
              A summary of my professional experience and skills.
            </p>
          </div>
          <a
            href="https://drive.google.com/uc?export=download&id=1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-[12px] shadow-sm hover:scale-105 transition-all duration-300"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </motion.div>
        
        {/* Document Viewer */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative"
        >
          <iframe 
            src="https://drive.google.com/file/d/1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi/preview" 
            className="w-full h-full border-0" 
            title="Resume" 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ResumePage;
