import React, { useEffect, useState } from 'react';
import { PROFILE } from '../constants';
import { useTheme } from 'next-themes';

const AboutMe = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileImage = mounted && resolvedTheme === 'light' ? '/coollight.png' : '/cooldark.png';

  return (
    <section id="about-me" className="max-w-3xl mx-auto px-4 mt-24 mb-20 scroll-mt-28">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          <span className="text-neutral-500">About</span> Me
        </h2>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Image Section */}
        <div className="w-full md:w-32 md:h-32 flex-shrink-0">
          <div className="w-full h-full aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 relative">
            <img
              src={profileImage}
              alt={PROFILE.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
            {PROFILE.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            I'm a Full Stack web developer and AI enthusiast. I love building scalable products and solving real-world problems with code. Specialized in React, Node.js, and Modern Web Technologies.
          </p>

          <div>
            <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-500 mb-3">
              Skills
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <TechBadge name="React" src="/React (1).png" />
              <TechBadge name="JavaScript" src="/JavaScript.png" />
              <TechBadge name="TypeScript" src="/TypeScript.png" />
              <TechBadge name="HTML5" src="/HTML5.png" />
              <TechBadge name="CSS3" src="/CSS3.png" />
              <TechBadge name="Java" src="/Java.png" />
              <TechBadge name="MongoDB" src="/MongoDB.png" />
              <TechBadge name="PostgreSQL" src="/PostgresSQL.png" />
            </div>
          </div>
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
