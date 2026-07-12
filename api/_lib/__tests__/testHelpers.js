import { vi } from 'vitest';

function matches(doc, query) {
  return Object.entries(query).every(([k, v]) => doc[k] === v);
}

class FakeCollection {
  constructor() {
    this.docs = [];
  }
  async findOne(query) {
    return this.docs.find((d) => matches(d, query)) ?? null;
  }
  find(query = {}) {
    let results = this.docs.filter((d) => matches(d, query));
    const cursor = {
      sort(spec) {
        const [[field, dir]] = Object.entries(spec);
        results = [...results].sort((a, b) => (dir === -1 ? (b[field] > a[field] ? 1 : -1) : a[field] > b[field] ? 1 : -1));
        return cursor;
      },
      limit(n) {
        results = results.slice(0, n);
        return cursor;
      },
      async toArray() {
        return results;
      },
    };
    return cursor;
  }
  async insertOne(doc) {
    this.docs.push(doc);
    return { insertedId: doc._id };
  }
  async updateOne(query, update, options = {}) {
    let doc = this.docs.find((d) => matches(d, query));
    if (!doc) {
      if (!options.upsert) return { matchedCount: 0 };
      doc = { ...query };
      this.docs.push(doc);
    }
    if (update.$set) Object.assign(doc, update.$set);
    return { matchedCount: 1 };
  }
  async deleteOne(query) {
    const idx = this.docs.findIndex((d) => matches(d, query));
    if (idx === -1) return { deletedCount: 0 };
    this.docs.splice(idx, 1);
    return { deletedCount: 1 };
  }
  async countDocuments() {
    return this.docs.length;
  }
}

export function createFakeDb() {
  const collections = new Map();
  return {
    databaseName: 'fake',
    collection(name) {
      if (!collections.has(name)) collections.set(name, new FakeCollection());
      return collections.get(name);
    },
  };
}

export function createMockRes() {
  return {
    statusCode: 200,
    body: undefined,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
    },
    end() {},
  };
}

export function mockReq({ method = 'GET', query = {}, body = {}, headers = {} } = {}) {
  return { method, query, body, headers };
}

export const clerkBackendMock = { verifyToken: vi.fn() };
