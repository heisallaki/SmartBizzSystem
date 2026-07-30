import { Button, Chip, IconButton, Stack, Tooltip } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const NEXT_STATUS = {
  Draft: "Submitted",
  Submitted: "Approved",
};

import formatCurrency from "../../../utils/formatCurrency";
import formatDate from "../../../utils/formatDate";

const STATUS_COLOR = {
  Draft: "default",
  Submitted: "info",
  Approved: "primary",
  PartiallyReceived: "warning",
  Received: "success",
  Cancelled: "error",
};

const purchaseOrderColumns = (onEdit, onAdvance, onReceive, onCancel, onDelete) => [
  {
    field: "poNumber",
    headerName: "PO Number",
  },
  {
    field: "supplierName",
    headerName: "Supplier",
  },
  {
    field: "orderDate",
    headerName: "Order Date",
    renderCell: (row) => formatDate(row.orderDate),
  },
  {
    field: "grandTotal",
    headerName: "Total",
    renderCell: (row) => formatCurrency(row.grandTotal),
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
      const canEdit = row.status === "Draft" || row.status === "Submitted";
      const canReceive = row.status === "Approved" || row.status === "PartiallyReceived";
      const canCancel = ["Draft", "Submitted", "Approved"].includes(row.status);
      const canDelete = row.status === "Draft";
      const nextStatus = NEXT_STATUS[row.status];

      return (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          {nextStatus && (
            <Button size="small" variant="outlined" onClick={() => onAdvance(row, nextStatus)}>
              {nextStatus}
            </Button>
          )}

          <Tooltip title={canEdit ? "Edit" : "Locked after approval"}>
            <span>
              <IconButton size="small" disabled={!canEdit} onClick={() => onEdit(row)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canReceive ? "Receive items" : "Not ready to receive"}>
            <span>
              <IconButton size="small" disabled={!canReceive} onClick={() => onReceive(row)}>
                <Inventory2RoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canCancel ? "Cancel" : "Can't cancel from this status"}>
            <span>
              <IconButton size="small" color="warning" disabled={!canCancel} onClick={() => onCancel(row)}>
                <CancelRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={canDelete ? "Delete" : "Only Draft orders can be deleted"}>
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

export default purchaseOrderColumns;