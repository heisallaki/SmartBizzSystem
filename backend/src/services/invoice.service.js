const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");
const { getBusinessToday } = require("../utils/businessTime");

async function generateInvoiceNumber(tx) {
  const last = await tx.invoice.findFirst({
    orderBy: { id: "desc" },
    select: { invoiceNumber: true },
  });

  const lastNumber = last ? Number(last.invoiceNumber.replace("BILL-", "")) : 1000;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1001;

  return `BILL-${String(nextNumber).padStart(4, "0")}`;
}

function computeLiveStatus(invoice) {
  if (invoice.status === "Void") return "Void";

  const grandTotal = Number(invoice.grandTotal);
  const amountPaid = Number(invoice.amountPaid);

  if (amountPaid >= grandTotal && grandTotal > 0) return "Paid";
  if (amountPaid > 0) return "PartiallyPaid";
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
}

function mapInvoice(invoice) {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    saleId: invoice.saleId,
    customerId: invoice.customer?.customerCode,
    customerName: invoice.customer
      ? `${invoice.customer.firstName} ${invoice.customer.lastName}`
      : null,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    items: invoice.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(invoice.subtotal),
    taxTotal: Number(invoice.taxTotal),
    grandTotal: Number(invoice.grandTotal),
    amountPaid: Number(invoice.amountPaid),
    balanceDue: Number(invoice.grandTotal) - Number(invoice.amountPaid),
    status: computeLiveStatus(invoice),
    notes: invoice.notes || "",
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt,
  };
}

const INCLUDE = { items: true, customer: true };

async function listInvoices({ search, customerId, status, page, limit, sortBy, sortOrder }) {
  const where = {
    ...(customerId && { customer: { is: { customerCode: customerId } } }),
    ...(search && { invoiceNumber: { contains: search, mode: "insensitive" } }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.invoice.findMany({
      where,
      include: INCLUDE,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  let mapped = items.map(mapInvoice);
  // status is a computed field, not a column — filter on it after mapping.
  if (status) mapped = mapped.filter((invoice) => invoice.status === status);

  return { items: mapped, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getInvoiceById(id) {
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: INCLUDE });
  if (!invoice) throw ApiError.notFound("Invoice not found.");

  return mapInvoice(invoice);
}

async function createFromSale({ saleId, dueInDays, notes }, actorId) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true, customer: true },
    });
    if (!sale) throw ApiError.notFound("Sale not found.");
    if (!sale.customerId) {
      throw ApiError.badRequest("Can't invoice a walk-in sale — it has no customer to bill.");
    }

    const invoiceNumber = await generateInvoiceNumber(tx);
    const issueDate = getBusinessToday();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + dueInDays);

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        saleId: sale.id,
        customerId: sale.customerId,
        issueDate,
        dueDate,
        subtotal: sale.subtotal,
        taxTotal: sale.taxTotal,
        grandTotal: sale.grandTotal,
        notes,
        items: {
          create: sale.items.map((item) => ({
            productId: item.productId,
            description: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "invoice.created_from_sale",
      entityType: "invoice",
      entityId: invoice.id,
      metadata: { saleId },
    });

    return mapInvoice(invoice);
  });
}

async function createStandalone({ customerId, items, issueDate, dueInDays, notes }, actorId) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({ where: { customerCode: customerId } });
    if (!customer) throw ApiError.badRequest("Selected customer does not exist.");

    const invoiceNumber = await generateInvoiceNumber(tx);
    const issue = issueDate ? new Date(issueDate) : getBusinessToday();
    const dueDate = new Date(issue);
    dueDate.setDate(dueDate.getDate() + dueInDays);

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        customerId: customer.id,
        issueDate: issue,
        dueDate,
        subtotal,
        taxTotal: 0,
        grandTotal: subtotal,
        notes,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice,
          })),
        },
      },
      include: INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "invoice.created",
      entityType: "invoice",
      entityId: invoice.id,
    });

    return mapInvoice(invoice);
  });
}

async function updateInvoice(id, data, actorId) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Invoice not found.");

  const { items, dueDate, notes } = data;

  const updateData = {
    ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
    ...(notes !== undefined && { notes }),
  };

  if (items) {
    if (Number(existing.amountPaid) > 0) {
      throw ApiError.badRequest(
        "Can't change line items on an invoice that already has a payment recorded."
      );
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    updateData.subtotal = subtotal;
    updateData.grandTotal = subtotal + Number(existing.taxTotal);

    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    updateData.items = {
      create: items.map((item) => ({
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice,
      })),
    };
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: updateData,
    include: INCLUDE,
  });

  await logAudit({
    userId: actorId,
    action: "invoice.updated",
    entityType: "invoice",
    entityId: id,
  });

  return mapInvoice(invoice);
}

async function recordPayment(id, { amount, method, referenceCode }, actorId) {
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({ where: { id } });
    if (!invoice) throw ApiError.notFound("Invoice not found.");
    if (invoice.status === "Void") {
      throw ApiError.badRequest("Can't record a payment against a voided invoice.");
    }

    const newAmountPaid = Number(invoice.amountPaid) + amount;
    if (newAmountPaid > Number(invoice.grandTotal)) {
      throw ApiError.badRequest(
        `That payment would overpay the invoice (balance due is ${
          Number(invoice.grandTotal) - Number(invoice.amountPaid)
        }).`
      );
    }

    await tx.payment.create({
      data: { invoiceId: id, method, amount, referenceCode },
    });

    const updated = await tx.invoice.update({
      where: { id },
      data: { amountPaid: newAmountPaid },
      include: INCLUDE,
    });

    await logAudit({
      userId: actorId,
      action: "invoice.payment_recorded",
      entityType: "invoice",
      entityId: id,
      metadata: { amount, method },
    });

    return mapInvoice(updated);
  });
}

async function voidInvoice(id, actorId) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Invoice not found.");

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: "Void" },
    include: INCLUDE,
  });

  await logAudit({
    userId: actorId,
    action: "invoice.voided",
    entityType: "invoice",
    entityId: id,
  });

  return mapInvoice(invoice);
}

async function deleteInvoice(id, actorId) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Invoice not found.");

  if (Number(existing.amountPaid) > 0) {
    throw ApiError.badRequest(
      "This invoice already has a payment recorded — void it instead of deleting."
    );
  }

  await prisma.invoice.delete({ where: { id } });

  await logAudit({
    userId: actorId,
    action: "invoice.deleted",
    entityType: "invoice",
    entityId: id,
  });
}

module.exports = {
  listInvoices,
  getInvoiceById,
  createFromSale,
  createStandalone,
  updateInvoice,
  recordPayment,
  voidInvoice,
  deleteInvoice,
};