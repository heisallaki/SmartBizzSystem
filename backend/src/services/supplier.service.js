const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

async function listSuppliers({ search, category, status, page, limit, sortBy, sortOrder }) {
  const where = {
    deletedAt: null,
    ...(category && { category }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.supplier.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.supplier.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getSupplierById(id) {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier || supplier.deletedAt) throw ApiError.notFound("Supplier not found.");
  return supplier;
}

async function createSupplier(data, actorId) {
  const supplier = await prisma.supplier.create({ data });

  await logAudit({
    userId: actorId,
    action: "supplier.created",
    entityType: "supplier",
    entityId: supplier.id,
  });

  return supplier;
}

async function updateSupplier(id, data, actorId) {
  await getSupplierById(id);

  const supplier = await prisma.supplier.update({ where: { id }, data });

  await logAudit({
    userId: actorId,
    action: "supplier.updated",
    entityType: "supplier",
    entityId: id,
  });

  return supplier;
}

async function deleteSupplier(id, actorId) {
  await getSupplierById(id);

  await prisma.supplier.update({
    where: { id },
    data: { deletedAt: new Date(), status: "Inactive" },
  });

  await logAudit({
    userId: actorId,
    action: "supplier.deleted",
    entityType: "supplier",
    entityId: id,
  });
}

// Called by Purchase Orders when a new PO is created — "totalOrders" counts
// orders actually placed with the supplier, regardless of whether they're
// ever fully received.
async function recordOrderPlaced({ supplierId, tx }) {
  const db = tx || prisma;
  await db.supplier.update({
    where: { id: supplierId },
    data: { totalOrders: { increment: 1 } },
  });
}

// Reverses recordOrderPlaced — called if a Draft/Submitted/Approved PO is
// cancelled before anything was received.
async function reverseOrderPlaced({ supplierId, tx }) {
  const db = tx || prisma;
  const supplier = await db.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) return;

  await db.supplier.update({
    where: { id: supplierId },
    data: { totalOrders: Math.max(0, supplier.totalOrders - 1) },
  });
}

// Called by Purchase Orders every time goods are actually received —
// "totalSpend" accumulates the real received value incrementally, across
// however many partial receipts a PO takes, rather than waiting for it to
// be marked fully Received.
async function recordReceivedValue({ supplierId, amount, tx }) {
  const db = tx || prisma;
  await db.supplier.update({
    where: { id: supplierId },
    data: { totalSpend: { increment: amount } },
  });
}

module.exports = {
  listSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  recordOrderPlaced,
  reverseOrderPlaced,
  recordReceivedValue,
};