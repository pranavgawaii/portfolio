import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../_lib/mongodb.js', () => ({ getDb: vi.fn() }));
vi.mock('@clerk/backend', () => ({ verifyToken: vi.fn() }));

import { getDb } from '../_lib/mongodb.js';
import { verifyToken } from '@clerk/backend';
import { ADMIN_CLERK_ID } from '../_lib/admin.js';
import handler from '../dsa-progress.js';
import { createFakeDb, createMockRes, mockReq } from '../_lib/__tests__/testHelpers.js';

describe('api/dsa-progress', () => {
  let db;

  beforeEach(() => {
    db = createFakeDb();
    getDb.mockResolvedValue(db);
    verifyToken.mockReset();
    verifyToken.mockRejectedValue(new Error('no token'));
  });

  it('GET is public and starts empty', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ solvedIds: [], updatedAt: null });
  });

  it('POST is rejected for a signed-out visitor', async () => {
    const res = createMockRes();
    await handler(mockReq({ method: 'POST', body: { solvedIds: ['two-sum'] } }), res);
    expect(res.statusCode).toBe(403);
  });

  it('POST is rejected for a signed-in non-admin user', async () => {
    verifyToken.mockResolvedValue({ sub: 'some-random-user' });
    const res = createMockRes();
    await handler(
      mockReq({ method: 'POST', body: { solvedIds: ['two-sum'] }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(403);
  });

  it('POST succeeds for the verified admin and GET reflects it', async () => {
    verifyToken.mockResolvedValue({ sub: ADMIN_CLERK_ID });
    const postRes = createMockRes();
    await handler(
      mockReq({ method: 'POST', body: { solvedIds: ['two-sum', 'reverse-linked-list'] }, headers: { authorization: 'Bearer t' } }),
      postRes
    );
    expect(postRes.statusCode).toBe(200);

    const getRes = createMockRes();
    await handler(mockReq({ method: 'GET' }), getRes);
    expect(getRes.body.solvedIds).toEqual(['two-sum', 'reverse-linked-list']);
  });

  it('POST rejects a non-array solvedIds payload', async () => {
    verifyToken.mockResolvedValue({ sub: ADMIN_CLERK_ID });
    const res = createMockRes();
    await handler(
      mockReq({ method: 'POST', body: { solvedIds: 'not-an-array' }, headers: { authorization: 'Bearer t' } }),
      res
    );
    expect(res.statusCode).toBe(400);
  });
});
