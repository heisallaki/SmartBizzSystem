const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");
const productService = require("./product.service");
const supplierService = require("./supplier.service");

const FULL_INCLUDE = {
  items: { include: { product: { select: { name: true, sku: true } } } },
  supplier: { select: { id: true, name: true } },
  creator: { select: { id: true, fullName: true } },
};

const ALLOWED_STATUS_TRANSITIONS = {
  Draft: ["Submitted", "Cancelled"],
  Submitted: ["Draft", "Approved", "Cancelled"],
  Approved: ["Cancelled"],
};

function mapPurchaseOrder(po) {
  return {
    id: po.id,
    poNumber: po.poNumber,
    supplierId: po.supplierId,
    supplierName: po.supplier?.name,
    status: po.status,
    orderDate: po.orderDate,
    expectedDate: po.expectedDate,
    receivedDate: po.receivedDate,
    items: po.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name,
      sku: item.product?.sku,
      quantityOrdered: item.quantityOrdered,
      quantityReceived: item.quantityReceived,
      unitCost: Number(item.unitCost),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(po.subtotal),
    taxTotal: Number(po.taxTotal),
    grandTotal: Number(po.grandTotal),
    notes: po.notes || "",
    createdBy: po.createdBy,
    createdByName: po.creator?.fullName,
    createdAt: po.createdAt,
    updatedAt: po.updatedAt,
  };
}

async function generatePoNumber(tx) {
  const last = await tx.purchaseOrder.findFirst({
    orderBy: { id: "desc" },
    select: { poNumber: true },
  });

  const lastNumber = last ? Number(last.poNumber.replace("PO-", "")) : 1000;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1001;

  return `PO-${String(nextNumber).padStart(4, "0")}`;
}

async function listPurchaseOrders({ search, supplierId, status, page, limit, sortBy, sortOrder }) {
  const where = {
    ...(supplierId !== undefined && { supplierId }),
    ...(status && { status }),
    ...(search && { poNumber: { contains: search, mode: "insensitive" } }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.purchaseOrder.findMany({
      where,
      include: FULL_INCLUDE,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.purchaseOrder.count({ where }),
  ]);

  return {
    items: items.map(mapPurchaseOrder),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getPurchaseOrderById(id) {
  const po = await prisma.purchaseOrder.findUnique({ where: { id }, include: FULL_INCLUDE });
  if (!po) throw ApiError.notFound("Purchase order not found.");

  return mapPurchaseOrder(po);
}

async function createPurchaseOrder(data, actorId) {
  return prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.findUnique({ where: { id: data.supplierId } });
    if (!supplier || supplier.deletedAt) {
      throw ApiError.badRequest("Selected supplier does not exist.");
    }

    for (const item of data.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.deletedAt) {
        throw ApiError.badRequest(`Product ${item.productId} does not exist.`);
      }
    }

    const poNumber = await generatePoNumber(tx);
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantityOrdered * item.unitCost,
      0
    );

    const po = await tx.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        status: "Draft",
        orderDate: new Date(),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        subtotal,
        taxTotal: 0,
        grandTotal: subtotal,
        notes: data.notes,
        createdBy: actorId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantityOrdered: item.quantityOrdered,
            unitCost: item.unitCost,
            lineTotal: item.quantityOrdered * item.unitCost,
          })),
        },
      },
      include: FULL_INCLUDE,
    });

    await supplierService.recordOrderPlaced({ supplierId: data.supplierId, tx });

    await logAudit({
      userId: actorId,
      action: "purchase_order.created",
      entityType: "purchase_order",
      entityId: po.id,
    });

    return mapPurchaseOrder(po);
  });
}

async function updatePurchaseOrder(id, data, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Purchase order not found.");
    if (!["Draft", "Submitted"].includes(existing.status)) {
      throw ApiError.badRequest("Can only edit a purchase order while it's Draft or Submitted.");
    }

    const updateData = {};

    if (data.supplierId !== undefined) {
      const supplier = await tx.supplier.findUnique({ where: { id: data.supplierId } });
      if (!supplier || supplier.deletedAt) {
        throw ApiError.badRequest("Selected supplier does not exist.");
      }
      updateData.supplierId = data.supplierId;
    }
    if (data.expectedDate !== undefined) updateData.expectedDate = new Date(data.expectedDate);
    if (data.notes !== undefined) updateData.notes = data.notes;

    if (data.items) {
      const subtotal = data.items.reduce(
        (sum, item) => sum + item.quantityOrdered * item.unitCost,
        0
      );
      updateData.subtotal = subtotal;
      updateData.grandTotal = subtotal;

      await tx.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
      updateData.items = {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantityOrdered: item.quantityOrdered,
          unitCost: item.unitCost,
          lineTotal: item.quantityOrdered * item.unitCost,
        })),
      };
    }

    const po = await tx.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: FULL_INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "purchase_order.updated",
      entityType: "purchase_order",
      entityId: id,
    });

    return mapPurchaseOrder(po);
  });
}

