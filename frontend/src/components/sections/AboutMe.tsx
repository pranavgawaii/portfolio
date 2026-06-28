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

    <div className="space-y-4 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
      <p>
        Pre-final year B.Tech CSE (AI/ML) at <span className="text-text-light dark:text-text-dark font-medium">MIT-ADT University, Pune</span>. I build AI-native products and compete in national hackathons. Currently at <span className="text-text-light dark:text-text-dark font-medium">CraftaStudio</span> shipping a developer tool that generates entire codebases through a visual block system.
      </p>
      <p>
        Also serving as <span className="text-text-light dark:text-text-dark font-medium">Placement Coordinator</span> at MIT-ADT, helping batchmates land good engineering roles. Looking to join an AI-first startup where I can work close to the product.
      </p>
    </div>
  </div>
);

export default AboutMe;
