import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../_lib/mongodb.js', () => ({ getDb: vi.fn() }));
vi.mock('@clerk/backend', () => ({ verifyToken: vi.fn() }));

import { getDb } from '../_lib/mongodb.js';
import { verifyToken } from '@clerk/backend';
import handler from '../reactions.js';
import { createFakeDb, createMockRes, mockReq } from '../_lib/__tests__/testHelpers.js';

const authed = (userId) => {
  verifyToken.mockResolvedValue({ sub: userId });
  return { authorization: 'Bearer some-token' };
};

describe('api/reactions', () => {
  let db;

  beforeEach(() => {
    db = createFakeDb();
    getDb.mockResolvedValue(db);
    verifyToken.mockReset();
    verifyToken.mockRejectedValue(new Error('no token'));
  });

  it('GET on an unreacted post returns empty counts and myVotes', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'GET', query: { slug: 'p1' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ counts: {}, myVotes: [] });
  });

  it('POST without a valid session is rejected', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'p1' }, body: { emoji: 'like' } }), res);
    expect(res.statusCode).toBe(401);
  });

  it('signed-in POST toggles the vote on, then off again', async () => {
    const headers = authed('user-1');

    const resAdd = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'p1' }, body: { emoji: 'like' }, headers }), resAdd);
    expect(resAdd.body.counts.like).toBe(1);
    expect(resAdd.body.myVotes).toContain('like');

    const resRemove = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'p1' }, body: { emoji: 'like' }, headers }), resRemove);
    expect(resRemove.body.counts.like).toBe(0);
    expect(resRemove.body.myVotes).not.toContain('like');
  });

  it('two different users voting the same emoji both count', async () => {
    const resA = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'p2' }, body: { emoji: 'fire' }, headers: authed('user-a') }), resA);
    const resB = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'p2' }, body: { emoji: 'fire' }, headers: authed('user-b') }), resB);
    expect(resB.body.counts.fire).toBe(2);
  });

  it('rate-limits after too many reactions from the same user', async () => {
    const headers = authed('spammer');
    for (let i = 0; i < 30; i++) {
      const res = createMockRes();
      await handler(mockReq({ method: 'POST', query: { slug: `rl-${i}` }, body: { emoji: 'like' }, headers }), res);
      expect(res.statusCode).toBe(200);
    }
    const res = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'rl-final' }, body: { emoji: 'like' }, headers }), res);
    expect(res.statusCode).toBe(429);
  });
});
