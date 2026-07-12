import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../_lib/mongodb.js', () => ({ getDb: vi.fn() }));
vi.mock('@clerk/backend', () => ({ verifyToken: vi.fn() }));

import { getDb } from '../_lib/mongodb.js';
import { verifyToken } from '@clerk/backend';
import { ADMIN_CLERK_ID } from '../_lib/admin.js';
import handler from '../comments.js';
import { createFakeDb, createMockRes, mockReq } from '../_lib/__tests__/testHelpers.js';

describe('api/comments', () => {
  let db;

  beforeEach(() => {
    db = createFakeDb();
    getDb.mockResolvedValue(db);
    verifyToken.mockReset();
    verifyToken.mockRejectedValue(new Error('no token in these tests unless configured'));
  });

  it('GET returns [] for a slug with no comments yet', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'GET', query: { slug: 'unknown-post' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST rejects missing required fields', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'POST', query: { slug: 'test' }, body: {} }), res);
    expect(res.statusCode).toBe(400);
  });

  it('POST rejects comments over the length cap', async () => {
    const res = createMockRes();
    await handler(
      mockReq({
        method: 'POST',
        query: { slug: 'test' },
        body: { author: 'A', text: 'x'.repeat(2001), clerkUserId: 'u1' },
      }),
      res
    );
    expect(res.statusCode).toBe(400);
  });

  it('POST never trusts a client-claimed isAdmin flag', async () => {
    const res = createMockRes();
    await handler(
      mockReq({
        method: 'POST',
        query: { slug: 'test' },
        body: { author: 'Fake Admin', text: 'hi', clerkUserId: 'random-user', isAdmin: true },
      }),
      res
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.isAdmin).toBe(false);
  });

  it('POST grants isAdmin only for a verified admin token', async () => {
    verifyToken.mockResolvedValue({ sub: ADMIN_CLERK_ID });
    const res = createMockRes();
    await handler(
      mockReq({
        method: 'POST',
        query: { slug: 'test' },
        body: { author: 'Pranav', text: 'hi', clerkUserId: ADMIN_CLERK_ID },
        headers: { authorization: 'Bearer admin-token' },
      }),
      res
    );
    expect(res.body.isAdmin).toBe(true);
  });

  it('GET reflects a comment posted moments earlier', async () => {
    await handler(
      mockReq({ method: 'POST', query: { slug: 'test' }, body: { author: 'A', text: 'hello', clerkUserId: 'u1' } }),
      createMockRes()
    );
    const res = createMockRes();
    await handler(mockReq({ method: 'GET', query: { slug: 'test' } }), res);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe('hello');
    expect(res.body[0].likedBy).toEqual([]);
  });

  it('rate-limits after too many posts from the same user in the window', async () => {
    for (let i = 0; i < 10; i++) {
      const res = createMockRes();
      await handler(
        mockReq({ method: 'POST', query: { slug: 'rl' }, body: { author: 'A', text: `msg ${i}`, clerkUserId: 'spammer' } }),
        res
      );
      expect(res.statusCode).toBe(200);
    }
    const res = createMockRes();
    await handler(
      mockReq({ method: 'POST', query: { slug: 'rl' }, body: { author: 'A', text: 'one too many', clerkUserId: 'spammer' } }),
      res
    );
    expect(res.statusCode).toBe(429);
  });
});
