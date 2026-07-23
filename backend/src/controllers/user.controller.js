const userService = require("../services/user.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  ApiResponse.ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  ApiResponse.ok(res, user);
});

const postUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body, req.user.id);
  ApiResponse.created(res, result);
});

const patchUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(Number(req.params.id), req.body, req.user.id);
  ApiResponse.ok(res, user);
});

const deleteUserHandler = asyncHandler(async (req, res) => {
  await userService.deleteUser(Number(req.params.id), req.user.id);
  ApiResponse.noContent(res);
});

const postResetPassword = asyncHandler(async (req, res) => {
  const result = await userService.resetPassword(
    Number(req.params.id),
    req.body.newPassword,
    req.user.id
  );
  ApiResponse.ok(res, result);
});

const getRoles = asyncHandler(async (req, res) => {
  const roles = await userService.listRoles();
  ApiResponse.ok(res, roles);
});

module.exports = {
  getUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser: deleteUserHandler,
  postResetPassword,
  getRoles,
};