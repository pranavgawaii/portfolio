import React, { useState } from 'react';
import { motion } from 'motion/react';

const QUOTES = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code a computer understands. Good programmers write code humans understand.", author: "Martin Fowler" },
];

const QuotesCTA: React.FC = () => {
  const [idx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const q = QUOTES[idx];

  return (
  <section className="w-full flex justify-center px-4 sm:px-6 pt-16 pb-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-3xl rounded-xl border border-border-light dark:border-neutral-800 bg-neutral-50 dark:bg-transparent px-8 sm:px-12 py-12 shadow-sm"
    >
      <div className="relative z-10 flex flex-col items-center gap-6 text-center mx-auto">
        <p className="font-mono italic text-base sm:text-lg text-text-muted-light dark:text-neutral-400 max-w-xl leading-relaxed">
          "{q.text}"
        </p>
        <div className="shrink-0 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
          <p className="font-sans font-medium text-xs tracking-widest uppercase text-text-muted-light dark:text-neutral-500">
            {q.author}
          </p>
          <div className="w-6 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>
      
      {/* Top Left Quote Icon */}
      <svg className="absolute top-6 left-6 w-12 h-12 text-neutral-200 dark:text-neutral-800 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      
      {/* Bottom Right Quote Icon */}
      <svg className="absolute bottom-6 right-6 w-12 h-12 text-neutral-200 dark:text-neutral-800 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
      </svg>
    </motion.div>
  </section>
  );
};

export default QuotesCTA;
