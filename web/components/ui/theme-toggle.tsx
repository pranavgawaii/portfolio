import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
    return (
        <motion.button
            onClick={onToggle}
            className="relative w-14 h-14 rounded-xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            }}
        >
            {/* Animated background glow */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: isDark
                        ? 'radial-gradient(circle at center, rgba(139, 92, 246, 0.8) 0%, transparent 70%)'
                        : 'radial-gradient(circle at center, rgba(251, 191, 36, 0.8) 0%, transparent 70%)',
                }}
            />

            {/* Icon container with 3D flip */}
            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ rotateY: -180, opacity: 0, scale: 0.5 }}
                            animate={{
                                rotateY: 0,
                                opacity: 1,
                                scale: 1,
                                rotate: [0, -10, 10, -10, 0],
                            }}
                            exit={{ rotateY: 180, opacity: 0, scale: 0.5 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.34, 1.56, 0.64, 1],
                                rotate: {
                                    duration: 0.8,
                                    ease: "easeInOut"
                                }
                            }}
                            className="absolute"
                        >
                            <motion.div
                                animate={{
                                    filter: [
                                        'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))',
                                        'drop-shadow(0 0 12px rgba(139, 92, 246, 1))',
                                        'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))',
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Moon size={24} className="text-white" strokeWidth={2.5} />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotateY: -180, opacity: 0, scale: 0.5 }}
                            animate={{
                                rotateY: 0,
                                opacity: 1,
                                scale: 1,
                                rotate: [0, 360],
                            }}
                            exit={{ rotateY: 180, opacity: 0, scale: 0.5 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.34, 1.56, 0.64, 1],
                                rotate: {
                                    duration: 0.8,
                                    ease: "easeOut"
                                }
                            }}
                            className="absolute"
                        >
                            <motion.div
                                animate={{
                                    filter: [
                                        'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                                        'drop-shadow(0 0 12px rgba(251, 191, 36, 1))',
                                        'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Sun size={24} className="text-white" strokeWidth={2.5} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Ripple effect on click */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                }}
            />
        </motion.button>
    );
};
