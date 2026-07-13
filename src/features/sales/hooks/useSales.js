import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import salesService from "../../../services/sales/sales.service";

import {
  PAYMENT_METHODS,
  SALE_STATUS_OPTIONS,
} from "../../../constants/sales";

export default function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] =
    useState("");

  const [customerFilter, setCustomerFilter] =
    useState("All");

  const [paymentFilter, setPaymentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Newest");

  const [createDialogOpen, setCreateDialogOpen] =
    useState(false);

  const [detailsDialogOpen, setDetailsDialogOpen] =
    useState(false);

  const [selectedSale, setSelectedSale] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadSales = useCallback(async () => {
    setLoading(true);

    try {
      const data =
        await salesService.getSales();

      setSales(data || []);
    } catch (error) {
      console.error(error);

      showSnackbar(
        "Failed to load sales.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const addSaleToList = (sale) => {
    setSales((previous) => [
      sale,
      ...previous,
    ]);
  };

  const customerOptions = useMemo(
    () => [
      "All",
      ...new Set(
        sales.map(
          (sale) => sale.customerName
        )
      ),
    ],
    [sales]
  );

  const paymentOptions = [
    "All",
    ...PAYMENT_METHODS,
  ];

  const statusOptions = [
    "All",
    ...SALE_STATUS_OPTIONS,
  ];

  const sortOptions = [
    "Newest",
    "Oldest",
    "Highest Amount",
    "Lowest Amount",
  ];

  const filteredSales = useMemo(() => {
    let rows = [...sales];

    if (search.trim()) {
      const query =
        search.toLowerCase();

      rows = rows.filter(
        (sale) =>
          sale.invoice
            ?.toLowerCase()
            .includes(query) ||
          sale.customerName
            ?.toLowerCase()
            .includes(query)
      );
    }

    if (dateFilter) {
      rows = rows.filter(
        (sale) =>
          sale.date === dateFilter
      );
    }

    if (
      customerFilter !== "All"
    ) {
      rows = rows.filter(
        (sale) =>
          sale.customerName ===
          customerFilter
      );
    }

    if (
      paymentFilter !== "All"
    ) {
      rows = rows.filter(
        (sale) =>
          sale.paymentMethod ===
          paymentFilter
      );
    }

    if (
      statusFilter !== "All"
    ) {
      rows = rows.filter(
        (sale) =>
          sale.status ===
          statusFilter
      );
    }

    switch (sortBy) {
      case "Newest":
        rows.sort(
          (a, b) => b.id - a.id
        );
        break;

      case "Oldest":
        rows.sort(
          (a, b) => a.id - b.id
        );
        break;

      case "Highest Amount":
        rows.sort(
          (a, b) =>
            b.total - a.total
        );
        break;

      case "Lowest Amount":
        rows.sort(
          (a, b) =>
            a.total - b.total
        );
        break;

      default:
        break;
    }

    return rows;
  }, [
    sales,
    search,
    dateFilter,
    customerFilter,
    paymentFilter,
    statusFilter,
    sortBy,
  ]);

  const todayKey =
    new Date()
      .toISOString()
      .slice(0, 10);

  const monthKey =
    todayKey.slice(0, 7);
      const todaySales = useMemo(
    () =>
      sales.filter(
        (sale) => sale.date === todayKey
      ),
    [sales, todayKey]
  );

  const monthlySales = useMemo(
    () =>
      sales.filter((sale) =>
        sale.date.startsWith(monthKey)
      ),
    [sales, monthKey]
  );

  const todayRevenue = todaySales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const todaySalesCount =
    todaySales.length;

  const monthlyRevenue =
    monthlySales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );

  const monthlySalesCount =
    monthlySales.length;

  const averageOrderValue =
    sales.length > 0
      ? sales.reduce(
          (sum, sale) =>
            sum + sale.total,
          0
        ) / sales.length
      : 0;

  return {
    loading,

    filteredSales,

    search,
    setSearch,

    dateFilter,
    setDateFilter,

    customerFilter,
    setCustomerFilter,
    customerOptions,

    paymentFilter,
    setPaymentFilter,
    paymentOptions,

    statusFilter,
    setStatusFilter,
    statusOptions,

    sortBy,
    setSortBy,
    sortOptions,

    todayRevenue,
    todaySalesCount,

    monthlyRevenue,
    monthlySalesCount,

    averageOrderValue,

    createDialogOpen,
    setCreateDialogOpen,

    detailsDialogOpen,
    setDetailsDialogOpen,

    selectedSale,
    setSelectedSale,

    addSaleToList,

    snackbar,
    showSnackbar,
    closeSnackbar,

    reloadSales: loadSales,
  };
}