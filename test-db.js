import { getDb } from './api/_lib/mongodb.js';
async function test() {
  const db = await getDb();
  const summary = await db.collection('analytics').findOne({ _id: 'summary' });
  console.log(JSON.stringify(summary.utmSources || {}, null, 2));
  process.exit(0);
}
test();
