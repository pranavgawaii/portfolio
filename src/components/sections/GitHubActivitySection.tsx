import React, { useState, useCallback, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { ActivityCalendar } from 'react-activity-calendar';
import { Github } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    width="18"
    height="18"
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

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
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query { matchedUser(username: "pranavgawai") { submissionCalendar } }`
        })
      })
        .then(res => res.json())
        .then(data => {
          if (!data?.data?.matchedUser?.submissionCalendar) throw new Error('No data');
          const rawCalendar = JSON.parse(data.data.matchedUser.submissionCalendar);

          let maxCount = 0;
          const entries = Object.entries(rawCalendar).map(([timestamp, count]) => {
            const c = Number(count);
            if (isNaN(c)) return null;
            if (c > maxCount) maxCount = c;
            return { timestamp, count: c };
          }).filter(Boolean) as { timestamp: string; count: number }[];

          const transformedData = entries.map(({ timestamp, count }) => {
            const ts = parseInt(timestamp);
            if (isNaN(ts)) return null;
            const date = new Date(ts * 1000).toISOString().split('T')[0];
            return { date, count, level: calculateLevel(count, maxCount) };
          }).filter(Boolean) as { date: string; count: number; level: number }[];

          transformedData.sort((a, b) => a.date.localeCompare(b.date));
          setLeetcodeData(transformedData);
          setTotalLeetcodeContributions(transformedData.reduce((sum, item) => sum + item.count, 0));
        })
        .catch(err => console.error("Failed to fetch LeetCode data", err))
        .finally(() => setIsLoadingLeetcode(false));
    }
  }, [activeTab]);

  const currentData = activeTab === 'github' ? githubData : leetcodeData;
  const isLoading = activeTab === 'github' ? isLoadingGithub : isLoadingLeetcode;

  return (
    <section className="w-full mb-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-slate-400 dark:text-neutral-600 uppercase tracking-[0.2em] lowercase">
              {activeTab === 'github' ? 'github contributions' : 'leetcode submissions'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display text-neutral-900 dark:text-white">
                {activeTab === 'github'
                  ? (totalGithubContributions > 0 ? totalGithubContributions.toLocaleString() : '0')
                  : (totalLeetcodeContributions > 0 ? totalLeetcodeContributions.toLocaleString() : '0')}
              </span>
              <span className="text-slate-400 dark:text-neutral-600 font-sans text-sm lowercase">
                {activeTab === 'github' ? 'total commits' : 'total solved'}
              </span>
            </div>
          </div>

          <div className="flex border dark:border-neutral-800 rounded-lg p-1 bg-white dark:bg-neutral-900 shadow-sm">
            <button
              onClick={() => setActiveTab('github')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all",
                activeTab === 'github'
                  ? "bg-slate-100 dark:bg-neutral-800 text-blue-500"
                  : "text-slate-400 dark:text-neutral-600 hover:text-slate-600 dark:hover:text-neutral-400"
              )}
            >
              github
            </button>
            <button
              onClick={() => setActiveTab('leetcode')}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all",
                activeTab === 'leetcode'
                  ? "bg-slate-100 dark:bg-neutral-800 text-orange-500"
                  : "text-slate-400 dark:text-neutral-600 hover:text-slate-600 dark:hover:text-neutral-400"
              )}
            >
              leetcode
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
              <div className="flex w-full justify-end pr-4 text-xs text-neutral-500 mt-3 gap-2 items-center select-none">
                <span>Less</span>
                <div className="flex items-center gap-[3px]">
                  {(() => {
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
              </div>
            </div>
          )}
        </motion.div>


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
      </div>
    </section>
  );
};

export default GitHubActivitySection;
