import salesService from "../../../services/sales/sales.service";
import inventoryService, {
  LOW_STOCK_THRESHOLD,
} from "../../../services/inventory/inventory.service";
import customerService from "../../customers/services/customer.service";

import { DEFAULT_REPORT_FILTER } from "../constants/reports.constants";

import {
  resolveDateRange,
  isWithinRange,
  resolveGranularity,
  bucketKeyFor,
  buildBuckets,
} from "../utils/dateRange";

const delay = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const COMPLETED_STATUS = "Completed";
const TOP_SELLERS_LIMIT = 10;

function lineRevenue(sale) {
  return sale.items.reduce((sum, item) => sum + item.lineTotal, 0);
}

function lineCost(sale, costMap) {
  return sale.items.reduce((sum, item) => {
    const cost = costMap.get(item.productId) ?? 0;
    return sum + cost * item.quantity;
  }, 0);
}

function buildCostMap(products) {
  const map = new Map();

  products.forEach((product) => {
    map.set(product.id, product.costPrice ?? 0);
  });

  return map;
}

async function loadRawData() {
  const [sales, products, customers] = await Promise.all([
    salesService.getSales(),
    inventoryService.getProducts(),
    customerService.getAll(),
  ]);

  return { sales, products, customers };
}

function filterCompletedInRange(sales, range) {
  return sales.filter(
    (sale) =>
      sale.status === COMPLETED_STATUS && isWithinRange(sale.date, range)
  );
}

function computeStats({ periodSales, products, customers, costMap }) {
  const revenue = periodSales.reduce(
    (sum, sale) => sum + lineRevenue(sale),
    0
  );

  const cogs = periodSales.reduce(
    (sum, sale) => sum + lineCost(sale, costMap),
    0
  );

  const grossProfit = revenue - cogs;

  // Operating expenses aren't tracked yet — there's no Expenses module.
  // netProfit equals grossProfit until that ships and gets wired in here.
  const expenses = 0;
  const netProfit = grossProfit - expenses;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );

  const lowStockItems = products.filter(
    (product) => product.status !== "In Stock"
  ).length;

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

function computeRevenueTrend({ periodSales, costMap, range }) {
  const granularity = resolveGranularity(range);
  const buckets = buildBuckets(range, granularity);

  const totals = new Map(
    buckets.map((bucket) => [bucket.key, { revenue: 0, profit: 0, sales: 0 }])
  );

  periodSales.forEach((sale) => {
    const key = bucketKeyFor(sale.date, granularity);
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
        invoice: sale.invoice,
        customer: sale.customerName,
        items: sale.items.length,
        quantity: sale.items.reduce((sum, item) => sum + item.quantity, 0),
        revenue,
        profit: revenue - lineCost(sale, costMap),
        date: sale.date,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}

function computeInventoryReport({ products }) {
  return products.map((product) => ({
    id: product.id,
    sku: product.sku,
    product: product.name,
    category: product.category,
    quantity: product.stock,
    stockValue: product.stock * product.price,
    status: product.status,
  }));
}

function computeCustomerReport({ customers }) {
  
  return customers
    .filter((customer) => customer.totalOrders > 0)
    .map((customer) => ({
      id: customer.id,
      customer: customer.fullName,
      orders: customer.totalOrders,
      totalSpend: customer.totalSpent,
      averageOrder:
        customer.totalOrders > 0
          ? customer.totalSpent / customer.totalOrders
          : 0,
      lastPurchase: customer.lastPurchase,
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
        product: item.name,
        unitsSold: 0,
        revenue: 0,
        profit: 0,
      };

      entry.unitsSold += item.quantity;
      entry.revenue += item.lineTotal;
      entry.profit += item.lineTotal - cost * item.quantity;

      totals.set(item.productId, entry);
    });
  });

  return [...totals.values()]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, TOP_SELLERS_LIMIT);
}

function computeLowStockProducts({ products }) {
  return products
    .filter((product) => product.status !== "In Stock")
    .map((product) => ({
      id: product.id,
      product: product.name,
      remaining: product.stock,
      minimum: LOW_STOCK_THRESHOLD,
      status: product.status === "Out of Stock" ? "Critical" : "Low Stock",
    }))
    .sort((a, b) => a.remaining - b.remaining);
}

export async function fetchReports(
  dateFilter = DEFAULT_REPORT_FILTER,
  customRange = null
) {
  await delay();

  const range = resolveDateRange(dateFilter, customRange);
  const { sales, products, customers } = await loadRawData();
  const costMap = buildCostMap(products);
  const periodSales = filterCompletedInRange(sales, range);

  return {
    stats: computeStats({ periodSales, products, customers, costMap }),
    revenue: computeRevenueTrend({ periodSales, costMap, range }),
    sales: computeSalesReport({ periodSales, costMap }),
    inventory: computeInventoryReport({ products }),
    customers: computeCustomerReport({ customers }),
    bestSelling: computeBestSellingProducts({ periodSales, costMap }),
    lowStock: computeLowStockProducts({ products }),
  };
}

export async function fetchDashboardSummary(dateFilter, customRange) {
  const { stats } = await fetchReports(dateFilter, customRange);
  return stats;
}

export async function fetchRevenueTrend(dateFilter, customRange) {
  const { revenue } = await fetchReports(dateFilter, customRange);
  return revenue;
}

export async function fetchSalesReport(dateFilter, customRange) {
  const { sales } = await fetchReports(dateFilter, customRange);
  return sales;
}

export async function fetchInventoryReport(dateFilter, customRange) {
  const { inventory } = await fetchReports(dateFilter, customRange);
  return inventory;
}

export async function fetchCustomerReport(dateFilter, customRange) {
  const { customers } = await fetchReports(dateFilter, customRange);
  return customers;
}

export async function fetchBestSellingProducts(dateFilter, customRange) {
  const { bestSelling } = await fetchReports(dateFilter, customRange);
  return bestSelling;
}

export async function fetchLowStockProducts(dateFilter, customRange) {
  const { lowStock } = await fetchReports(dateFilter, customRange);
  return lowStock;
}