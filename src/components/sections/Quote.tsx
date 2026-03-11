import React from 'react';

const Quote: React.FC = () => {
    return (
        <div className="relative w-full min-h-[160px] sm:min-h-[180px] my-16 sm:my-24 overflow-hidden rounded-2xl border border-dashed border-border-light dark:border-border-dark p-6 sm:p-8 group flex items-center">
            <div className="relative z-10 max-w-sm sm:max-w-lg pr-20 sm:pr-32">
                <span className="font-display text-xl sm:text-2xl italic text-text-light dark:text-text-dark leading-tight block mb-3 sm:mb-4">
                    “You don’t get what you wish for, you get what you work for.”
                </span>
                <div className="text-xs sm:text-sm text-text-muted-light dark:text-text-dark font-mono italic opacity-80 sm:opacity-100">
                    — Virat Kohli
                </div>
            </div>
            <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end pointer-events-none rounded-r-2xl">
                <img
                    src="/vk_isolated.png"
                    alt="Virat Kohli"
                    className="h-full w-auto object-contain opacity-50 sm:opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 mix-blend-lighten object-right-bottom"
                    style={{
                        maskImage: 'linear-gradient(to top, black 80%, transparent 100%), linear-gradient(to left, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%), linear-gradient(to left, black 80%, transparent 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in'
                    }}
                />
            </div>
        </div>
    );
};

export default Quote;
