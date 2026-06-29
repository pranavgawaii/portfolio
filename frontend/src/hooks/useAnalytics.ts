const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

type AnalyticsEvent =
  | { type: 'page_view'; path: string }
  | { type: 'blog_open'; slug: string; title: string }
  | { type: 'project_click'; projectId: string; projectName: string }
  | { type: 'askme_open' }
  | { type: 'contact_open' }
  | { type: 'resume_view' }
  | { type: 'share'; slug: string };

export function track(event: AnalyticsEvent) {
  fetch(`${API}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => {/* fire and forget — never throw */});
}
