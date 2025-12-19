import React from 'react';
import Section from './Section';

// Dummy heatmap for now, replace with your heatmap component if you have one
const GitHubHeatmap = () => (
  <div className="flex flex-col items-start">
    <span className="text-sm mb-1 text-black dark:text-neutral-400">Featured</span>
    <h3 className="text-2xl font-bold mb-1 text-black dark:text-white">GitHub Activity</h3>
    <span className="text-lg mb-4 text-black dark:text-neutral-300">Total: <span className="font-bold blur-sm">112</span> contributions</span>
    <img 
      src="/github-heatmap.png" 
      alt="GitHub contribution heatmap" 
      className="w-full max-w-3xl rounded-lg border border-neutral-800 mt-2 blur-sm"
    />
    <div className="w-full flex justify-center mt-2">
      <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium italic text-center">
        Consistent contributions since November... Focusing on consistency over streaks.
      </span>
    </div>
  </div>
);


const GitHubActivitySection = () => (
  <Section id="github-activity">
    <GitHubHeatmap />
  </Section>
);

export default GitHubActivitySection;
