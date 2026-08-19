const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");
const { logAudit } = require("./audit.service");

async function generateCustomerCode() {
  const last = await prisma.customer.findFirst({
    orderBy: { id: "desc" },
    select: { customerCode: true },
  });

  const lastNumber = last
    ? Number(last.customerCode.replace("CUS-", ""))
    : 1000;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1001;

  return `CUS-${String(nextNumber).padStart(4, "0")}`;
}

async function attachPurchaseHistory(customers) {
  if (customers.length === 0) return customers;

  const sales = await prisma.sale.findMany({
    where: { customerId: { in: customers.map((c) => c.id) } },
    orderBy: { saleDate: "desc" },
    select: {
      id: true,
      invoiceNumber: true,
      saleDate: true,
      grandTotal: true,
      customerId: true,
    },
  });

  const salesByCustomer = new Map();
  for (const sale of sales) {
    const list = salesByCustomer.get(sale.customerId) || [];
    list.push({
      id: sale.id,
      invoice: sale.invoiceNumber,
      date: sale.saleDate,
      total: Number(sale.grandTotal),
    });
    salesByCustomer.set(sale.customerId, list);
  }

  return customers.map((customer) => ({
    ...customer,
    purchaseHistory: salesByCustomer.get(customer.id) || [],
  }));
}

async function listCustomers({ search, status, city, page, limit, sortBy, sortOrder }) {
  const where = {
    deletedAt: null,
    ...(status && { status }),
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { customerCode: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ]);

  const withHistory = await attachPurchaseHistory(items);

  return { items: withHistory, total, page, limit, totalPages: Math.ceil(total / limit) };
}

async function getCustomerByCode(code) {
  const customer = await prisma.customer.findUnique({ where: { customerCode: code } });
  if (!customer || customer.deletedAt) throw ApiError.notFound("Customer not found.");

  const [withHistory] = await attachPurchaseHistory([customer]);
  return withHistory;
}

async function createCustomer(data, actorId) {
  const customerCode = await generateCustomerCode();

  const customer = await prisma.customer.create({
    data: { ...data, customerCode },
  });

  await logAudit({
    userId: actorId,
    action: "customer.created",
    entityType: "customer",
    entityId: customer.id,
  });

  const [withHistory] = await attachPurchaseHistory([customer]);
  return withHistory;
}

async function updateCustomer(code, data, actorId) {
  const existing = await prisma.customer.findUnique({ where: { customerCode: code } });
  if (!existing || existing.deletedAt) throw ApiError.notFound("Customer not found.");

  const customer = await prisma.customer.update({
    where: { customerCode: code },
    data,
  });

  await logAudit({
    userId: actorId,
    action: "customer.updated",
    entityType: "customer",
    entityId: customer.id,
  });

  const [withHistory] = await attachPurchaseHistory([customer]);
  return withHistory;
}

async function deleteCustomer(code, actorId) {
  const existing = await prisma.customer.findUnique({ where: { customerCode: code } });
  if (!existing || existing.deletedAt) throw ApiError.notFound("Customer not found.");

  await prisma.customer.update({
    where: { customerCode: code },
    data: { deletedAt: new Date(), status: "Inactive" },
  });

  await logAudit({
    userId: actorId,
    action: "customer.deleted",
    entityType: "customer",
    entityId: existing.id,
  });
}

async function getStatistics() {
  const customers = await prisma.customer.findMany({ where: { deletedAt: null } });

  const activeCustomers = customers.filter((c) => c.status === "Active").length;

  return {
    totalCustomers: customers.length,
    activeCustomers,
    inactiveCustomers: customers.length - activeCustomers,
    outstandingBalance: customers.reduce(
      (sum, c) => sum + Number(c.outstandingBalance),
      0
    ),
    totalRevenue: customers.reduce((sum, c) => sum + Number(c.totalSpent), 0),
  };
}

async function recordPurchaseForSale({ customerId, saleTotal, saleDate, tx }) {
  const db = tx || prisma;

  await db.customer.update({
    where: { id: customerId },
    data: {
      totalOrders: { increment: 1 },
      totalSpent: { increment: saleTotal },
      lastPurchaseAt: saleDate,
    },
  });
}

async function reversePurchaseForSale({ customerId, saleTotal, tx }) {
  const db = tx || prisma;

  const customer = await db.customer.findUnique({ where: { id: customerId } });
  if (!customer) return;

  await db.customer.update({
    where: { id: customerId },
    data: {
      totalOrders: Math.max(0, customer.totalOrders - 1),
      totalSpent: Math.max(0, Number(customer.totalSpent) - saleTotal),
    },
  });
}

module.exports = {
  listCustomers,
  getCustomerByCode,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStatistics,
  recordPurchaseForSale,
  reversePurchaseForSale,
};