import { Chip } from "@mui/material";
import formatCurrency from "../../../utils/formatCurrency";

const salesColumns = [
  {
    field: "invoice",
    headerName: "Invoice",
  },
  {
    field: "customer",
    headerName: "Customer",
  },
  {
    field: "amount",
    headerName: "Amount",
    renderCell: (row) => formatCurrency(row.amount),
  },
  {
    field: "payment",
    headerName: "Payment",
    renderCell: (row) => (
      <Chip
        size="small"
        label={row.payment}
        color={row.payment === "Paid" ? "success" : "warning"}
      />
    ),
  },
  {
    field: "date",
    headerName: "Date",
  },
];

export default salesColumns;