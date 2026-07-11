import { verifyToken } from '@clerk/backend';

export const ADMIN_CLERK_ID = 'user_3Fncnt8BqkypDn2wAl3d13lWkMI';

/**
 * Verifies the Clerk session token sent in the Authorization header and
 * returns the verified user id, or null if missing/invalid. This never
 * trusts a client-supplied user id for admin checks.
 */
export async function getVerifiedUserId(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    return claims.sub || null;
  } catch {
    return null;
  }
}

export async function requireAdmin(req, res) {
  const userId = await getVerifiedUserId(req);
  if (userId !== ADMIN_CLERK_ID) {
    console.error(`Admin check failed: token userId=${userId}, expected=${ADMIN_CLERK_ID}`);
    res.status(403).json({ error: `Admin only (Your ID: ${userId || 'Invalid Token'})` });
    return false;
  }
  return true;
}
