import React, { useEffect, useState } from 'react';
import ProgressiveImage from '../ui/ProgressiveImage';
import { PROFILE } from '../../constants';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';

const AboutMe = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const profileImage = "/avatar.png";

    return (
        <section id="about" className="mb-20 scroll-mt-28">
            <h2 className="font-display text-2xl mb-8 text-text-light dark:text-text-dark flex items-center gap-2">
                biography <span className="text-text-muted-light dark:text-text-muted-dark opacity-40 font-mono text-lg">#</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                <div className="w-32 sm:w-40 md:w-40 shrink-0 mx-auto sm:mx-0">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-border-light dark:border-border-dark shadow-sm">
                        <ProgressiveImage
                            src={profileImage}
                            alt={PROFILE.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-4 sm:space-y-6 text-text-muted-light dark:text-text-muted-dark text-center sm:text-left">
                    <p className="text-base leading-relaxed font-sans first-letter:text-3xl first-letter:font-display first-letter:mr-1 first-letter:float-left">
                        {PROFILE.bio}
                    </p>
                </div>
            </div>
        </section>
    );
};

const TechBadge = ({ name, src }: { name: string; src: string }) => {
    return (
        <div className="relative group flex flex-col items-center justify-center">
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-10">
                <div className="bg-neutral-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg whitespace-nowrap relative shadow-xl">
                    {name}
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45"></div>
                </div>
            </div>

            {/* Icon */}
            <div className="w-8 h-8 transition-transform duration-300 group-hover:-translate-y-1 cursor-pointer">
                <img src={src} alt={name} className="w-full h-full object-contain" />
            </div>
        </div>
    );
};

export default AboutMe;
