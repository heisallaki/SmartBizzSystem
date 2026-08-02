import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

import ROLES from "./roles";

const navigation = [
  {
    title: "Dashboard",
    subtitle: "Business overview",
    path: "/",
    icon: DashboardRoundedIcon,
  },
  {
    title: "Inventory",
    subtitle: "Manage products and stock",
    path: "/inventory",
    icon: Inventory2RoundedIcon,
  },
  {
    title: "Sales",
    subtitle: "Sales and invoices",
    path: "/sales",
    icon: PointOfSaleRoundedIcon,
  },
  {
    title: "Customers",
    subtitle: "Customer management",
    path: "/customers",
    icon: PeopleRoundedIcon,
  },
  {
    title: "Invoices",
    subtitle: "Bill customers and track payments",
    path: "/invoices",
    icon: DescriptionRoundedIcon,
  },
  {
    title: "Suppliers",
    subtitle: "Supplier management",
    path: "/suppliers",
    icon: LocalShippingRoundedIcon,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    title: "Purchase Orders",
    subtitle: "Order stock from suppliers",
    path: "/purchase-orders",
    icon: ReceiptLongRoundedIcon,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    title: "Expenses",
    subtitle: "Track business expenses",
    path: "/expenses",
    icon: PaidRoundedIcon,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    title: "Reports",
    subtitle: "Business insights",
    path: "/reports",
    icon: AssessmentRoundedIcon,
  },
  {
    title: "Users",
    subtitle: "Staff accounts and roles",
    path: "/users",
    icon: ManageAccountsRoundedIcon,
    roles: [ROLES.ADMIN],
  },
  {
    title: "Settings",
    subtitle: "Application settings",
    path: "/settings",
    icon: SettingsRoundedIcon,
  },
];

export default navigation;