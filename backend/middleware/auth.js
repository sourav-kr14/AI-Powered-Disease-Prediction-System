const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "symptoscan_super_secret_jwt_key_2026_clinical";

/**
 * Strict authentication middleware. Rejects unauthenticated requests.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-auth-token"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Access denied. Please log in to continue.",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Session expired or invalid token. Please log in again.",
    });
  }
};

/**
 * Optional authentication middleware. Populates req.user if a valid token exists,
 * but allows guest users to proceed seamlessly.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-auth-token"];

  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    // Silently ignore invalid optional tokens
    req.user = null;
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
  JWT_SECRET,
};
