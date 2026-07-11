import {
  Chip,
  IconButton,
  Stack,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import formatCurrency from "../../../utils/formatCurrency";

const supplierColumns = (
  onEdit,
  onDelete
) => [
  {
    field: "name",
    headerName: "Supplier",
  },
  {
    field: "contactPerson",
    headerName: "Contact Person",
  },
  {
    field: "phone",
    headerName: "Phone",
  },
  {
    field: "category",
    headerName: "Category",
  },
  {
    field: "totalOrders",
    headerName: "Orders",
    align: "center",

    renderCell: (row) => (
      <strong>{row.totalOrders}</strong>
    ),
  },
  {
    field: "totalSpend",
    headerName: "Total Spend",

    renderCell: (row) =>
      formatCurrency(row.totalSpend),
  },
  {
    field: "status",
    headerName: "Status",

    renderCell: (row) => (
      <Chip
        size="small"
        label={row.status}
        color={
          row.status === "Active"
            ? "success"
            : row.status ===
              "On Hold"
            ? "warning"
            : "error"
        }
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",

    renderCell: (row) => (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
      >
        <IconButton
          size="small"
          onClick={() =>
            onEdit(row)
          }
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={() =>
            onDelete(row)
          }
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

export default supplierColumns;