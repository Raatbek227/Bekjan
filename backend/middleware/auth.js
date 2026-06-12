import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    req.user = verifyAccessToken(token);
  } catch (error) {
    req.user = null;
  }

  return next();
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Insufficient permissions"));
    }

    return next();
  };
}
