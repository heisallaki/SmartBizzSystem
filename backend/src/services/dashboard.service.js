const prisma = require("../config/prisma");
const { getBusinessNow } = require("../utils/businessTime");
const RECENT_TRANSACTIONS_LIMIT = 5;
const LOW_STOCK_LIMIT = 5;
const CHART_MONTHS = 6;

function monthLabel(date) {
  return new Intl.DateTimeFormat("en-KE", { month: "short", timeZone: "UTC" }).format(date);
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date, count) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));
}

function customerFullName(customer) {
  return customer ? `${customer.firstName} ${customer.lastName}` : "Walk-in Customer";
}

function percentChange(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function sumRevenue(sales) {
  return sales.reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + Number(item.lineTotal), 0),
    0
  );
}

async function loadCompletedSalesBetween(start, end) {
  return prisma.sale.findMany({
    where: {
      status: "Completed",
      saleDate: { gte: start, lt: end },
    },
    select: { id: true, items: { select: { lineTotal: true } } },
  });
}

async function getDashboardStats() {
  const now = getBusinessNow();
  const thisMonthStart = startOfMonth(now);
  const nextMonthStart = addMonths(thisMonthStart, 1);
  const lastMonthStart = addMonths(thisMonthStart, -1);

  const [
    thisMonthSales,
    lastMonthSales,
    productsTotal,
    customersTotal,
    customersCreatedThisMonth,
    customersCreatedLastMonth,
  ] = await Promise.all([
    loadCompletedSalesBetween(thisMonthStart, nextMonthStart),
    loadCompletedSalesBetween(lastMonthStart, thisMonthStart),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.customer.count({
      where: { deletedAt: null, createdAt: { gte: thisMonthStart, lt: nextMonthStart } },
    }),
    prisma.customer.count({
      where: { deletedAt: null, createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    }),
  ]);

  const thisMonthRevenue = sumRevenue(thisMonthSales);
  const lastMonthRevenue = sumRevenue(lastMonthSales);

  return {
    revenue: {
      value: thisMonthRevenue,
      changePercent: percentChange(thisMonthRevenue, lastMonthRevenue),
    },
    sales: {
      value: thisMonthSales.length,
      changePercent: percentChange(thisMonthSales.length, lastMonthSales.length),
    },
    products: {
      value: productsTotal,
      changePercent: null,
    },
    customers: {
      value: customersTotal,
      changePercent: percentChange(customersCreatedThisMonth, customersCreatedLastMonth),
    },
  };
}

async function getSalesChart() {
  const now = getBusinessNow();
  const currentMonthStart = startOfMonth(now);

  const months = [];
  for (let i = CHART_MONTHS - 1; i >= 0; i -= 1) {
    const start = addMonths(currentMonthStart, -i);
    const end = addMonths(currentMonthStart, -i + 1);
    months.push({ start, end, label: monthLabel(start) });
  }

  const totals = await Promise.all(
    months.map(({ start, end }) => loadCompletedSalesBetween(start, end).then(sumRevenue))
  );

  return months.map((month, index) => ({
    month: month.label,
    sales: totals[index],
  }));
}

async function getRecentTransactions() {
  const sales = await prisma.sale.findMany({
    orderBy: [{ id: "desc" }],
    take: RECENT_TRANSACTIONS_LIMIT,
    include: { customer: true, items: { select: { lineTotal: true } } },
  });

  return sales.map((sale) => ({
    id: sale.id,
    invoice: sale.invoiceNumber,
    customer: customerFullName(sale.customer),
    amount: sale.items.reduce((sum, item) => sum + Number(item.lineTotal), 0),
    status: sale.status,
  }));
}

async function getLowStockProducts() {
  return prisma.product.findMany({
    where: {
      deletedAt: null,
      status: { in: ["LowStock", "OutOfStock"] },
    },
    orderBy: { stock: "asc" },
    take: LOW_STOCK_LIMIT,
    select: { id: true, name: true, stock: true },
  });
}

async function getDashboard() {
  const [stats, salesChart, recentTransactions, lowStockProducts] = await Promise.all([
    getDashboardStats(),
    getSalesChart(),
    getRecentTransactions(),
    getLowStockProducts(),
  ]);

  return { stats, salesChart, recentTransactions, lowStockProducts };
}

module.exports = { getDashboard };