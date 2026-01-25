import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC<{ activeSection: string }> = ({ activeSection }) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const isManualClick = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync activeTab with activeSection when scrolling
    useEffect(() => {
        if (activeSection && !isManualClick.current) {
            setActiveTab(activeSection);
        }

        if (isManualClick.current) {
            const timeout = setTimeout(() => {
                isManualClick.current = false;
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [activeSection]);

    const isDark = resolvedTheme === 'dark';

    const navItems = [
        { id: 'home', label: 'Home', targetId: 'home' },
        { id: 'experience', label: 'Work', targetId: 'experience' },
        { id: 'projects', label: 'Projects', targetId: 'projects' },
        { id: 'about', label: 'About', targetId: 'about-me' },
        { id: 'blogs', label: 'Blog', targetId: 'blogs' },
    ];

    const handleScroll = (targetId: string) => {
        isManualClick.current = true;
        setActiveTab(targetId);
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
                {navItems.map((item) => {
                    const isActive = activeTab === item.targetId || (activeTab === 'about-me' && item.id === 'about');

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleScroll(item.targetId)}
                            className={`
                                relative px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 rounded-full
                                ${isActive
                                    ? 'text-black dark:text-white'
                                    : 'text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white'
                                }
                            `}
                        >
                            <span className="relative z-10">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-pill-active"
                                    className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}

                {/* Vertical Divider */}
                <div className="w-[1px] h-4 bg-neutral-200 dark:border-neutral-800 mx-1" />

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors mr-1"
                    aria-label="Toggle Theme"
                >
                    <AnimatePresence mode='wait' initial={false}>
                        <motion.div
                            key={isDark ? 'dark' : 'light'}
                            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="text-neutral-600 dark:text-neutral-400"
                        >
                            {mounted && isDark ? <Moon size={15} /> : <Sun size={15} />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </nav>
        </div>
    );
};

export default Navbar;
