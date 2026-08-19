const { Router } = require("express");
const {
  getUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser,
  postResetPassword,
} = require("../controllers/user.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
} = require("../validators/user.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/", validate(listUsersQuerySchema, "query"), getUsers);
router.get("/:id", getUser);
router.post("/", validate(createUserSchema), postUser);
router.patch("/:id", validate(updateUserSchema), patchUser);
router.delete("/:id", deleteUser);
router.post("/:id/reset-password", validate(resetPasswordSchema), postResetPassword);

module.exports = router;