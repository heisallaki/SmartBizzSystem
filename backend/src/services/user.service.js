const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = require("../config/prisma");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

function generateTempPassword() {
  // 12 random bytes -> base64url, trimmed to 16 chars — readable enough to
  // type or read aloud, random enough to be a safe one-time credential.
  return crypto.randomBytes(12).toString("base64url").slice(0, 16);
}

function toSafeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

async function assertRoleExists(roleId) {
  if (roleId === undefined) return;
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw ApiError.badRequest("Selected role does not exist.");
}

// Blocks an action that would leave zero Active Admins — e.g. demoting,
// suspending, or deleting the last one.
async function assertNotLastActiveAdmin(existingUser, { newRoleId, newStatus }) {
  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (!adminRole || existingUser.roleId !== adminRole.id) return; // wasn't an Admin to begin with

  const wouldLeaveAdminRole = newRoleId !== undefined && newRoleId !== adminRole.id;
  const wouldBecomeInactive = newStatus !== undefined && newStatus !== "Active";
  if (!wouldLeaveAdminRole && !wouldBecomeInactive) return;

  const activeAdminCount = await prisma.user.count({
    where: { roleId: adminRole.id, status: "Active", deletedAt: null },
  });

  if (activeAdminCount <= 1) {
    throw ApiError.badRequest(
      "This is the last active Admin account — promote another user to Admin first."
    );
  }
}

async function listUsers({ search, roleId, status, page, limit, sortBy, sortOrder }) {
  const where = {
    deletedAt: null,
    ...(roleId !== undefined && { roleId }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: { role: { select: { id: true, name: true } } },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(toSafeUser),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: { select: { id: true, name: true } } },
  });
  if (!user || user.deletedAt) throw ApiError.notFound("User not found.");
  return toSafeUser(user);
}

async function createUser(data, actorId) {
  await assertRoleExists(data.roleId);

  const plainPassword = data.password || generateTempPassword();
  const passwordHash = await bcrypt.hash(plainPassword, env.bcryptSaltRounds);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      roleId: data.roleId,
      status: data.status,
      passwordHash,
    },
    include: { role: { select: { id: true, name: true } } },
  });

  await logAudit({
    userId: actorId,
    action: "user.created",
    entityType: "user",
    entityId: user.id,
    metadata: { createdEmail: user.email, roleId: data.roleId },
  });

  // temporaryPassword only ever appears in this one response — it can't be
  // retrieved again, so the frontend needs to surface it immediately.
  return {
    user: toSafeUser(user),
    temporaryPassword: data.password ? undefined : plainPassword,
  };
}

async function updateUser(id, data, actorId) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) throw ApiError.notFound("User not found.");

  await assertRoleExists(data.roleId);

  const changingRoleOrStatus = data.roleId !== undefined || data.status !== undefined;

  if (id === actorId && changingRoleOrStatus) {
    throw ApiError.badRequest(
      "You can't change your own role or status — ask another Admin to do this."
    );
  }

  if (changingRoleOrStatus) {
    await assertNotLastActiveAdmin(existing, { newRoleId: data.roleId, newStatus: data.status });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: { select: { id: true, name: true } } },
  });

  await logAudit({
    userId: actorId,
    action: "user.updated",
    entityType: "user",
    entityId: id,
    metadata: { changedFields: Object.keys(data) },
  });

  return toSafeUser(user);
}

async function deleteUser(id, actorId) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) throw ApiError.notFound("User not found.");

  if (id === actorId) {
    throw ApiError.badRequest("You can't deactivate your own account.");
  }

  await assertNotLastActiveAdmin(existing, { newStatus: "Suspended" });

  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date(), status: "Suspended" },
  });

  await logAudit({
    userId: actorId,
    action: "user.deleted",
    entityType: "user",
    entityId: id,
  });
}

async function resetPassword(id, newPasswordInput, actorId) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) throw ApiError.notFound("User not found.");

  const plainPassword = newPasswordInput || generateTempPassword();
  const passwordHash = await bcrypt.hash(plainPassword, env.bcryptSaltRounds);

  await prisma.user.update({ where: { id }, data: { passwordHash } });

  await logAudit({
    userId: actorId,
    action: "user.password_reset",
    entityType: "user",
    entityId: id,
  });

  return { temporaryPassword: newPasswordInput ? undefined : plainPassword };
}

async function listRoles() {
  return prisma.role.findMany({ orderBy: { name: "asc" } });
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  listRoles,
};