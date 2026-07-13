import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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
}) {
  if (!sale) return null;

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

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}