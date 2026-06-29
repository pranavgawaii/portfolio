import React from 'react';

const AboutMe: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-7 items-start w-full">
    <div className="shrink-0">
      <div className="w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-border-light dark:ring-border-dark">
        <img
          src="/avatar.jpg"
          alt="Pranav Gawai"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-default"
        />
      </div>
    </div>

    <div className="space-y-3 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
      <p>
        Final year <span className="text-text-light dark:text-text-dark font-medium">B.Tech CSE (AI/ML)</span> student at MIT-ADT, Pune. I build and ship <span className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-medium">AI-native products</span> — not demos, real tools people can use.
      </p>
      <p>
        Currently at <span className="text-text-light dark:text-text-dark font-medium">CraftaStudio</span>, building a visual developer tool that generates full codebases from a block interface. I also compete in national hackathons and build side projects that usually turn into something more.
      </p>
      <p>
        Looking to join an early AI team where the product actually matters.
      </p>
    </div>
  </div>
);

export default AboutMe;
