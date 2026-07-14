import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

export const REPORT_DATE_FILTERS = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "yesterday",
    label: "Yesterday",
  },
  {
    value: "last7",
    label: "Last 7 Days",
  },
  {
    value: "last30",
    label: "Last 30 Days",
  },
  {
    value: "thisMonth",
    label: "This Month",
  },
  {
    value: "lastMonth",
    label: "Last Month",
  },
  {
    value: "thisYear",
    label: "This Year",
  },
  {
    value: "custom",
    label: "Custom Range",
  },
];

export const REPORT_TABS = [
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "sales",
    label: "Sales",
  },
  {
    value: "inventory",
    label: "Inventory",
  },
  {
    value: "customers",
    label: "Customers",
  },
];

export const EXPORT_OPTIONS = [
  {
    value: "pdf",
    label: "Export PDF",
  },
  {
    value: "excel",
    label: "Export Excel",
  },
  {
    value: "print",
    label: "Print Report",
  },
];

export const REPORT_STATS = [
  {
    key: "revenue",
    title: "Revenue",
    icon: PaymentsRoundedIcon,
  },
  {
    key: "grossProfit",
    title: "Gross Profit",
    icon: TrendingUpRoundedIcon,
  },
  {
    key: "netProfit",
    title: "Net Profit",
    icon: AccountBalanceWalletRoundedIcon,
  },
  {
    key: "totalSales",
    title: "Sales",
    icon: ShoppingCartRoundedIcon,
  },
  {
    key: "products",
    title: "Products",
    icon: Inventory2RoundedIcon,
  },
  {
    key: "customers",
    title: "Customers",
    icon: PeopleRoundedIcon,
  },
  {
    key: "inventoryValue",
    title: "Inventory Value",
    icon: AssessmentRoundedIcon,
  },
  {
    key: "lowStockItems",
    title: "Low Stock",
    icon: WarningAmberRoundedIcon,
  },
];

export const CHART_COLORS = {
  primary: "#0F766E",
  secondary: "#7C3AED",
  success: "#16A34A",
  warning: "#EA580C",
  error: "#DC2626",
  info: "#2563EB",
  revenue: "#0F766E",
  profit: "#7C3AED",
  sales: "#2563EB",
};

export const REPORT_TABLE_COLUMNS = {
  sales: [
    {
      field: "invoice",
      headerName: "Invoice",
    },
    {
      field: "customer",
      headerName: "Customer",
    },
    {
      field: "items",
      headerName: "Items",
    },
    {
      field: "quantity",
      headerName: "Quantity",
    },
    {
      field: "revenue",
      headerName: "Revenue",
    },
    {
      field: "profit",
      headerName: "Profit",
    },
    {
      field: "date",
      headerName: "Date",
    },
  ],

  inventory: [
    {
      field: "sku",
      headerName: "SKU",
    },
    {
      field: "product",
      headerName: "Product",
    },
    {
      field: "category",
      headerName: "Category",
    },
    {
      field: "quantity",
      headerName: "Quantity",
    },
    {
      field: "stockValue",
      headerName: "Stock Value",
    },
    {
      field: "status",
      headerName: "Status",
    },
  ],

  customers: [
    {
      field: "customer",
      headerName: "Customer",
    },
    {
      field: "orders",
      headerName: "Orders",
    },
    {
      field: "totalSpend",
      headerName: "Total Spend",
    },
    {
      field: "averageOrder",
      headerName: "Average Order",
    },
    {
      field: "lastPurchase",
      headerName: "Last Purchase",
    },
  ],

  bestSelling: [
    {
      field: "product",
      headerName: "Product",
    },
    {
      field: "unitsSold",
      headerName: "Units Sold",
    },
    {
      field: "revenue",
      headerName: "Revenue",
    },
    {
      field: "profit",
      headerName: "Profit",
    },
  ],

  lowStock: [
    {
      field: "product",
      headerName: "Product",
    },
    {
      field: "remaining",
      headerName: "Remaining",
    },
    {
      field: "minimum",
      headerName: "Minimum",
    },
    {
      field: "status",
      headerName: "Status",
    },
  ],
};

export const DEFAULT_REPORT_FILTER = "last30";