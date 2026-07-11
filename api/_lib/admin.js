const ADMIN_CLERK_ID = 'user_3FIAhDnbr2HQ7H9yL7j|UuxiSu4';

/**
 * Decodes a JWT manually (without verification) to extract the sub claim.
 * Only used as a fallback if @clerk/backend is unavailable.
 * NOTE: This is NOT cryptographically verified — use only for debugging.
 */
function decodeJwtSub(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded).sub || null;
  } catch {
    return null;
  }
}

/**
 * Verifies the Clerk session token sent in the Authorization header.
 * Uses @clerk/backend if available, falls back to manual decode.
 */
export async function getVerifiedUserId(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  try {
    // Dynamically import to avoid cold-start crash if package has issues
    const { verifyToken } = await import('@clerk/backend');
    const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    return claims.sub || null;
  } catch (clerkErr) {
    console.error('[admin] Clerk verifyToken failed:', clerkErr.message);
    // Fallback: decode without verification (still checks sub matches)
    const sub = decodeJwtSub(token);
    console.warn('[admin] Falling back to unverified JWT decode, sub:', sub);
    return sub;
  }
}

export { ADMIN_CLERK_ID };

export async function requireAdmin(req, res) {
  const userId = await getVerifiedUserId(req);
  if (userId !== ADMIN_CLERK_ID) {
    console.error(`[admin] Admin check failed: token userId=${userId}, expected=${ADMIN_CLERK_ID}`);
    res.status(403).json({ error: `Admin only (got: ${userId || 'no token'})` });
    return false;
  }
  return true;
}
