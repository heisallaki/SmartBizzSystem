import { Chip, IconButton, Stack, Tooltip } from "@mui/material";

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

const STATUS_COLOR = {
  Unpaid: "default",
  PartiallyPaid: "warning",
  Paid: "success",
  Overdue: "error",
  Void: "default",
};

const invoiceColumns = (onRecordPayment, onVoid, onDelete) => [
  {
    field: "invoiceNumber",
    headerName: "Invoice #",
  },
  {
    field: "customerName",
    headerName: "Customer",
    renderCell: (row) => row.customerName || "—",
  },
  {
    field: "issueDate",
    headerName: "Issue Date",
    renderCell: (row) => formatDate(row.issueDate),
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    renderCell: (row) => (row.dueDate ? formatDate(row.dueDate) : "—"),
  },
  {
    field: "grandTotal",
    headerName: "Total",
    renderCell: (row) => formatCurrency(row.grandTotal),
  },
  {
    field: "balanceDue",
    headerName: "Balance Due",
    renderCell: (row) => formatCurrency(row.balanceDue),
  },
  {
    field: "status",
    headerName: "Status",
    renderCell: (row) => (
      <Chip size="small" label={row.status} color={STATUS_COLOR[row.status] || "default"} />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",
    renderCell: (row) => {
      const canPay = row.status !== "Paid" && row.status !== "Void";
      const canVoid = row.status !== "Void";
      const canDelete = row.status === "Unpaid" && row.balanceDue === row.grandTotal;

      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title={canPay ? "Record payment" : "Already fully settled"}>
            <span>
              <IconButton size="small" disabled={!canPay} onClick={() => onRecordPayment(row)}>
                <PaymentsRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canVoid ? "Void" : "Already voided"}>
            <span>
              <IconButton size="small" color="warning" disabled={!canVoid} onClick={() => onVoid(row)}>
                <BlockRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canDelete ? "Delete" : "Void a paid invoice instead"}>
            <span>
              <IconButton size="small" color="error" disabled={!canDelete} onClick={() => onDelete(row)}>
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default invoiceColumns;