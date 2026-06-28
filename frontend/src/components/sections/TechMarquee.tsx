import React from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../../config/constants';

const SKILL_MAP: Record<string, string> = {
  "Python": "python", 
  "TypeScript": "typescript", 
  "JavaScript": "javascript",
  "SQL": "sqlite", 
  "Next.js": "nextdotjs", 
  "React": "react", 
  "FastAPI": "fastapi",
  "Node.js": "nodedotjs", 
  "Tailwind CSS": "tailwindcss", 
  "PostgreSQL": "postgresql",
  "Supabase": "supabase", 
  "MongoDB": "mongodb", 
  "Redis": "redis",
  "Claude Haiku": "anthropic", 
  "OpenRouter": "openrouter", 
  "Groq": "groq",
  "pgvector": "postgresql", 
  "MCP": "anthropic", 
  "Vercel": "vercel",
  "Railway": "railway", 
  "Cloudflare R2": "cloudflare", 
  "Docker": "docker",
  "Git": "git", 
  "GitHub": "github", 
  "Prisma": "prisma",
  "BullMQ": "redis", 
  "Figma": "figma", 
  "Clerk": "clerk",
};

const Chip = ({ skill }: { skill: string }) => {
  const icon = SKILL_MAP[skill] || skill.toLowerCase().replace(/[\s.]+/g, '');
  const isInvertible = ["nextdotjs", "vercel", "github", "clerk", "openrouter", "prisma"].includes(icon);
  
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 border border-neutral-200/40 dark:border-white/[0.06] bg-neutral-50/40 dark:bg-white/[0.02] backdrop-blur-md rounded-xl shrink-0 transition-all duration-300 hover:border-neutral-300 dark:hover:border-white/[0.12] hover:bg-neutral-100/50 dark:hover:bg-white/[0.04] hover:scale-[1.02]">
      <img
        src={`https://cdn.simpleicons.org/${icon}`}
        alt={skill}
        onError={e => { (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/typescript'; }}
        className={`w-4 h-4 object-contain ${isInvertible ? 'dark:invert' : ''}`}
      />
      <span className="text-[13px] font-sans font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap tracking-wide">{skill}</span>
    </div>
  );
};

const Row = ({ skills, dir = 'left' }: { skills: string[]; dir?: 'left' | 'right' }) => {
  // To make CSS infinite scroll seamless, we duplicate the list enough times so it spans at least 200% width.
  const list = [...skills, ...skills, ...skills, ...skills];
  
  return (
    <div className="overflow-hidden py-1 w-full flex">
      <div className={`flex gap-3 whitespace-nowrap ${dir === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
        {list.map((s, i) => <Chip key={`${s}-${i}`} skill={s} />)}
      </div>
    </div>
  );
};

const TechMarquee: React.FC = () => {
  const row1 = PROFILE.skills.slice(0, 2).flatMap(s => s.skills);
  const row2 = PROFILE.skills.slice(2).flatMap(s => s.skills);

  return (
    <div>
      <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-light dark:text-text-dark mb-5 tracking-tight">
        Stack
      </h2>
      <div className="relative space-y-2.5">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background-light dark:from-[#050505] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background-light dark:from-[#050505] to-transparent z-10" />
        <Row skills={row1} dir="left" />
        <Row skills={row2} dir="right" />
      </div>
    </div>
  );
};

export default TechMarquee;
