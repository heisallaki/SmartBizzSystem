const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");
const productService = require("./product.service");
const customerService = require("./customer.service");
const notificationService = require("./notification.service");
const { getBusinessToday } = require("../utils/businessTime");

const PAYMENT_METHOD_TO_ENUM = {
  Cash: "Cash",
  "M-Pesa": "MPesa",
  Card: "Card",
  "Bank Transfer": "BankTransfer",
};
const ENUM_TO_PAYMENT_METHOD = {
  Cash: "Cash",
  MPesa: "M-Pesa",
  Card: "Card",
  BankTransfer: "Bank Transfer",
};

function mapSale(sale) {
  return {
    id: sale.id,
    invoiceNumber: sale.invoiceNumber,
    date: sale.saleDate.toISOString().slice(0, 10),
    customerId: sale.customer?.customerCode || "walk-in",
    customerName: sale.customer
      ? `${sale.customer.firstName} ${sale.customer.lastName}`
      : "Walk-in Customer",
    cashierId: sale.cashierId,
    cashier: sale.cashier?.fullName || "Unknown",
    items: sale.items.map((item) => ({
      productId: item.productId,
      sku: item.sku,
      name: item.productName,
      price: Number(item.unitPrice),
      quantity: item.quantity,
      discount: Number(item.lineDiscount),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(sale.subtotal),
    discount: Number(sale.discountTotal),
    taxRate: Number(sale.taxRate),
    tax: Number(sale.taxTotal),
    total: Number(sale.grandTotal),
    paymentMethod: ENUM_TO_PAYMENT_METHOD[sale.paymentMethod] || sale.paymentMethod,
    status: sale.status,
    notes: sale.notes || "",
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

async function resolveCustomerId(tx, customerIdInput) {
  if (!customerIdInput || customerIdInput === "walk-in") return null;

  const customer = await tx.customer.findUnique({
    where: { customerCode: customerIdInput },
  });
  if (!customer) throw ApiError.badRequest("Selected customer does not exist.");

  return customer.id;
}

function computeTotals({ items, discount, taxRate }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lineDiscountsTotal = items.reduce((sum, item) => sum + item.discount, 0);
  const totalDiscount = lineDiscountsTotal + discount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  const tax = Math.round((taxableAmount * taxRate) / 100);
  const grandTotal = taxableAmount + tax;

  return { subtotal, totalDiscount, tax, grandTotal };
}

async function generateInvoiceNumber(tx) {
  const last = await tx.sale.findFirst({
    orderBy: { id: "desc" },
    select: { invoiceNumber: true },
  });

  const lastNumber = last ? Number(last.invoiceNumber.replace("INV-", "")) : 1000;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1001;

  return `INV-${String(nextNumber).padStart(4, "0")}`;
}

async function applySaleEffects(tx, sale, actorId) {
  for (const item of sale.items) {
    await productService.decrementStockForSale({
      productId: item.productId,
      quantity: item.quantity,
      saleId: sale.id,
      actorId,
      tx,
    });
  }

  if (sale.customerId) {
    await customerService.recordPurchaseForSale({
      customerId: sale.customerId,
      saleTotal: Number(sale.grandTotal),
      saleDate: sale.saleDate,
      tx,
    });
  }
}

async function reverseSaleEffects(tx, sale, actorId) {
  for (const item of sale.items) {
    await productService.reverseStockForSale({
      productId: item.productId,
      quantity: item.quantity,
      saleId: sale.id,
      actorId,
      tx,
    });
  }

  if (sale.customerId) {
    await customerService.reversePurchaseForSale({
      customerId: sale.customerId,
      saleTotal: Number(sale.grandTotal),
      tx,
    });
  }
}

async function listSales({ status, page, limit, sortBy, sortOrder }) {
  const where = {
    ...(status && { status }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.sale.findMany({
      where,
      include: { items: true, customer: true, cashier: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sale.count({ where }),
  ]);

  return {
    items: items.map(mapSale),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function getSaleById(id) {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: { items: true, customer: true, cashier: true },
  });
  if (!sale) throw ApiError.notFound("Sale not found.");

  return mapSale(sale);
}

async function createSale(data, actorId) {
  const sale = await prisma.$transaction(async (tx) => {
    const customerId = await resolveCustomerId(tx, data.customerId);
    const { subtotal, totalDiscount, tax, grandTotal } = computeTotals(data);
    const invoiceNumber = await generateInvoiceNumber(tx);
    const paymentMethodEnum = PAYMENT_METHOD_TO_ENUM[data.paymentMethod];

    const createdSale = await tx.sale.create({
      data: {
        invoiceNumber,
        customerId,
        cashierId: actorId,
        saleDate: getBusinessToday(),        
        subtotal,
        discountTotal: totalDiscount,
        taxRate: data.taxRate,
        taxTotal: tax,
        grandTotal,
        paymentMethod: paymentMethodEnum,
        status: data.status,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            unitPrice: item.price,
            quantity: item.quantity,
            lineDiscount: item.discount,
            lineTotal: item.price * item.quantity - item.discount,
          })),
        },
        payments: {
          create: [{ method: paymentMethodEnum, amount: grandTotal }],
        },
      },
      include: { items: true, customer: true, cashier: true },
    });

    if (createdSale.status === "Completed") {
      await applySaleEffects(tx, createdSale, actorId);
    }

    await logAudit({
      userId: actorId,
      action: "sale.created",
      entityType: "sale",
      entityId: createdSale.id,
    });

    return createdSale;
  });

  if (sale.status === "Completed") {
    await notificationService.notifyNewSale(sale);
  }

  return mapSale(sale);
}

async function updateSale(id, data, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findUnique({
      where: { id },
      include: { items: true, customer: true, cashier: true },
    });
    if (!existing) throw ApiError.notFound("Sale not found.");

    if (existing.status === "Completed") {
      await reverseSaleEffects(tx, existing, actorId);
    }

    const customerId = await resolveCustomerId(tx, data.customerId);
    const { subtotal, totalDiscount, tax, grandTotal } = computeTotals(data);
    const paymentMethodEnum = PAYMENT_METHOD_TO_ENUM[data.paymentMethod];

    await tx.saleItem.deleteMany({ where: { saleId: id } });
    await tx.payment.deleteMany({ where: { saleId: id } });

    const sale = await tx.sale.update({
      where: { id },
      data: {
        customerId,
        subtotal,
        discountTotal: totalDiscount,
        taxRate: data.taxRate,
        taxTotal: tax,
        grandTotal,
        paymentMethod: paymentMethodEnum,
        status: data.status,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            sku: item.sku,
            unitPrice: item.price,
            quantity: item.quantity,
            lineDiscount: item.discount,
            lineTotal: item.price * item.quantity - item.discount,
          })),
        },
        payments: {
          create: [{ method: paymentMethodEnum, amount: grandTotal }],
        },
      },
      include: { items: true, customer: true, cashier: true },
    });

    if (sale.status === "Completed") {
      await applySaleEffects(tx, sale, actorId);
    }

    await logAudit({
      userId: actorId,
      action: "sale.updated",
      entityType: "sale",
      entityId: id,
    });

    return mapSale(sale);
  });
}

