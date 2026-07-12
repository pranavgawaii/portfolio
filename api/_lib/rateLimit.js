/**
 * Minimal MongoDB-backed rate limiter for serverless functions — no shared
 * in-memory state survives between invocations, so the request history has
 * to live somewhere durable. Fine at this project's traffic; if it ever
 * needs to scale, swap this collection for Upstash Redis or similar.
 */
export async function checkRateLimit(db, key, { windowMs, max }) {
  const col = db.collection('rate_limits');
  const now = Date.now();
  const doc = await col.findOne({ _id: key });
  const recent = (doc?.timestamps || []).filter((t) => now - t < windowMs);

  if (recent.length >= max) return false;

  recent.push(now);
  await col.updateOne({ _id: key }, { $set: { timestamps: recent } }, { upsert: true });
  return true;
}
