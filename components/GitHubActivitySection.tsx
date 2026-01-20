import React, { useState, useCallback, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { ActivityCalendar } from 'react-activity-calendar';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const GitHubActivitySection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode'>('github');
  const [totalGithubContributions, setTotalGithubContributions] = useState<number>(0);
  const [leetcodeData, setLeetcodeData] = useState<Array<{ date: string; count: number; level: number }>>([]);
  const [githubData, setGithubData] = useState<any[]>([]); // New State
  const [totalLeetcodeContributions, setTotalLeetcodeContributions] = useState<number>(0);
  const [isLoadingLeetcode, setIsLoadingLeetcode] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(true); // New State

  // Custom theme colors matching user specification
  // Dark Mode: Dark gray to Neon Green
  // Light Mode: Light gray to Standard Green
  const theme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  };

  const handleTransformGithubData = useCallback((data: Array<any>) => {
    const total = data.reduce((sum, day) => sum + day.count, 0);
    setTotalGithubContributions(prev => prev !== total ? total : prev);
    return data;
  }, []);

  // Simple function to map count to level 0-4
  const calculateLevel = (count: number, max: number) => {
    if (count === 0) return 0;
    if (max === 0) return 0;
    const percentage = count / max;
    if (percentage <= 0.25) return 1;
    if (percentage <= 0.50) return 2;
    if (percentage <= 0.75) return 3;
    return 4;
  };

  useEffect(() => {
    // Fetch GitHub Data
    if (activeTab === 'github' && githubData.length === 0) {
      setIsLoadingGithub(true);
      fetch('https://github-contributions-api.jogruber.de/v4/pranavgawaii')
        .then(res => res.json())
        .then(data => {
          if (!data || !data.contributions) throw new Error('Invalid GitHub data');

          const flatData = data.contributions;
          setGithubData(flatData);

          // Calculate total for 2026 manually
          const sum2026 = flatData
            .filter((d: any) => d.date.startsWith('2026'))
            .reduce((acc: number, curr: any) => acc + curr.count, 0);
          setTotalGithubContributions(sum2026);
        })
        .catch(err => console.error("GitHub fetch error:", err))
        .finally(() => setIsLoadingGithub(false));
    }
    // Fetch LeetCode Data
    else if (activeTab === 'leetcode' && leetcodeData.length === 0) {
      setIsLoadingLeetcode(true);
      fetch('/api/leetcode')
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);

          // Convert timestamp keys to ISO date strings and find max count
          let maxCount = 0;
          if (!data || typeof data !== 'object') {
            console.error("Invalid Leetcode Data:", data);
            throw new Error('Invalid data format');
          }
          console.log("LeetCode Data Received:", data);

          const entries = Object.entries(data).map(([timestamp, count]) => {
            const c = Number(count);
            if (isNaN(c)) return null;
            if (c > maxCount) maxCount = c;
            return { timestamp, count: c };
          }).filter(entry => entry !== null) as { timestamp: string; count: number }[];

          const transformedData = entries.map(({ timestamp, count }) => {
            const ts = parseInt(timestamp);
            if (isNaN(ts)) return null;
            try {
              const date = new Date(ts * 1000).toISOString().split('T')[0];
              return {
                date,
                count,
                level: calculateLevel(count, maxCount)
              };
            } catch (e) {
              console.error("Calendar invalid date:", timestamp);
              return null;
            }
          }).filter(item => item !== null) as { date: string; count: number; level: number }[];

          transformedData.sort((a, b) => a.date.localeCompare(b.date));

          setLeetcodeData(transformedData);
          setTotalLeetcodeContributions(transformedData.reduce((sum, item) => sum + item.count, 0));
        })
        .catch(err => {
          console.error("Failed to fetch LeetCode data", err);
          setIsLoadingLeetcode(false);
        })
        .finally(() => setIsLoadingLeetcode(false));
    }
  }, [activeTab]);

  const currentData = activeTab === 'github' ? githubData : leetcodeData;
  const isLoading = activeTab === 'github' ? isLoadingGithub : isLoadingLeetcode;

  return (
    <section className="w-full mb-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

      <div className="flex flex-col gap-4 mb-6 px-1">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase font-mono">
              {activeTab === 'github' ? 'GitHub Activity' : 'LeetCode Activity'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl xs:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {activeTab === 'github'
                  ? (totalGithubContributions > 0 ? totalGithubContributions.toLocaleString() : '...')
                  : (totalLeetcodeContributions > 0 ? totalLeetcodeContributions.toLocaleString() : '...')}
              </span>
              <span className="text-neutral-500 font-medium text-lg">
                {activeTab === 'github' ? 'commits' : 'submissions'}
              </span>
            </div>
          </div>

          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('github')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300",
                activeTab === 'github'
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              GITHUB
            </button>
            <button
              onClick={() => setActiveTab('leetcode')}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-300",
                activeTab === 'leetcode'
                  ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              LEETCODE
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-transparent min-h-[150px]">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full overflow-hidden github-calendar-wrapper"
        >
          {isLoading ? (
            <div className="w-full h-[150px] flex items-center justify-center text-neutral-500 text-sm">
              Loading {activeTab === 'github' ? 'GitHub' : 'LeetCode'} data...
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex gap-2 w-full justify-center">

                {/* Heatmap Grid & Month Labels */}
                <div className="flex flex-col">
                  {/* Heatmap Grid containing Labels and Cells joined in columns */}
                  <div className="flex overflow-x-auto pb-2 w-full justify-start scrollbar-hide px-4">
                    <div className="flex gap-[2px] items-end w-max">
                      {(() => {
                        const columns = [];
                        let lastMonthLabelIdx = -10;

                        const today = new Date();
                        // Calendar Year View (Jan 1 - Dec 31)
                        const currentYear = 2026;
                        const jan1 = new Date(currentYear, 0, 1);
                        const dayOfWeekJan1 = jan1.getDay();

                        // Start from the Sunday of the week containing Jan 1
                        const gridStartSunday = new Date(jan1);
                        gridStartSunday.setDate(jan1.getDate() - dayOfWeekJan1);

                        for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
                          const weekStart = new Date(gridStartSunday);
                          weekStart.setDate(weekStart.getDate() + (weekIndex * 7));

                          // 1. Determine Label for this week
                          let monthName = "";
                          let hasFirstOfMonth = false;

                          for (let d = 0; d < 7; d++) {
                            const current = new Date(weekStart);
                            current.setDate(current.getDate() + d);
                            if (current.getDate() === 1) {
                              hasFirstOfMonth = true;
                              monthName = current.toLocaleString('default', { month: 'short' });
                              break;
                            }
                          }

                          const isTooClose = (weekIndex - lastMonthLabelIdx) < 2;
                          const isNewYear = hasFirstOfMonth && monthName === 'Jan' && weekIndex > 40;
                          const showLabel = (hasFirstOfMonth && !isTooClose) || isNewYear;

                          if (showLabel) {
                            lastMonthLabelIdx = weekIndex;
                          }

                          // 2. Build Cells
                          const cells = [];
                          for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                            const currentDate = new Date(weekStart);
                            currentDate.setDate(currentDate.getDate() + dayIndex);
                            const dateStr = currentDate.toISOString().split('T')[0];

                            const dayData = currentData.find(d => d.date === dateStr);
                            const level = dayData ? dayData.level : 0;
                            const count = dayData ? dayData.count : 0;

                            const themeColors = {
                              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                            };
                            const leetcodeColors = {
                              dark: ['#161b22', '#6b4000', '#ab6600', '#e68a00', '#ffa116'],
                              light: ['#ebedf0', '#ffe4b5', '#ffcc80', '#ffa94d', '#ff8c00'],
                            };

                            const activeTheme = activeTab === 'github' ? themeColors : leetcodeColors;
                            const colors = resolvedTheme === 'dark' ? activeTheme.dark : activeTheme.light;
                            const color = colors[level] || colors[0];

                            cells.push(
                              <div
                                key={dayIndex}
                                className="w-[9px] h-[9px] rounded-full transition-colors duration-200 hover:border hover:border-neutral-400"
                                style={{ backgroundColor: color }}
                                title={`${count} ${activeTab === 'github' ? 'commits' : 'submissions'} on ${dateStr}`}
                              />
                            );
                          }

                          columns.push(
                            <div key={weekIndex} className="flex flex-col gap-[2px]">
                              <div className="h-[15px] relative w-[9px]">
                                {showLabel && (
                                  <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 text-[9px] text-neutral-400 font-normal whitespace-nowrap">
                                    {monthName}
                                  </span>
                                )}
                              </div>
                              {cells}
                            </div>
                          );
                        }
                        return columns;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              < div className="flex w-full justify-end pr-4 text-xs text-neutral-500 mt-3 gap-2 items-center select-none" >
                <span>Less</span>
                <div className="flex items-center gap-[3px]">
                  {(() => {
                    const leetcodeTheme = {
                      dark: ['#161b22', '#6b4000', '#ab6600', '#e68a00', '#ffa116'],
                      light: ['#ebedf0', '#ffe4b5', '#ffcc80', '#ffa94d', '#ff8c00'],
                    };
                    const colors = resolvedTheme === 'dark' ? leetcodeTheme.dark : leetcodeTheme.light;
                    return colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-[9px] h-[9px] rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ));
                  })()}
                </div>
                <span>More</span>
              </div >
            </div >
          )}
        </motion.div >


        {/* Global style override for the dots to be circular and specific colors if theme prop fails */}
        <style>{`
          .github-calendar-wrapper svg {
            width: 100% !important;
            height: auto !important;
          }
          .github-calendar-wrapper rect {
            rx: 50%;   /* Makes them round circles */
            ry: 50%;
            shape-rendering: geometricPrecision; 
            outline: none;
          }
          /* Hide scrollbar for Chrome, Safari and Opera */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div >
    </section >
  );
};

export default GitHubActivitySection;
