/**
 * Fire-and-forget error logging to MongoDB — gives basic visibility into
 * production failures (via /api/health) without needing a third-party
 * error-tracking service. Never awaited from callers so a logging failure
 * can't slow down or break the actual error response.
 */
export function logError(db, route, err) {
  if (!db) return;
  db.collection('error_logs')
    .insertOne({
      route,
      message: err?.message || String(err),
      timestamp: new Date().toISOString(),
    })
    .catch(() => {});
}
