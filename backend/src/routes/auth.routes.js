const { Router } = require("express");
const rateLimit = require("express-rate-limit");

const {
  postLogin,
  getProfile,
  postChangePassword,
  postLogout,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { loginSchema, changePasswordSchema } = require("../validators/auth.validator");

const router = Router();

// 10 attempts per 15 minutes per IP — generous enough for a real user who
// mistypes a password a couple of times, tight enough to blunt brute-force
// guessing. Needs `app.set("trust proxy", ...)` in app.js to read the real
// client IP correctly behind Render's proxy.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in a few minutes.",
  },
});

router.post("/login", loginLimiter, validate(loginSchema), postLogin);
router.get("/profile", requireAuth, getProfile);
router.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  postChangePassword
);
router.post("/logout", requireAuth, postLogout);

module.exports = router;