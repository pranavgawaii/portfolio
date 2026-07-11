import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'portfolio';

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  // Return cached db if connection is still alive
  if (cachedDb && cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 });
      return cachedDb;
    } catch {
      // Connection stale, reconnect
      cachedClient = null;
      cachedDb = null;
    }
  }

  if (!uri) throw new Error('MONGODB_URI is not set');

  cachedClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    connectTimeoutMS: 10000,
    tls: true,
    tlsAllowInvalidCertificates: false,
  });

  await cachedClient.connect();
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}
