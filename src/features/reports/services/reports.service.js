import api from "../../../config/api";

import { DEFAULT_REPORT_FILTER } from "../constants/reports.constants";

import { resolveDateRange } from "../utils/dateRange";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

export async function fetchReports(
  dateFilter = DEFAULT_REPORT_FILTER,
  customRange = null
) {
  const { startDate, endDate } = resolveDateRange(dateFilter, customRange);

  try {
    const { data } = await api.get("/reports", {
      params: { startDate, endDate },
    });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load reports."));
  }
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