async function updateStatus(id, newStatus, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Purchase order not found.");

    const allowed = ALLOWED_STATUS_TRANSITIONS[existing.status] || [];
    if (!allowed.includes(newStatus)) {
      throw ApiError.badRequest(
        `Can't move a purchase order from ${existing.status} to ${newStatus}.`
      );
    }

    if (newStatus === "Cancelled") {
      await supplierService.reverseOrderPlaced({ supplierId: existing.supplierId, tx });
    }

    const po = await tx.purchaseOrder.update({
      where: { id },
      data: { status: newStatus },
      include: FULL_INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "purchase_order.status_changed",
      entityType: "purchase_order",
      entityId: id,
      metadata: { from: existing.status, to: newStatus },
    });

    return mapPurchaseOrder(po);
  });
}

async function receivePurchaseOrder(id, receivedItems, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) throw ApiError.notFound("Purchase order not found.");
    if (!["Approved", "PartiallyReceived"].includes(existing.status)) {
      throw ApiError.badRequest("Purchase order must be Approved before it can be received.");
    }

    for (const { purchaseOrderItemId, quantityReceived } of receivedItems) {
      const poItem = existing.items.find((item) => item.id === purchaseOrderItemId);
      if (!poItem) {
        throw ApiError.badRequest(
          `Purchase order item ${purchaseOrderItemId} not found on this order.`
        );
      }

      const remaining = poItem.quantityOrdered - poItem.quantityReceived;
      if (quantityReceived > remaining) {
        throw ApiError.badRequest(
          `Can't receive ${quantityReceived} — only ${remaining} remaining on this line.`
        );
      }

      await tx.purchaseOrderItem.update({
        where: { id: purchaseOrderItemId },
        data: { quantityReceived: { increment: quantityReceived } },
      });

      await productService.increaseStockForPurchaseOrder({
        productId: poItem.productId,
        quantity: quantityReceived,
        purchaseOrderId: id,
        actorId,
        tx,
      });

      await supplierService.recordReceivedValue({
        supplierId: existing.supplierId,
        amount: quantityReceived * Number(poItem.unitCost),
        tx,
      });
    }

    const refreshedItems = await tx.purchaseOrderItem.findMany({
      where: { purchaseOrderId: id },
    });
    const allReceived = refreshedItems.every(
      (item) => item.quantityReceived >= item.quantityOrdered
    );
    const anyReceived = refreshedItems.some((item) => item.quantityReceived > 0);
    const newStatus = allReceived ? "Received" : anyReceived ? "PartiallyReceived" : existing.status;

    const po = await tx.purchaseOrder.update({
      where: { id },
      data: {
        status: newStatus,
        ...(allReceived && { receivedDate: new Date() }),
      },
      include: FULL_INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "purchase_order.received",
      entityType: "purchase_order",
      entityId: id,
      metadata: { items: receivedItems },
    });

    return mapPurchaseOrder(po);
  });
}

// Hard delete only while still Draft (nothing sent to the supplier, no
// stock or supplier-total effects to unwind beyond the order-placed
// count) — anything further along uses updateStatus("Cancelled") instead.
async function deletePurchaseOrder(id, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Purchase order not found.");
    if (existing.status !== "Draft") {
      throw ApiError.badRequest("Only a Draft purchase order can be deleted — cancel it instead.");
    }

    await supplierService.reverseOrderPlaced({ supplierId: existing.supplierId, tx });
    await tx.purchaseOrder.delete({ where: { id } });

    await logAudit({
      userId: actorId,
      action: "purchase_order.deleted",
      entityType: "purchase_order",
      entityId: id,
    });
  });
}

module.exports = {
  listPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  updateStatus,
  receivePurchaseOrder,
  deletePurchaseOrder,
};