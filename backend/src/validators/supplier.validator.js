const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const listSuppliersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["Active", "OnHold", "Inactive"]).optional(),
  sortBy: z.enum(["name", "totalOrders", "totalSpend", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const createSupplierSchema = z.object({
  name: z.string().trim().min(1, "Supplier name is required.").max(150),
  contactPerson: z.string().trim().min(1, "Contact person is required.").max(150),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().min(1, "Phone number is required.").max(30),
  category: z.string().trim().min(1, "Category is required.").max(100),
  addressLine: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  county: z.string().trim().max(100).optional(),
  taxNumber: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
  status: z.enum(["Active", "OnHold", "Inactive"]).default("Active"),
});

const updateSupplierSchema = createSupplierSchema.partial();

module.exports = { listSuppliersQuerySchema, createSupplierSchema, updateSupplierSchema };