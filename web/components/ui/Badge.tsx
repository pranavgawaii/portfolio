import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const baseStyles = "px-2 py-0.5 text-[10px] font-medium rounded border tracking-wide cursor-default transition-colors";
  
  const variants = {
    default: "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700",
    outline: "bg-transparent text-neutral-600 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:text-black dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700",
    secondary: "bg-neutral-50 dark:bg-[#111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;