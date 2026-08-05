const prisma = require("../config/prisma");
const { logAudit } = require("./audit.service");

async function exportBusinessData() {
  const [
    categories,
    products,
    suppliers,
    customers,
    sales,
    saleItems,
    payments,
    invoices,
    invoiceItems,
    purchaseOrders,
    purchaseOrderItems,
    expenseCategories,
    expenses,
    businessSettings,
  ] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.supplier.findMany(),
    prisma.customer.findMany(),
    prisma.sale.findMany(),
    prisma.saleItem.findMany(),
    prisma.payment.findMany(),
    prisma.invoice.findMany(),
    prisma.invoiceItem.findMany(),
    prisma.purchaseOrder.findMany(),
    prisma.purchaseOrderItem.findMany(),
    prisma.expenseCategory.findMany(),
    prisma.expense.findMany(),
    prisma.businessSetting.findMany(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    tables: {
      categories,
      products,
      suppliers,
      customers,
      sales,
      saleItems,
      payments,
      invoices,
      invoiceItems,
      purchaseOrders,
      purchaseOrderItems,
      expenseCategories,
      expenses,
      businessSettings,
    },
  };
}

async function createBackup(actorId) {
  const startedAt = new Date();
  const data = await exportBusinessData();
  const json = JSON.stringify(data);
  const fileSizeBytes = Buffer.byteLength(json, "utf8");
  const fileName = `smartbizz-backup-${Date.now()}.json`;

  const backup = await prisma.backup.create({
    data: {
      fileName,
      fileSizeBytes,
      storagePath: "client-download",
      triggeredBy: actorId,
      status: "Completed",
      startedAt,
      completedAt: new Date(),
    },
  });

  await logAudit({
    userId: actorId,
    action: "backup.created",
    entityType: "backup",
    entityId: backup.id,
    metadata: { fileName, fileSizeBytes },
  });

  return { backup, data, fileName };
}

async function listBackups({ page, limit }) {
  const [items, total] = await prisma.$transaction([
    prisma.backup.findMany({
      orderBy: { startedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { trigger: { select: { id: true, fullName: true } } },
    }),
    prisma.backup.count(),
  ]);

  return {
    items: items.map((backup) => ({
      id: backup.id,
      fileName: backup.fileName,
      fileSizeBytes: backup.fileSizeBytes,
      status: backup.status,
      startedAt: backup.startedAt,
      completedAt: backup.completedAt,
      triggeredByName: backup.trigger?.fullName || "System",
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = { createBackup, listBackups };