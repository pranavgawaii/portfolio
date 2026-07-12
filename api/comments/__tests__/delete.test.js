import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../_lib/mongodb.js', () => ({ getDb: vi.fn() }));
vi.mock('@clerk/backend', () => ({ verifyToken: vi.fn() }));

import { getDb } from '../../_lib/mongodb.js';
import { verifyToken } from '@clerk/backend';
import { ADMIN_CLERK_ID } from '../../_lib/admin.js';
import commentsHandler from '../../comments.js';
import deleteHandler from '../delete.js';
import { createFakeDb, createMockRes, mockReq } from '../../_lib/__tests__/testHelpers.js';

describe('api/comments/delete', () => {
  let db;

  beforeEach(async () => {
    db = createFakeDb();
    getDb.mockResolvedValue(db);
    verifyToken.mockReset();
    verifyToken.mockRejectedValue(new Error('no token'));

    await commentsHandler(
      mockReq({ method: 'POST', query: { slug: 'p1' }, body: { author: 'Owner', text: 'mine', clerkUserId: 'owner-1' } }),
      createMockRes()
    );
  });

  async function getCommentId() {
    const res = createMockRes();
    await commentsHandler(mockReq({ method: 'GET', query: { slug: 'p1' } }), res);
    return res.body[0].id;
  }

  it('rejects delete with no session at all', async () => {
    const commentId = await getCommentId();
    const res = createMockRes();
    await deleteHandler(mockReq({ method: 'POST', body: { slug: 'p1', commentId } }), res);
    expect(res.statusCode).toBe(401);
  });

  it('a stranger cannot delete someone else\'s comment even by claiming their id', async () => {
    // Real (verified) identity is "stranger-1" — claiming clerkUserId in the
    // body should have no effect since the server no longer reads it.
    verifyToken.mockResolvedValue({ sub: 'stranger-1' });
    const commentId = await getCommentId();
    const res = createMockRes();
    await deleteHandler(
      mockReq({ method: 'POST', body: { slug: 'p1', commentId }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(200); // request succeeds, but...

    const check = createMockRes();
    await commentsHandler(mockReq({ method: 'GET', query: { slug: 'p1' } }), check);
    expect(check.body).toHaveLength(1); // ...the comment is still there, untouched
  });

  it('the verified owner can delete their own comment', async () => {
    verifyToken.mockResolvedValue({ sub: 'owner-1' });
    const commentId = await getCommentId();
    const res = createMockRes();
    await deleteHandler(
      mockReq({ method: 'POST', body: { slug: 'p1', commentId }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(200);

    const check = createMockRes();
    await commentsHandler(mockReq({ method: 'GET', query: { slug: 'p1' } }), check);
    expect(check.body).toHaveLength(0);
  });

  it('the verified admin can delete anyone\'s comment', async () => {
    verifyToken.mockResolvedValue({ sub: ADMIN_CLERK_ID });
    const commentId = await getCommentId();
    const res = createMockRes();
    await deleteHandler(
      mockReq({ method: 'POST', body: { slug: 'p1', commentId }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(200);

    const check = createMockRes();
    await commentsHandler(mockReq({ method: 'GET', query: { slug: 'p1' } }), check);
    expect(check.body).toHaveLength(0);
  });
});
