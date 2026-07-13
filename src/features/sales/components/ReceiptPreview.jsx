import {
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

export default function ReceiptPreview({
  customer,
  cart,

  subtotal,
  discount,
  tax,
  total,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        position: "sticky",
        top: 0,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
      >
        Receipt Preview
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Customer
      </Typography>

      <Typography
        fontWeight={600}
        sx={{ mb: 3 }}
      >
        {customer?.fullName ||
          "Walk-in Customer"}
      </Typography>

      <Stack spacing={2}>
        {cart.length === 0 ? (
          <Typography
            color="text.secondary"
          >
            No items added.
          </Typography>
        ) : (
          cart.map((item) => (
            <Stack
              key={item.productId}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Stack spacing={0.25}>
                <Typography
                  fontWeight={600}
                >
                  {item.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {item.quantity} ×{" "}
                  {formatCurrency(
                    item.price
                  )}
                </Typography>
              </Stack>

              <Typography
                fontWeight={600}
              >
                {formatCurrency(
                  item.lineTotal
                )}
              </Typography>
            </Stack>
          ))
        )}

        <Divider sx={{ my: 1 }} />
                <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography>
            Subtotal
          </Typography>

          <Typography>
            {formatCurrency(subtotal)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography>
            Discount
          </Typography>

          <Typography color="error.main">
            -{formatCurrency(discount)}
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
            {formatCurrency(tax)}
          </Typography>
        </Stack>

        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Total
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
            color="primary.main"
          >
            {formatCurrency(total)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}