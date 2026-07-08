import {
  Chip,
  IconButton,
  Stack,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import formatCurrency from "../../../utils/formatCurrency";

const productColumns = (
  onEdit,
  onDelete
) => [
  {
    field: "sku",
    headerName: "SKU",
  },
  {
    field: "name",
    headerName: "Product",
  },
  {
    field: "category",
    headerName: "Category",
  },
  {
    field: "stock",
    headerName: "Stock",
    align: "center",

    renderCell: (row) => (
      <strong>{row.stock}</strong>
    ),
  },
  {
    field: "price",
    headerName: "Price",

    renderCell: (row) =>
      formatCurrency(row.price),
  },
  {
    field: "status",
    headerName: "Status",

    renderCell: (row) => (
      <Chip
        size="small"
        label={row.status}
        color={
          row.status === "In Stock"
            ? "success"
            : row.status ===
              "Low Stock"
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

export default productColumns;