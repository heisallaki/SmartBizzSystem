const { z } = require("zod");

const updateBusinessSettingsSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required.").max(150).optional(),
  businessEmail: z
    .union([z.string().trim().toLowerCase().email("Enter a valid email address."), z.literal("")])
    .optional(),
  businessPhone: z.string().trim().max(30).optional(),
  addressLine: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  county: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  taxPin: z.string().trim().max(50).optional(),
  defaultTaxRate: z.coerce.number().min(0).max(100).optional(),
  currencyCode: z.string().trim().length(3).optional(),
  logoUrl: z.string().trim().max(500).optional(),
  receiptFooterText: z.string().trim().max(255).optional(),
});

module.exports = { updateBusinessSettingsSchema };