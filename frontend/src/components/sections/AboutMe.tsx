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

    <div className="space-y-2 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
      <p>
        I am a final year <span className="text-text-light dark:text-text-dark font-medium">B.Tech CSE (AI/ML)</span> student at MIT-ADT, Pune. My focus is on building and shipping <span className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-medium">AI-native products</span> that are production-ready tools rather than just prototypes.
      </p>
      <p>
        Currently, I am exploring Agentic AI and participating in hackathons to push the limits of what LLMs can do in real-world applications.
      </p>
      <p>
        I love fast-paced engineering, zero-to-one builds, and obsessive attention to UI details.
      </p>
    </div>
  </div>
);

export default AboutMe;
