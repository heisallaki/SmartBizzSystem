import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import InventoryPage from "../features/inventory/InventoryPage";
import SalesPage from "../features/sales/SalesPage";
import CustomersPage from "../features/customers/CustomersPage";
import SuppliersPage from "../features/suppliers/SuppliersPage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "suppliers",
        element: <SuppliersPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;