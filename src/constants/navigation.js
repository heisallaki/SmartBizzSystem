import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
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
    title: "Suppliers",
    subtitle: "Supplier management",
    path: "/suppliers",
    icon: LocalShippingRoundedIcon,
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
    // Absent on every other item on purpose — no roles field means
    // "visible to any authenticated role". Sidebar.jsx treats it that way.
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