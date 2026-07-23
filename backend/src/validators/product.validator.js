const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listProductsQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(["InStock", "LowStock", "OutOfStock"]).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["name", "price", "stock", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const createProductSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required.").max(50),
  name: z.string().trim().min(1, "Name is required.").max(200),
  categoryId: z.coerce.number().int().positive().optional(),
  supplierId: z.coerce.number().int().positive().optional(),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().nonnegative("Price can't be negative."),
  costPrice: z.coerce.number().nonnegative().default(0),
  stock: z.coerce.number().int().nonnegative().default(0),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(10),
  isActive: z.coerce.boolean().default(true),
});

// stock is intentionally excluded — see product.service.js adjustStock().
const updateProductSchema = createProductSchema.partial().omit({ stock: true });

const adjustStockSchema = z.object({
  quantityChange: z.coerce
    .number()
    .int()
    .refine((v) => v !== 0, "Quantity change can't be zero."),
  movementType: z.enum(["Restock", "Adjustment", "Return", "VoidReversal"]),
  notes: z.string().trim().max(255).optional(),
});

// Bridge for the frontend's decrementStock()/incrementStock() batch calls —
// deliberately restricted to sale-lifecycle movement types only (never
// "Adjustment"), which is what lets this route stay open to any
// authenticated role instead of Admin/Manager-only.
const batchAdjustStockSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantityChange: z.coerce
          .number()
          .int()
          .refine((v) => v !== 0, "Quantity change can't be zero."),
      })
    )
    .min(1, "At least one item is required."),
  movementType: z.enum(["Sale", "Return", "VoidReversal"]),
});

module.exports = {
  paginationQuerySchema,
  listProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  adjustStockSchema,
  batchAdjustStockSchema,
};