import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const db = await getDb();
  const cacheCol = db.collection('leetcode_cache');
  const cached = await cacheCol.findOne({ _id: 'submission_calendar' });
  const now = Date.now();

  if (cached && now - new Date(cached.timestamp).getTime() < CACHE_DURATION) {
    res.status(200).json(cached.data);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { matchedUser(username: "pranavgawai") { submissionCalendar } }`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`LeetCode API returned status: ${response.status}`);

    const data = await response.json();
    if (!data.data || !data.data.matchedUser) throw new Error('User not found or invalid data structure');

    const submissionCalendar = JSON.parse(data.data.matchedUser.submissionCalendar);

    await cacheCol.updateOne(
      { _id: 'submission_calendar' },
      { $set: { data: submissionCalendar, timestamp: new Date().toISOString() } },
      { upsert: true }
    );

    res.status(200).json(submissionCalendar);
  } catch (error) {
    console.error('Error in /api/leetcode:', error);
    if (cached?.data) {
      res.status(200).json(cached.data);
      return;
    }
    res.status(500).json({ error: 'Failed to fetch LeetCode data', details: error.message });
  }
}
