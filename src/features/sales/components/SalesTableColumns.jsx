import {
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutline";

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 2,
});

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

const statusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";

    case "Pending":
      return "warning";

    case "Cancelled":
      return "error";

    default:
      return "default";
  }
};

const salesTableColumns = ({
  onView,
  onPrint,
  onDelete,
} = {}) => [
  {
    id: "invoice",
    label: "Invoice",
    align: "left",
    render: (sale) => (
      <Typography fontWeight={600}>
        {sale.invoice}
      </Typography>
    ),
  },

  {
    id: "date",
    label: "Date",
    align: "left",
    render: (sale) => (
      <Stack spacing={0.3}>
        <Typography variant="body2">
          {formatDate(sale.createdAt)}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {formatTime(sale.createdAt)}
        </Typography>
      </Stack>
    ),
  },

  {
    id: "customer",
    label: "Customer",
    align: "left",
    render: (sale) => (
      <Typography>
        {sale.customerName}
      </Typography>
    ),
  },

  {
    id: "items",
    label: "Items",
    align: "center",
    render: (sale) => (
      <Typography>
        {sale.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
      </Typography>
    ),
  },

  {
    id: "total",
    label: "Total",
    align: "right",
    render: (sale) => (
      <Typography
        fontWeight={700}
        color="primary.main"
      >
        {currency.format(sale.total)}
      </Typography>
    ),
  },

  {
    id: "payment",
    label: "Payment",
    align: "center",
    render: (sale) => (
      <Chip
        label={sale.paymentMethod}
        size="small"
        variant="outlined"
      />
    ),
  },

  {
    id: "cashier",
    label: "Cashier",
    align: "left",
    render: (sale) => (
      <Typography>
        {sale.cashier}
      </Typography>
    ),
  },

  {
    id: "status",
    label: "Status",
    align: "center",
    render: (sale) => (
      <Chip
        label={sale.status}
        color={statusColor(sale.status)}
        size="small"
      />
    ),
  },

  {
    id: "actions",
    label: "Actions",
    align: "center",
    render: (sale) => (
      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="center"
      >
        <Tooltip title="View Sale">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView?.(sale)}
          >
            <VisibilityRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Print Receipt">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => onPrint?.(sale)}
          >
            <PrintRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Sale">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete?.(sale)}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  },
];

export default salesTableColumns;