import React, { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    className?: string;
    alt: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, className, alt, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => setLoaded(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (divRef.current) {
            observer.observe(divRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [src]);

    return (
        <div ref={divRef} className={`relative overflow-hidden ${className}`}>
            {/* Placeholder / Blur Effect */}
            <div
                className={`absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'
                    }`}
                aria-hidden="true"
            />

            {/* Actual Image */}
            <img
                {...props}
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${loaded ? 'blur-0 scale-100 opacity-100' : 'blur-xl scale-110 opacity-0'
                    }`}
            />
        </div>
    );
};

export default ProgressiveImage;
