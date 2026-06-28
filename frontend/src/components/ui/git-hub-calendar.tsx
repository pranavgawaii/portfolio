"use client";

import React, { useState, useEffect } from "react";
import { format, subDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

export interface ContributionDay {
  date: string; // ISO date string (e.g., "2025-09-13")
  count: number;
}

export interface GitHubCalendarProps {
  data: ContributionDay[]; // Contribution data
  colors?: string[]; // Custom color scale (default: GitHub-like greens)
}

export const GitHubCalendar = ({ data, colors = ["#1a1a1a", "#9be9a8", "#40c463", "#30a14e", "#216e39"] }: GitHubCalendarProps) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const today = new Date();
  const startDate = subDays(today, 364); // One year back
  const weeks = 53;
  const daysInWeek = 7;

  // Process data prop
  useEffect(() => {
    setContributions(data.map((item) => ({ ...item, date: item.date })));
  }, [data]);

  // Get color based on contribution count
  const getColor = (count: number) => {
    if (count === 0) return colors[0];
    if (count === 1) return colors[1];
    if (count === 2) return colors[2];
    if (count === 3) return colors[3];
    return colors[4] || colors[colors.length - 1]; // Fallback to last color
  };

  // Render weeks
  const renderWeeks = () => {
    const weeksArray = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    for (let i = 0; i < weeks; i++) {
      const weekDays = eachDayOfInterval({
        start: currentWeekStart,
        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
      });

      weeksArray.push(
        <div key={i} className="flex flex-col gap-[3px] flex-1 min-w-0">
          {weekDays.map((day, index) => {
            const contribution = contributions.find((c) => isSameDay(new Date(c.date), day));
            const color = contribution ? getColor(contribution.count) : colors[0];

            return (
              <div
                key={index}
                className="w-full aspect-square rounded-[2px] min-w-[8px]"
                style={{ backgroundColor: color }}
                title={`${format(day, "PPP")}: ${contribution?.count || 0} contributions`}
              />
            );
          })}
        </div>
      );
      currentWeekStart = addDays(currentWeekStart, 7);
    }

    return weeksArray;
  };

  // Render month labels
  const renderMonthLabels = () => {
    const monthsRow = [];
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 0 });
    let lastMonth = -1;

    for (let i = 0; i < weeks; i++) {
      const month = currentWeekStart.getMonth();
      const monthName = format(currentWeekStart, "MMM");
      let isNewMonth = month !== lastMonth;

      // Prevent overlaps at the start of the calendar (first 3 weeks)
      if (isNewMonth && i < 3) {
        const week3Start = addDays(currentWeekStart, 21);
        if (week3Start.getMonth() !== month) {
          isNewMonth = false;
        }
      }

      monthsRow.push(
        <div key={i} className="relative flex-1 min-w-0 h-4">
          {isNewMonth && (
            <span className="absolute left-0 top-0 text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60 whitespace-nowrap">
              {monthName}
            </span>
          )}
        </div>
      );

      if (isNewMonth) {
        lastMonth = month;
      }
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    return monthsRow;
  };

  // Render day labels
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full">
      <div className="flex w-full overflow-hidden pb-4">
        <div className="flex flex-col gap-[3px] mt-6 mr-3">
          {dayLabels.map((day, index) => (
            <span key={index} className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-50 flex-1 flex items-center leading-none">
              {index % 2 === 1 ? day : ''}
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-[3px] w-full mb-2">{renderMonthLabels()}</div>
          <div className="flex gap-[3px] w-full">{renderWeeks()}</div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-1.5 text-[10px] font-mono items-center text-text-muted-light dark:text-text-muted-dark opacity-60">
        <span>Less</span>
        {colors.map((color, index) => (
          <div key={index} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
