import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { printSaleReceipt } from "../services/receiptPrint";
import { exportSaleReceiptToPdf } from "../services/receiptPdf";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

const getStatusColor = (status) => {
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

export default function SaleDetailsDialog({
  open,
  sale,
  onClose,
  onEdit,
  onVoid,
  onDelete,
}) {
  if (!sale) return null;

  const isCancelled = sale.status === "Cancelled";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Sale Details
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack spacing={0.5}>
              <Typography variant="h6">
                {sale.invoice}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {sale.date}
              </Typography>
            </Stack>

            <Chip
              label={sale.status}
              color={getStatusColor(
                sale.status
              )}
            />
          </Stack>

          <Paper
            variant="outlined"
            sx={{ p: 2 }}
          >
            <Stack spacing={1}>
              <Typography>
                <strong>
                  Customer:
                </strong>{" "}
                {sale.customerName}
              </Typography>

              <Typography>
                <strong>
                  Cashier:
                </strong>{" "}
                {sale.cashier}
              </Typography>

              <Typography>
                <strong>
                  Payment:
                </strong>{" "}
                {sale.paymentMethod}
              </Typography>
            </Stack>
          </Paper>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  Product
                </TableCell>

                <TableCell align="right">
                  Qty
                </TableCell>

                <TableCell align="right">
                  Price
                </TableCell>

                <TableCell align="right">
                  Discount
                </TableCell>

                <TableCell align="right">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sale.items?.map(
                (item) => (
                  <TableRow
                    key={
                      item.productId
                    }
                  >
                    <TableCell>
                      {item.name}
                    </TableCell>

                    <TableCell align="right">
                      {item.quantity}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        item.price
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        item.discount
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        item.lineTotal
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>

          <Divider />

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography>
                Subtotal
              </Typography>

              <Typography>
                {formatCurrency(
                  sale.subtotal
                )}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography>
                Discount
              </Typography>

              <Typography>
                {formatCurrency(
                  sale.discount
                )}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography>
                Tax
              </Typography>

              <Typography>
                {formatCurrency(
                  sale.tax
                )}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                variant="h6"
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                color="primary.main"
              >
                {formatCurrency(
                  sale.total
                )}
              </Typography>
            </Stack>
          </Stack>

          {sale.notes && (
            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
              >
                Notes
              </Typography>

              <Typography
                variant="body2"
              >
                {sale.notes}
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Tooltip title="Print Receipt">
            <IconButton
              onClick={() => printSaleReceipt(sale)}
            >
              <PrintOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download PDF">
            <IconButton
              onClick={() => exportSaleReceiptToPdf(sale)}
            >
              <PictureAsPdfOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button onClick={onClose}>
            Close
          </Button>

          <Button
            color="error"
            variant="outlined"
            onClick={() => onDelete(sale)}
          >
            Delete
          </Button>

          <Button
            color="warning"
            variant="outlined"
            disabled={isCancelled}
            onClick={() => onVoid(sale)}
          >
            Void
          </Button>

          <Button
            variant="contained"
            onClick={() => onEdit(sale)}
          >
            Edit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}