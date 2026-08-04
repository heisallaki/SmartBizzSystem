const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

const MODULES = [
  "Dashboard",
  "Inventory",
  "Sales",
  "Customers",
  "Invoices",
  "Suppliers",
  "Purchase Orders",
  "Expenses",
  "Reports",
  "Users",
  "Settings",
];

const ACTIONS = ["view", "create", "edit", "delete"];

function moduleSlug(moduleName) {
  return moduleName.toLowerCase().replace(/\s+/g, "-");
}

function permissionCode(moduleName, action) {
  return `${moduleSlug(moduleName)}.${action}`;
}

async function ensurePermissionsSeeded() {
  const existing = await prisma.permission.findMany({ select: { code: true } });
  const existingCodes = new Set(existing.map((permission) => permission.code));

  const missing = [];
  MODULES.forEach((moduleName) => {
    ACTIONS.forEach((action) => {
      const code = permissionCode(moduleName, action);
      if (!existingCodes.has(code)) {
        missing.push({
          code,
          module: moduleName,
          description: `${action} access to ${moduleName}`,
        });
      }
    });
  });

  if (missing.length > 0) {
    await prisma.permission.createMany({ data: missing, skipDuplicates: true });
  }
}

async function listPermissions() {
  await ensurePermissionsSeeded();
  return prisma.permission.findMany({ orderBy: [{ module: "asc" }, { code: "asc" }] });
}

async function getRolePermissionMatrix(roleId) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw ApiError.notFound("Role not found.");

  await ensurePermissionsSeeded();

  const [permissions, granted] = await Promise.all([
    prisma.permission.findMany({ orderBy: [{ module: "asc" }, { code: "asc" }] }),
    prisma.rolePermission.findMany({ where: { roleId }, select: { permissionId: true } }),
  ]);

  const grantedIds = new Set(granted.map((entry) => entry.permissionId));

  const byModule = new Map();
  permissions.forEach((permission) => {
    if (!byModule.has(permission.module)) {
      byModule.set(permission.module, { module: permission.module });
    }

    const action = permission.code.split(".").pop();
    byModule.get(permission.module)[action] = grantedIds.has(permission.id);
  });

  return MODULES.filter((moduleName) => byModule.has(moduleName)).map((moduleName) =>
    byModule.get(moduleName)
  );
}

async function updateRolePermissionMatrix(roleId, matrix, actorId) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw ApiError.notFound("Role not found.");

  await ensurePermissionsSeeded();

  const permissions = await prisma.permission.findMany();
  const permissionIdByCode = new Map(
    permissions.map((permission) => [permission.code, permission.id])
  );

  const grantedPermissionIds = [];
  matrix.forEach((row) => {
    ACTIONS.forEach((action) => {
      if (row[action]) {
        const code = permissionCode(row.module, action);
        const permissionId = permissionIdByCode.get(code);
        if (permissionId) grantedPermissionIds.push(permissionId);
      }
    });
  });

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: grantedPermissionIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    }),
  ]);

  await logAudit({
    userId: actorId,
    action: "role_permissions.updated",
    entityType: "role",
    entityId: roleId,
  });

  return getRolePermissionMatrix(roleId);
}

module.exports = {
  listPermissions,
  getRolePermissionMatrix,
  updateRolePermissionMatrix,
};