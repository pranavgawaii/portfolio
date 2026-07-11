import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

let cachedClient = globalThis._mongoClient;
let cachedDb = globalThis._mongoDb;

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, { maxPoolSize: 5 });
    globalThis._mongoClient = cachedClient;
  }
  await cachedClient.connect();
  cachedDb = cachedClient.db(dbName);
  globalThis._mongoDb = cachedDb;
  return cachedDb;
}
