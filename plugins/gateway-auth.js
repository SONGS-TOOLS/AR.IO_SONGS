/**
 * SONGS Protocol - Token-Gated Access Gateway Plugin for AR.IO
 *
 * This middleware verifies signed access tokens for protected Arweave content.
 * It should be configured in the AR.IO gateway's plugin configuration.
 */

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verify = promisify(jwt.verify);
const Redis = require("ioredis");

// Initialize Redis for nonce tracking and rate limiting
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("⚠️ JWT_SECRET environment variable is required");
  process.exit(1);
}

// Token expiration time in seconds (5 minutes by default)
const TOKEN_TTL = parseInt(process.env.TOKEN_TTL || "300", 10);

/**
 * Verify signature using public key recovery
 * @param {string} message - The message that was signed
 * @param {string} signature - The signature to verify
 * @param {string} address - The wallet address of the signer
 * @returns {boolean} True if signature is valid
 */
async function verifySignature(message, signature, address) {
  try {
    // Implementation will depend on the specific wallet/signature scheme
    // This is a placeholder for EIP-712 or similar verification
    return true; // Replace with actual verification
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Check if a nonce has been used already
 * @param {string} nonce - The nonce to check
 * @returns {Promise<boolean>} True if nonce is still valid
 */
async function checkNonce(nonce) {
  const exists = await redis.exists(`nonce:${nonce}`);
  if (exists) return false;

  await redis.set(`nonce:${nonce}`, "1", "EX", TOKEN_TTL);
  return true;
}

/**
 * Increment rate limit counter and check if exceeded
 * @param {string} wallet - The wallet address to rate limit
 * @returns {Promise<boolean>} True if rate limit is not exceeded
 */
async function checkRateLimit(wallet) {
  const key = `ratelimit:${wallet}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }

  return count <= 100; // 100 requests per minute
}

/**
 * Log access attempt for analytics
 * @param {object} req - Express request object
 * @param {boolean} allowed - Whether access was allowed
 */
async function logAccess(req, allowed) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      txId: req.params.txid,
      wallet: req.query.wallet,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      allowed,
    };

    // In production, send to analytics pipeline
    // For now, just log to console
    if (process.env.NODE_ENV === "production") {
      await redis.xadd(
        "stream:access_logs",
        "*",
        "data",
        JSON.stringify(logEntry)
      );
    } else {
      console.log("Access log:", logEntry);
    }
  } catch (error) {
    console.error("Error logging access:", error);
  }
}

/**
 * AR.IO gateway middleware for token-gated access
 */
module.exports = async (req, res, next) => {
  // Check if this is a protected route requiring authentication
  // We only apply auth to audio files in the /protected/ path
  if (!req.path.includes("/protected/")) {
    return next();
  }

  const { token, wallet } = req.query;

  // Basic validation
  if (!token || !wallet) {
    await logAccess(req, false);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing access token or wallet address",
    });
  }

  try {
    // Verify JWT token
    const decoded = await verify(token, JWT_SECRET);

    // Check token has not expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired");
    }

    // Verify wallet matches
    if (decoded.wallet.toLowerCase() !== wallet.toLowerCase()) {
      throw new Error("Token wallet mismatch");
    }

    // Verify transaction ID matches
    if (decoded.txId !== req.params.txid) {
      throw new Error("Token txId mismatch");
    }

    // Check nonce has not been used before
    if (!(await checkNonce(decoded.nonce))) {
      throw new Error("Nonce already used");
    }

    // Check rate limit
    if (!(await checkRateLimit(wallet))) {
      throw new Error("Rate limit exceeded");
    }

    // Log successful access
    await logAccess(req, true);

    // All checks passed, allow the request
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    await logAccess(req, false);

    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired access token",
    });
  }
};
