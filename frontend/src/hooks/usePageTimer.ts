import { useEffect, useRef } from 'react';
import { trackBeacon } from './useAnalytics';

/**
 * Tracks time spent on a given path.
 * - On path change: fires page_leave for the previous path with elapsed duration.
 * - On tab close / navigate away: uses navigator.sendBeacon for reliability.
 * - Ignores durations < 3 seconds (bounces) and > 1 hour (stale open tabs).
 */
export function usePageTimer(path: string) {
  const startRef = useRef(Date.now());
  const pathRef  = useRef(path);

  // When path changes, flush the old page's duration
  useEffect(() => {
    const prevPath  = pathRef.current;
    const startTime = startRef.current;

    // Update refs for new page
    pathRef.current  = path;
    startRef.current = Date.now();

    // Fire for previous page on cleanup (i.e., when path changes)
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      if (duration >= 3 && duration <= 3600) {
        trackBeacon({ type: 'page_leave', path: prevPath, duration });
      }
    };
  }, [path]);

  // On tab close / hidden — beacon is the only reliable mechanism here
  useEffect(() => {
    const sendLeave = () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      if (duration < 3 || duration > 3600) return;
      trackBeacon({ type: 'page_leave', path: pathRef.current, duration });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendLeave();
    };

    window.addEventListener('beforeunload', sendLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', sendLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []); // mount/unmount only
}
