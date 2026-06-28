import React from 'react';

const TECH_STACK = [
    { name: 'Arch Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg' },
    { name: 'TailwindCSS', icon: '/CSS3.png' }, // Using CSS3 as placeholder or need to download visual update
    { name: 'React', icon: '/React (1).png' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' }, // Dark mode friendly?
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Cloudflare', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'PostgreSQL', icon: '/PostgresSQL.png' },
];

const TechStack = () => {
    return (
        <div className="w-full relative overflow-hidden bg-white dark:bg-[#0d1117] border-y border-neutral-200 dark:border-white/5 py-6">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#0d1117] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#0d1117] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap">
                {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center gap-2 mx-8 text-neutral-600 dark:text-neutral-400 font-medium opacity-80 hover:opacity-100 transition-opacity"
                    >
                        {/* 
              Note: Using external URLs for devicons which might not load if offline/blocked.
              Ideally should use local assets or lucid icons if preferred.
              For now using CDN to match the variety in reference.
            */}
                        <img
                            src={tech.icon}
                            alt={tech.name}
                            className={`w-6 h-6 object-contain ${tech.name === 'Next.js' || tech.name === 'Express' || tech.name === 'Flask' ? 'dark:invert' : ''}`}
                            onError={(e) => {
                                // Fallback if image fails
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span>{tech.name}</span>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default TechStack;
