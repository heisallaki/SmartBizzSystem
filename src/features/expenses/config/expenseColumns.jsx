import { IconButton, Stack } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

const expenseColumns = (onEdit, onDelete) => [
  {
    field: "date",
    headerName: "Date",

    renderCell: (row) => formatDate(row.date),
  },
  {
    field: "description",
    headerName: "Description",
  },
  {
    field: "category",
    headerName: "Category",
  },
  {
    field: "supplierName",
    headerName: "Supplier",

    renderCell: (row) => row.supplierName || "—",
  },
  {
    field: "amount",
    headerName: "Amount",

    renderCell: (row) => formatCurrency(row.amount),
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",

    renderCell: (row) => (
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton size="small" onClick={() => onEdit(row)}>
          <EditRoundedIcon fontSize="small" />
        </IconButton>

        <IconButton size="small" color="error" onClick={() => onDelete(row)}>
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

export default expenseColumns;