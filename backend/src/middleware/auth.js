// this file just needs to exist so every other module can protect its
// routes with `requireAuth` from day one.

const jwt = require("jsonwebtoken");
const env = require("../config/env");
const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("./asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized("Missing or malformed authorization header.");
  }

  const payload = jwt.verify(token, env.jwt.secret); // throws JsonWebTokenError / TokenExpiredError -> handled by errorHandler

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { role: true },
  });

  if (!user || user.deletedAt) {
    throw ApiError.unauthorized("Account no longer exists.");
  }
  if (user.status === "Suspended") {
    throw ApiError.forbidden("This account has been suspended.");
  }

  req.user = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role.name,
  };

  next();
});

// Usage: router.delete("/:id", requireAuth, requireRole("Admin", "Manager"), controller)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("You don't have permission to do that."));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };