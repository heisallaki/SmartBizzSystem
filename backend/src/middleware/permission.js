const permissionService = require("../services/permission.service");

const CACHE_TTL_MS = 60000;

let grantsCache = null;
let grantsCacheLoadedAt = 0;

async function loadGrants() {
  await permissionService.ensureDefaultRoleGrantsSeeded();

  const rolePermissions = await permissionService.getAllRolePermissions();

  const grants = new Map();
  rolePermissions.forEach(({ roleName, code }) => {
    if (!grants.has(roleName)) grants.set(roleName, new Set());
    grants.get(roleName).add(code);
  });

  return grants;
}

async function getGrants() {
  const isStale = !grantsCache || Date.now() - grantsCacheLoadedAt > CACHE_TTL_MS;

  if (isStale) {
    grantsCache = await loadGrants();
    grantsCacheLoadedAt = Date.now();
  }

  return grantsCache;
}

function invalidateGrantsCache() {
  grantsCache = null;
}

function requirePermission(moduleName, action) {
  const code = permissionService.permissionCode(moduleName, action);

  return async (req, res, next) => {
    try {
      if (req.user?.role === "Admin") {
        return next();
      }

      const grants = await getGrants();
      const allowed = grants.get(req.user?.role)?.has(code) ?? false;

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { requirePermission, invalidateGrantsCache };