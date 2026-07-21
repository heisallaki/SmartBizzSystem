const authService = require("../services/auth.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const postLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({
    email,
    password,
    ipAddress: req.ip,
  });
  ApiResponse.ok(res, { user, token });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  ApiResponse.ok(res, user);
});

const postChangePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword({
    userId: req.user.id,
    currentPassword,
    newPassword,
    ipAddress: req.ip,
  });
  ApiResponse.ok(res, { message: "Password updated successfully." });
});

const postLogout = asyncHandler(async (req, res) => {
  await authService.logout({ userId: req.user?.id, ipAddress: req.ip });
  ApiResponse.ok(res, { message: "Logged out." });
});

module.exports = { postLogin, getProfile, postChangePassword, postLogout };