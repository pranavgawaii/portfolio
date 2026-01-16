import React, { useState, useCallback } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';

const GitHubActivitySection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [totalContributions, setTotalContributions] = useState<number>(0);

  // Custom theme colors matching user specification
  const theme = {
    light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  const handleTransformData = useCallback((data: Array<any>) => {
    const total = data.reduce((sum, day) => sum + day.count, 0);
    // Only update state if the value has changed to avoid infinite loops
    setTotalContributions(prev => prev !== total ? total : prev);
    return data;
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

      {/* Header Section matching specific design */}
      <div className="mb-4">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
          Featured
        </span>
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          GitHub Activity
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Total:</span>
            <strong className="text-neutral-900 dark:text-white">
              {totalContributions > 0 ? totalContributions.toLocaleString() : '...'} contributions
            </strong>
          </div>
          <div className="flex items-center gap-2">
            {/* Offline status removed as requested */}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-[#0d1117] rounded-xl border border-white/10 p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl">

        {/* Heatmap Container - flex center to ensure it looks 'fitted' */}
        <div className="flex justify-center w-full">
          <GitHubCalendar
            username="pranavgawaii"
            year={2025}
            colorScheme="dark"
            fontSize={12}
            blockSize={12}
            blockMargin={3}
            transformData={handleTransformData}
            style={{
              color: '#8b949e',
              width: '100%',
              maxWidth: '100%',
            }}
          />
        </div>

        {/* Custom Legend (Optional: Library has one but we can custom style it if needed. 
            For now, relying on library's legend but ensuring colors match via 'theme' prop ) */}
      </div>
    </section>
  );
};

export default GitHubActivitySection;
