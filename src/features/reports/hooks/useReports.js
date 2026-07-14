import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_REPORT_FILTER } from "../constants/reports.constants";

import { fetchReports } from "../services/reports.service";

import { exportReportToPdf } from "../services/exportPdf";
import { exportReportToExcel } from "../services/exportExcel";
import { printReport as printReportService } from "../services/printReport";

export default function useReports() {
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState(DEFAULT_REPORT_FILTER);

  const [customRange, setCustomRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [stats, setStats] = useState({});
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [salesReport, setSalesReport] = useState([]);
  const [inventoryReport, setInventoryReport] = useState([]);
  const [customerReport, setCustomerReport] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const loadReports = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchReports();

      setStats(data.stats);
      setRevenueTrend(data.revenue);
      setSalesReport(data.sales);
      setInventoryReport(data.inventory);
      setCustomerReport(data.customers);
      setBestSellingProducts(data.bestSelling);
      setLowStockProducts(data.lowStock);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const refreshReports = useCallback(() => {
    loadReports();
  }, [loadReports]);

  const handleTabChange = useCallback((value) => {
    setSelectedTab(value);
  }, []);

  const handleDateFilterChange = useCallback((value) => {
    setDateFilter(value);
  }, []);

  const handleCustomRangeChange = useCallback((range) => {
    setCustomRange(range);
  }, []);

  const summary = useMemo(
    () => ({
      revenue: stats.revenue ?? 0,
      expenses: stats.expenses ?? 0,
      grossProfit: stats.grossProfit ?? 0,
      netProfit: stats.netProfit ?? 0,
      totalSales: stats.totalSales ?? 0,
      totalOrders: stats.totalOrders ?? 0,
      customers: stats.customers ?? 0,
      products: stats.products ?? 0,
      inventoryValue: stats.inventoryValue ?? 0,
      lowStockItems: stats.lowStockItems ?? 0,
    }),
    [stats]
  );

  const exportPdf = useCallback(() => {
    exportReportToPdf({
      title: "Sales Report",
      filename: "sales-report.pdf",

      columns: [
        { field: "invoice", headerName: "Invoice" },
        { field: "customer", headerName: "Customer" },
        { field: "items", headerName: "Items" },
        { field: "quantity", headerName: "Quantity" },
        { field: "revenue", headerName: "Revenue" },
        { field: "profit", headerName: "Profit" },
        { field: "date", headerName: "Date" },
      ],

      rows: salesReport,

      summary: [
        {
          label: "Revenue",
          value: summary.revenue,
        },
        {
          label: "Gross Profit",
          value: summary.grossProfit,
        },
        {
          label: "Net Profit",
          value: summary.netProfit,
        },
        {
          label: "Total Sales",
          value: summary.totalSales,
        },
      ],
    });
  }, [salesReport, summary]);

  const exportExcel = useCallback(() => {
    exportReportToExcel({
      sheetName: "Sales Report",
      filename: "sales-report.xlsx",

      columns: [
        { field: "invoice", headerName: "Invoice" },
        { field: "customer", headerName: "Customer" },
        { field: "items", headerName: "Items" },
        { field: "quantity", headerName: "Quantity" },
        { field: "revenue", headerName: "Revenue" },
        { field: "profit", headerName: "Profit" },
        { field: "date", headerName: "Date" },
      ],

      rows: salesReport,

      summary: [
        {
          label: "Revenue",
          value: summary.revenue,
        },
        {
          label: "Gross Profit",
          value: summary.grossProfit,
        },
        {
          label: "Net Profit",
          value: summary.netProfit,
        },
      ],
    });
  }, [salesReport, summary]);

  const printReport = useCallback(() => {
    printReportService({
      title: "SmartBizz Reports",
    });
  }, []);

  return {
    loading,

    selectedTab,
    dateFilter,
    customRange,

    stats: summary,

    revenueTrend,
    salesReport,
    inventoryReport,
    customerReport,
    bestSellingProducts,
    lowStockProducts,

    refreshReports,

    setSelectedTab: handleTabChange,
    setDateFilter: handleDateFilterChange,
    setCustomRange: handleCustomRangeChange,

    exportPdf,
    exportExcel,
    printReport,
  };
}