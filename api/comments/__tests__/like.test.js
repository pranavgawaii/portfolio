import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../_lib/mongodb.js', () => ({ getDb: vi.fn() }));
vi.mock('@clerk/backend', () => ({ verifyToken: vi.fn() }));

import { getDb } from '../../_lib/mongodb.js';
import { verifyToken } from '@clerk/backend';
import commentsHandler from '../../comments.js';
import likeHandler from '../like.js';
import { createFakeDb, createMockRes, mockReq } from '../../_lib/__tests__/testHelpers.js';

describe('api/comments/like', () => {
  let db;

  beforeEach(async () => {
    db = createFakeDb();
    getDb.mockResolvedValue(db);
    verifyToken.mockReset();
    verifyToken.mockRejectedValue(new Error('no token'));

    // seed a real comment via the comments handler so the id is realistic
    await commentsHandler(
      mockReq({ method: 'POST', query: { slug: 'p1' }, body: { author: 'A', text: 'hi', clerkUserId: 'author-1' } }),
      createMockRes()
    );
  });

  async function getCommentId() {
    const res = createMockRes();
    await commentsHandler(mockReq({ method: 'GET', query: { slug: 'p1' } }), res);
    return res.body[0].id;
  }

  it('rejects liking without a valid session', async () => {
    const commentId = await getCommentId();
    const res = createMockRes();
    await likeHandler(mockReq({ method: 'POST', body: { slug: 'p1', commentId } }), res);
    expect(res.statusCode).toBe(401);
  });

  it('toggles a like on then off for a signed-in user', async () => {
    verifyToken.mockResolvedValue({ sub: 'liker-1' });
    const headers = { authorization: 'Bearer t' };
    const commentId = await getCommentId();

    const onRes = createMockRes();
    await likeHandler(mockReq({ method: 'POST', body: { slug: 'p1', commentId }, headers }), onRes);
    expect(onRes.body).toEqual({ liked: true, count: 1 });

    const offRes = createMockRes();
    await likeHandler(mockReq({ method: 'POST', body: { slug: 'p1', commentId }, headers }), offRes);
    expect(offRes.body).toEqual({ liked: false, count: 0 });
  });

  it('404s for a comment id that does not exist', async () => {
    verifyToken.mockResolvedValue({ sub: 'liker-1' });
    const res = createMockRes();
    await likeHandler(
      mockReq({ method: 'POST', body: { slug: 'p1', commentId: 'nonexistent' }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(404);
  });
});
