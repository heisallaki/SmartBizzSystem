import { useEffect, useState } from "react";

import dashboardService from "../services/dashboard.service";

function formatChange(changePercent) {
  if (changePercent === null || changePercent === undefined) return null;
  return `${changePercent >= 0 ? "+" : ""}${changePercent}%`;
}

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await dashboardService.getDashboard();

        if (!active) return;

        setStats(data.stats);
        setSalesChart(data.salesChart);
        setRecentTransactions(data.recentTransactions);
        setLowStockProducts(data.lowStockProducts);
      } catch (fetchError) {
        if (active) setError(fetchError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const statCards = stats
    ? [
        {
          id: "revenue",
          title: "Revenue",
          value: stats.revenue.value,
          change: formatChange(stats.revenue.changePercent),
          isCurrency: true,
        },
        {
          id: "sales",
          title: "Sales",
          value: stats.sales.value,
          change: formatChange(stats.sales.changePercent),
          isCurrency: false,
        },
        {
          id: "products",
          title: "Products",
          value: stats.products.value,
          change: formatChange(stats.products.changePercent),
          isCurrency: false,
        },
        {
          id: "customers",
          title: "Customers",
          value: stats.customers.value,
          change: formatChange(stats.customers.changePercent),
          isCurrency: false,
        },
      ]
    : [];

  return {
    loading,
    error,

    statCards,
    salesChart,
    recentTransactions,
    lowStockProducts,
  };
}