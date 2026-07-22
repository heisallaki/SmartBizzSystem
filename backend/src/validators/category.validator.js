const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  description: z.string().trim().max(255).optional(),
  parentCategoryId: z.coerce.number().int().positive().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };