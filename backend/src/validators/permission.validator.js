const { z } = require("zod");

const permissionMatrixRowSchema = z.object({
  module: z.string().trim().min(1),
  view: z.boolean(),
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
});

const updateRolePermissionsSchema = z.object({
  matrix: z.array(permissionMatrixRowSchema).min(1),
});

module.exports = { updateRolePermissionsSchema };