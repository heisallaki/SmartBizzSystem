const prisma = require("../config/prisma");
const { logAudit } = require("./audit.service");

const DEFAULT_BUSINESS_SETTINGS = {
  businessName: "My Business",
  country: "Kenya",
  defaultTaxRate: 16,
  currencyCode: "KES",
};

function mapBusinessSettings(setting) {
  return {
    id: setting.id,
    businessName: setting.businessName,
    businessEmail: setting.businessEmail || "",
    businessPhone: setting.businessPhone || "",
    addressLine: setting.addressLine || "",
    city: setting.city || "",
    county: setting.county || "",
    country: setting.country,
    taxPin: setting.taxPin || "",
    defaultTaxRate: Number(setting.defaultTaxRate),
    currencyCode: setting.currencyCode,
    logoUrl: setting.logoUrl || "",
    receiptFooterText: setting.receiptFooterText || "",
    updatedAt: setting.updatedAt,
  };
}

async function getOrCreateBusinessSettings() {
  const existing = await prisma.businessSetting.findFirst({ orderBy: { id: "asc" } });
  if (existing) return existing;

  return prisma.businessSetting.create({ data: DEFAULT_BUSINESS_SETTINGS });
}

async function getBusinessSettings() {
  const setting = await getOrCreateBusinessSettings();
  return mapBusinessSettings(setting);
}

async function updateBusinessSettings(data, actorId) {
  const existing = await getOrCreateBusinessSettings();

  const updated = await prisma.businessSetting.update({
    where: { id: existing.id },
    data: {
      ...(data.businessName !== undefined && { businessName: data.businessName }),
      ...(data.businessEmail !== undefined && { businessEmail: data.businessEmail || null }),
      ...(data.businessPhone !== undefined && { businessPhone: data.businessPhone || null }),
      ...(data.addressLine !== undefined && { addressLine: data.addressLine || null }),
      ...(data.city !== undefined && { city: data.city || null }),
      ...(data.county !== undefined && { county: data.county || null }),
      ...(data.country !== undefined && { country: data.country }),
      ...(data.taxPin !== undefined && { taxPin: data.taxPin || null }),
      ...(data.defaultTaxRate !== undefined && { defaultTaxRate: data.defaultTaxRate }),
      ...(data.currencyCode !== undefined && { currencyCode: data.currencyCode }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      ...(data.receiptFooterText !== undefined && {
        receiptFooterText: data.receiptFooterText || null,
      }),
      updatedBy: actorId,
    },
  });

  await logAudit({
    userId: actorId,
    action: "business_settings.updated",
    entityType: "business_settings",
    entityId: updated.id,
  });

  return mapBusinessSettings(updated);
}

module.exports = { getBusinessSettings, updateBusinessSettings };