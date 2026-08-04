const permissionService = require("../services/permission.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionService.listPermissions();
  ApiResponse.ok(res, permissions);
});

const getRoleMatrix = asyncHandler(async (req, res) => {
  const matrix = await permissionService.getRolePermissionMatrix(Number(req.params.roleId));
  ApiResponse.ok(res, matrix);
});

const putRoleMatrix = asyncHandler(async (req, res) => {
  const matrix = await permissionService.updateRolePermissionMatrix(
    Number(req.params.roleId),
    req.body.matrix,
    req.user.id
  );
  ApiResponse.ok(res, matrix);
});

module.exports = { getPermissions, getRoleMatrix, putRoleMatrix };