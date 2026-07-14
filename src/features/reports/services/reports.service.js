import {
  reportStats,
  revenueTrend,
  salesReport,
  inventoryReport,
  customerReport,
  bestSellingProducts,
  lowStockProducts,
} from "../../../data/reportsData";

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardSummary() {
  await delay();

  return {
    ...reportStats,
  };
}

export async function fetchRevenueTrend() {
  await delay();

  return [...revenueTrend];
}

export async function fetchSalesReport() {
  await delay();

  return [...salesReport];
}

export async function fetchInventoryReport() {
  await delay();

  return [...inventoryReport];
}

export async function fetchCustomerReport() {
  await delay();

  return [...customerReport];
}

export async function fetchBestSellingProducts() {
  await delay();

  return [...bestSellingProducts];
}

export async function fetchLowStockProducts() {
  await delay();

  return [...lowStockProducts];
}

export async function fetchReports() {
  await delay();

  const [
    stats,
    revenue,
    sales,
    inventory,
    customers,
    bestSelling,
    lowStock,
  ] = await Promise.all([
    fetchDashboardSummary(),
    fetchRevenueTrend(),
    fetchSalesReport(),
    fetchInventoryReport(),
    fetchCustomerReport(),
    fetchBestSellingProducts(),
    fetchLowStockProducts(),
  ]);

  return {
    stats,
    revenue,
    sales,
    inventory,
    customers,
    bestSelling,
    lowStock,
  };
}