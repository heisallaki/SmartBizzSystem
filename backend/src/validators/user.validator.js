const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listUsersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  roleId: z.coerce.number().int().positive().optional(),
  status: z.enum(["Active", "Suspended", "Invited"]).optional(),
  sortBy: z.enum(["fullName", "email", "createdAt", "lastLoginAt"]).default("fullName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(150),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().max(30).optional(),
  roleId: z.coerce.number().int().positive("Select a role."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
  status: z.enum(["Active", "Suspended", "Invited"]).default("Active"),
});

// No `password` field here on purpose — see resetPasswordSchema below.
const updateUserSchema = z.object({
  fullName: z.string().trim().min(1).max(150).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  phone: z.string().trim().max(30).optional(),
  avatarUrl: z.string().trim().url().max(500).optional(),
  roleId: z.coerce.number().int().positive().optional(),
  status: z.enum(["Active", "Suspended", "Invited"]).optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters.").optional(),
});

module.exports = {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
};