async function voidSale(id, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findUnique({
      where: { id },
      include: { items: true, customer: true, cashier: true },
    });
    if (!existing) throw ApiError.notFound("Sale not found.");

    if (existing.status === "Cancelled") {
      return mapSale(existing); // idempotent no-op
    }

    if (existing.status === "Completed") {
      await reverseSaleEffects(tx, existing, actorId);
    }

    const sale = await tx.sale.update({
      where: { id },
      data: { status: "Cancelled" },
      include: { items: true, customer: true, cashier: true },
    });

    await logAudit({
      userId: actorId,
      action: "sale.voided",
      entityType: "sale",
      entityId: id,
    });

    return mapSale(sale);
  });
}

async function deleteSale(id, actorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findUnique({
      where: { id },
      include: { items: true, customer: true, cashier: true },
    });
    if (!existing) throw ApiError.notFound("Sale not found.");

    if (existing.status === "Completed") {
      await reverseSaleEffects(tx, existing, actorId);
    }

    await tx.sale.delete({ where: { id } });

    await logAudit({
      userId: actorId,
      action: "sale.deleted",
      entityType: "sale",
      entityId: id,
    });
  });
}

module.exports = {
  listSales,
  getSaleById,
  createSale,
  updateSale,
  voidSale,
  deleteSale,
};