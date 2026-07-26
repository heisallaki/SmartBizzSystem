const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const PHONE_REGEX = /^(\+254|0)[17]\d{8}$/;

const listCustomersQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  city: z.string().trim().optional(),
  sortBy: z.enum(["firstName", "lastName", "totalSpent", "createdAt"]).default("lastName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const createCustomerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().regex(PHONE_REGEX, "Enter a valid Kenyan phone number."),
  company: z.string().trim().max(150).optional(),
  taxNumber: z.string().trim().max(50).optional(),
  addressLine: z.string().trim().min(1, "Street is required.").max(255),
  city: z.string().trim().min(1, "City is required.").max(100),
  county: z.string().trim().min(1, "County is required.").max(100),
  postalCode: z.string().trim().max(20).optional(),
  country: z.string().trim().min(1, "Country is required.").max(100).default("Kenya"),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  notes: z.string().trim().max(2000).optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

module.exports = {
  listCustomersQuerySchema,
  createCustomerSchema,
  updateCustomerSchema,
};