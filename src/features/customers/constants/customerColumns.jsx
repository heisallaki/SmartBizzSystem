import { Chip } from "@mui/material";

import CustomerRowActions from "../components/CustomerRowActions";
import formatCurrency from "../../../utils/formatCurrency";

export const customerColumns = ({
  onView,
  onEdit,
  onDelete,
}) => [
  {
    field: "id",
    headerName: "Customer ID",
  },
  {
    field: "fullName",
    headerName: "Customer",
  },
  {
    field: "phone",
    headerName: "Phone",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "totalSpent",
    headerName: "Total Spent",
    renderCell: (row) =>
      formatCurrency(row.totalSpent),
  },
  {
    field: "status",
    headerName: "Status",
    renderCell: (row) => (
      <Chip
        label={row.status}
        color={
          row.status === "Active"
            ? "success"
            : "default"
        }
        size="small"
      />
    ),
  },
  {
    field: "actions",
    headerName: "",
    align: "right",
    renderCell: (row) => (
      <CustomerRowActions
        row={row}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];