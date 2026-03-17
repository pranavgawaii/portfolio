import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';

const Navbar: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
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

    const currentTheme = resolvedTheme || theme;

    return (
        <nav className="w-full max-w-content px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center z-50 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="flex space-x-3 sm:space-x-6 text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark relative items-center">
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

            <div className="flex items-center">
                <button
                    className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 outline-none shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 overflow-hidden"
                    style={{ viewTransitionName: 'none' }}
                    onClick={(e) => toggleTheme(currentTheme === 'dark' ? 'light' : 'dark', e)}
                    aria-label="Toggle theme"
                >
                    <span
                        className={`absolute flex transition-all duration-500 transform text-text-light dark:text-text-dark ${
                            currentTheme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'
                        }`}
                    >
                        <Moon size={18} />
                    </span>
                    <span
                        className={`absolute flex transition-all duration-500 transform text-text-light dark:text-text-dark ${
                            currentTheme === 'light' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
                        }`}
                    >
                        <Sun size={18} />
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
