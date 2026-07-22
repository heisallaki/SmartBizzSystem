const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

function computeStatus(stock, lowStockThreshold) {
  if (stock <= 0) return "OutOfStock";
  if (stock <= lowStockThreshold) return "LowStock";
  return "InStock";
}

async function assertCategoryExists(categoryId) {
  if (categoryId === undefined) return;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw ApiError.badRequest("Selected category does not exist.");
}

async function assertSupplierExists(supplierId) {
  if (supplierId === undefined) return;
  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) throw ApiError.badRequest("Selected supplier does not exist.");
}

async function listProducts({ search, categoryId, status, isActive, page, limit, sortBy, sortOrder }) {
  const where = {
    deletedAt: null,
    ...(categoryId !== undefined && { categoryId }),
    ...(status && { status }),
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });
  if (!product || product.deletedAt) throw ApiError.notFound("Product not found.");
  return product;
}

async function createProduct(data, actorId) {
  await assertCategoryExists(data.categoryId);
  await assertSupplierExists(data.supplierId);

  const status = computeStatus(data.stock ?? 0, data.lowStockThreshold ?? 10);

  const product = await prisma.product.create({ data: { ...data, status } });

  if (product.stock > 0) {
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        movementType: "Adjustment",
        quantityChange: product.stock,
        stockAfter: product.stock,
        referenceType: "initial_stock",
        notes: "Opening stock on product creation",
        createdBy: actorId,
      },
    });
  }

  await logAudit({
    userId: actorId,
    action: "product.created",
    entityType: "product",
    entityId: product.id,
  });

  return product;
}

async function updateProduct(id, data, actorId) {
  await getProductById(id);
  await assertCategoryExists(data.categoryId);
  await assertSupplierExists(data.supplierId);

  const product = await prisma.product.update({ where: { id }, data });

  await logAudit({
    userId: actorId,
    action: "product.updated",
    entityType: "product",
    entityId: id,
  });

  return product;
}

async function deleteProduct(id, actorId) {
  await getProductById(id);

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });

  await logAudit({
    userId: actorId,
    action: "product.deleted",
    entityType: "product",
    entityId: id,
  });
}

async function adjustStock({ productId, quantityChange, movementType, notes, actorId }) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || product.deletedAt) throw ApiError.notFound("Product not found.");

    const newStock = product.stock + quantityChange;
    if (newStock < 0) {
      throw ApiError.badRequest(
        `That adjustment would take "${product.name}" below zero stock (currently ${product.stock}).`
      );
    }

    const status = computeStatus(newStock, product.lowStockThreshold);

    const updated = await tx.product.update({
      where: { id: productId },
      data: { stock: newStock, status },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId,
        movementType,
        quantityChange,
        stockAfter: newStock,
        referenceType: "manual",
        notes,
        createdBy: actorId,
      },
    });

    await logAudit({
      userId: actorId,
      action: "product.stock_adjusted",
      entityType: "product",
      entityId: productId,
      metadata: { quantityChange, movementType, stockAfter: newStock },
    });

    return { product: updated, movement };
  });
}

// Bridge for the frontend's decrementStock()/incrementStock() — restricted
// to Sale/Return/VoidReversal at the route/validator level, which is what
// makes it safe to leave open to any authenticated role (see product.routes.js).
async function batchAdjustStock({ items, movementType, actorId }) {
  return prisma.$transaction(async (tx) => {
    const results = [];

    for (const { productId, quantityChange } of items) {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || product.deletedAt) {
        throw ApiError.notFound(`Product ${productId} not found.`);
      }

      const newStock = product.stock + quantityChange;
      if (newStock < 0) {
        throw ApiError.badRequest(
          `That would take "${product.name}" below zero stock (currently ${product.stock}).`
        );
      }

      const status = computeStatus(newStock, product.lowStockThreshold);

      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock, status },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          movementType,
          quantityChange,
          stockAfter: newStock,
          referenceType: "manual_batch",
          createdBy: actorId,
        },
      });

      results.push({ product: updated, movement });
    }

    await logAudit({
      userId: actorId,
      action: "product.stock_batch_adjusted",
      entityType: "product",
      metadata: { movementType, items },
    });

    return results;
  });
}

// Called directly by Sales' checkout service once that module exists — not
// exposed as its own HTTP endpoint. Accepts an optional transaction client
// so every line item in a sale can decrement stock atomically alongside
// creating the Sale/SaleItem rows.
async function decrementStockForSale({ productId, quantity, saleId, actorId, tx }) {
  const db = tx || prisma;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound(`Product ${productId} not found.`);

  const newStock = product.stock - quantity;
  if (newStock < 0) {
    throw ApiError.badRequest(
      `Insufficient stock for "${product.name}" (have ${product.stock}, need ${quantity}).`
    );
  }

  const status = computeStatus(newStock, product.lowStockThreshold);

  await db.product.update({ where: { id: productId }, data: { stock: newStock, status } });

  await db.stockMovement.create({
    data: {
      productId,
      movementType: "Sale",
      quantityChange: -quantity,
      stockAfter: newStock,
      referenceType: "sale",
      referenceId: saleId,
      createdBy: actorId,
    },
  });

  return newStock;
}

async function listStockMovements(productId, { page, limit }) {
  await getProductById(productId);

  const [items, total] = await prisma.$transaction([
    prisma.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.stockMovement.count({ where: { productId } }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = {
  computeStatus,
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  batchAdjustStock,
  decrementStockForSale,
  listStockMovements,
};