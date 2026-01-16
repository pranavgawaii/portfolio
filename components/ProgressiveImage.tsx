import React, { useState, useEffect } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    className?: string;
    alt: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, className, alt, ...props }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
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
