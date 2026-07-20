import { API_BASE as API } from '../lib/api';

// ── Session ID ────────────────────────────────────────────────────────────────
function getOrCreateSession(): string {
  try {
    let id = sessionStorage.getItem('_pg_sid');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_pg_sid', id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

// ── Event Types ───────────────────────────────────────────────────────────────
export type AnalyticsEvent =
  | { type: 'page_view'; path: string }
  | { type: 'blog_open'; slug: string; title: string }
  | { type: 'project_click'; projectId: string; projectName: string }
  | { type: 'askme_open' }
  | { type: 'contact_open' }
  | { type: 'resume_view' }
  | { type: 'resume_download' }
  | { type: 'share'; slug: string }
  | { type: 'page_leave'; path: string; duration: number }
  | { type: 'scroll_depth'; slug: string; depth: 25 | 50 | 75 | 100 }
  | { type: 'external_click'; url: string; domain: string }
  | { type: 'utm_source'; source: string; path: string };

// ── Core tracker ─────────────────────────────────────────────────────────────
export function track(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && localStorage.getItem('admin_opt_out') === 'true') return;
  const payload = { ...event, sessionId: getOrCreateSession() };
  fetch(`${API}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {/* fire and forget — never throw */});
}

// ── Beacon variant (for use in beforeunload / visibilitychange) ───────────────
export function trackBeacon(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && localStorage.getItem('admin_opt_out') === 'true') return;
  if (!navigator.sendBeacon) { track(event); return; }
  const payload = JSON.stringify({ ...event, sessionId: getOrCreateSession() });
  navigator.sendBeacon(`${API}/api/analytics/track`, new Blob([payload], { type: 'application/json' }));
}
