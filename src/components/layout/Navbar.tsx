import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { id: 'home', label: 'home', targetId: 'home' },
        { id: 'experience', label: 'experience', targetId: 'experience' },
        { id: 'projects', label: 'projects', targetId: 'projects' },
        { id: 'blogs', label: 'blogs', targetId: 'blogs' },
    ];

    const handleScroll = (targetId: string) => {
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleTheme = (mode: string, e: React.MouseEvent) => {
        if (theme === mode) return;

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(mode);
            return;
        }

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // @ts-ignore
        const transition = document.startViewTransition(async () => {
            setTheme(mode);
            // Give a tiny bit of time for DOM to update
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    };

    if (!mounted) return null;

    return (
        <nav className="w-full max-w-content px-4 sm:px-6 py-6 sm:py-8 flex justify-between items-center z-50 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="flex space-x-3 sm:space-x-6 text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark relative overflow-x-auto no-scrollbar items-center">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleScroll(item.targetId)}
                        className="hover:text-text-light dark:hover:text-text-dark transition-colors lowercase relative group"
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </button>
                ))}
            </div>

            <div className="flex items-center border border-border-light dark:border-border-dark rounded-full p-1 bg-white/50 dark:bg-white/5 backdrop-blur-sm relative isolate shadow-sm">
                {['light', 'dark'].map((mode) => (
                    <button
                        key={mode}
                        className={`relative z-10 w-9 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${theme === mode ? 'text-text-light dark:text-text-dark' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light/70 dark:hover:text-text-dark/70'}`}
                        onClick={(e) => toggleTheme(mode, e)}
                    >
                        <span className="material-icons-outlined text-[18px]">
                            {mode === 'system' ? 'computer' : mode === 'light' ? 'light_mode' : 'dark_mode'}
                        </span>

                        {theme === mode && (
                            <motion.div
                                layoutId="premium-active-pill"
                                className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full -z-10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-border-light/50 dark:border-white/5"
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                    mass: 1
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
