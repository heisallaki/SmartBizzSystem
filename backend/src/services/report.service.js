const prisma = require("../config/prisma");
const {
  resolveGranularity,
  bucketKeyFor,
  buildBuckets,
} = require("../utils/reportDateRange");

const TOP_SELLERS_LIMIT = 10;

const PRODUCT_STATUS_LABELS = {
  InStock: "In Stock",
  LowStock: "Low Stock",
  OutOfStock: "Out of Stock",
};

function toRangeBounds(startDate, endDate) {
  return {
    start: new Date(`${startDate}T00:00:00.000Z`),
    end: new Date(`${endDate}T23:59:59.999Z`),
  };
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function customerFullName(customer) {
  return customer ? `${customer.firstName} ${customer.lastName}` : "Walk-in Customer";
}

function lineRevenue(sale) {
  return sale.items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
}

function lineCost(sale, costMap) {
  return sale.items.reduce((sum, item) => {
    const cost = costMap.get(item.productId) ?? 0;
    return sum + cost * item.quantity;
  }, 0);
}

function buildCostMap(products) {
  const map = new Map();
  products.forEach((product) => map.set(product.id, Number(product.costPrice)));
  return map;
}

async function loadPeriodSales(start, end) {
  return prisma.sale.findMany({
    where: {
      status: "Completed",
      saleDate: { gte: start, lte: end },
    },
    include: { items: true, customer: true },
    orderBy: [{ saleDate: "desc" }, { id: "desc" }],
  });
}

async function loadProducts() {
  return prisma.product.findMany({
    where: { deletedAt: null },
    include: { category: { select: { id: true, name: true } } },
  });
}

async function loadCustomers() {
  return prisma.customer.findMany({ where: { deletedAt: null } });
}

function computeStats({ periodSales, products, customers, costMap }) {
  const revenue = periodSales.reduce((sum, sale) => sum + lineRevenue(sale), 0);
  const cogs = periodSales.reduce((sum, sale) => sum + lineCost(sale, costMap), 0);
  const grossProfit = revenue - cogs;
  const expenses = 0;
  const netProfit = grossProfit - expenses;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.stock * Number(product.price),
    0
  );

  const lowStockItems = products.filter((product) => product.status !== "InStock").length;

  return {
    revenue,
    expenses,
    grossProfit,
    netProfit,
    totalSales: periodSales.length,
    totalOrders: periodSales.length,
    customers: customers.length,
    products: products.length,
    inventoryValue,
    lowStockItems,
  };
}

function computeRevenueTrend({ periodSales, costMap, startDate, endDate }) {
  const range = { startDate, endDate };
  const granularity = resolveGranularity(range);
  const buckets = buildBuckets(range, granularity);

  const totals = new Map(
    buckets.map((bucket) => [bucket.key, { revenue: 0, profit: 0, sales: 0 }])
  );

  periodSales.forEach((sale) => {
    const key = bucketKeyFor(dateKey(sale.saleDate), granularity);
    const bucket = totals.get(key);
    if (!bucket) return;

    const revenue = lineRevenue(sale);
    bucket.revenue += revenue;
    bucket.profit += revenue - lineCost(sale, costMap);
    bucket.sales += 1;
  });

  return buckets.map((bucket) => ({
    month: bucket.label,
    ...totals.get(bucket.key),
  }));
}

function computeSalesReport({ periodSales, costMap }) {
  return periodSales
    .map((sale) => {
      const revenue = lineRevenue(sale);

      return {
        id: sale.id,
        invoice: sale.invoiceNumber,
        customer: customerFullName(sale.customer),
        items: sale.items.length,
        quantity: sale.items.reduce((sum, item) => sum + item.quantity, 0),
        revenue,
        profit: revenue - lineCost(sale, costMap),
        date: dateKey(sale.saleDate),
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}

function computeInventoryReport({ products }) {
  return products.map((product) => ({
    id: product.id,
    sku: product.sku,
    product: product.name,
    category: product.category?.name ?? null,
    quantity: product.stock,
    stockValue: product.stock * Number(product.price),
    status: PRODUCT_STATUS_LABELS[product.status] ?? product.status,
  }));
}

function computeCustomerReport({ customers }) {
  return customers
    .filter((customer) => customer.totalOrders > 0)
    .map((customer) => ({
      id: customer.customerCode,
      customer: customerFullName(customer),
      orders: customer.totalOrders,
      totalSpend: Number(customer.totalSpent),
      averageOrder:
        customer.totalOrders > 0 ? Number(customer.totalSpent) / customer.totalOrders : 0,
      lastPurchase: customer.lastPurchaseAt ? dateKey(customer.lastPurchaseAt) : null,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend);
}

function computeBestSellingProducts({ periodSales, costMap }) {
  const totals = new Map();

  periodSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const cost = costMap.get(item.productId) ?? 0;
      const entry = totals.get(item.productId) || {
        id: item.productId,
        product: item.productName,
        unitsSold: 0,
        revenue: 0,
        profit: 0,
      };

      entry.unitsSold += item.quantity;
      entry.revenue += Number(item.lineTotal);
      entry.profit += Number(item.lineTotal) - cost * item.quantity;

      totals.set(item.productId, entry);
    });
  });

  return [...totals.values()]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, TOP_SELLERS_LIMIT);
}

function computeLowStockProducts({ products }) {
  return products
    .filter((product) => product.status !== "InStock")
    .map((product) => ({
      id: product.id,
      product: product.name,
      remaining: product.stock,
      minimum: product.lowStockThreshold,
      status: product.status === "OutOfStock" ? "Critical" : "Low Stock",
    }))
    .sort((a, b) => a.remaining - b.remaining);
}

async function generateReport({ startDate, endDate }) {
  const { start, end } = toRangeBounds(startDate, endDate);

  const [periodSales, products, customers] = await Promise.all([
    loadPeriodSales(start, end),
    loadProducts(),
    loadCustomers(),
  ]);

  const costMap = buildCostMap(products);

  return {
    stats: computeStats({ periodSales, products, customers, costMap }),
    revenue: computeRevenueTrend({ periodSales, costMap, startDate, endDate }),
    sales: computeSalesReport({ periodSales, costMap }),
    inventory: computeInventoryReport({ products }),
    customers: computeCustomerReport({ customers }),
    bestSelling: computeBestSellingProducts({ periodSales, costMap }),
    lowStock: computeLowStockProducts({ products }),
  };
}

module.exports = { generateReport };