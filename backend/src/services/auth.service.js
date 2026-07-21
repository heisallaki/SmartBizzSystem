// All the actual auth business logic lives here — controllers just call
// into this and translate the result into an HTTP response.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

function generateToken(userId) {
  return jwt.sign({ sub: userId }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role.name.toLowerCase(),
    status: user.status,
  };
}

async function login({ email, password, ipAddress }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  // Same generic message whether the email doesn't exist or the password
  // is wrong — don't give a guesser a way to enumerate valid accounts.
  if (!user || user.deletedAt) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  // Status checks happen *after* password verification — at this point
  // the caller has already proven they know the correct password, so a
  // more specific message here doesn't leak anything to an outside guesser.
  if (user.status === "Suspended") {
    throw ApiError.forbidden(
      "This account has been suspended. Contact your administrator."
    );
  }
  if (user.status === "Invited") {
    throw ApiError.forbidden(
      "This account hasn't been activated yet. Contact your administrator."
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await logAudit({
    userId: user.id,
    action: "user.login",
    entityType: "user",
    entityId: user.id,
    ipAddress,
  });

  const token = generateToken(user.id);

  return { user: toPublicUser(user), token };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user || user.deletedAt) {
    throw ApiError.notFound("User not found.");
  }

  return toPublicUser(user);
}

async function changePassword({ userId, currentPassword, newPassword, ipAddress }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.badRequest("Current password is incorrect.");
  }

  const passwordHash = await bcrypt.hash(newPassword, env.bcryptSaltRounds);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  await logAudit({
    userId,
    action: "user.password_change",
    entityType: "user",
    entityId: userId,
    ipAddress,
  });
}

async function logout({ userId, ipAddress }) {
  // Stateless JWT — there's no server-side session to tear down. This is
  // purely for the audit trail. If token revocation becomes necessary
  // later (e.g. "log out of all devices"), this is the place to write a
  // token/jti to a denylist.
  if (userId) {
    await logAudit({
      userId,
      action: "user.logout",
      entityType: "user",
      entityId: userId,
      ipAddress,
    });
  }
}

module.exports = {
  generateToken,
  toPublicUser,
  login,
  getProfile,
  changePassword,
  logout,
};