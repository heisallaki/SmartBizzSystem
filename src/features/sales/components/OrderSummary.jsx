import {
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 2,
});

export default function OrderSummary({
  subtotal = 0,
  totalDiscount = 0,
  discount = 0,
  setDiscount,
  taxRate = 0,
  setTaxRate,
  tax = 0,
  grandTotal = 0,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Stack spacing={3}>
        <Typography
          variant="h6"
          fontWeight={600}
        >
          Order Summary
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography color="text.secondary">
            Subtotal
          </Typography>

          <Typography fontWeight={600}>
            {currency.format(subtotal)}
          </Typography>
        </Stack>

        <TextField
          label="Additional Discount (KES)"
          type="number"
          value={discount}
          onChange={(e) =>
            setDiscount(
              Math.max(
                0,
                Number(e.target.value) || 0
              )
            )
          }
          fullWidth
        />

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography color="text.secondary">
            Total Discount
          </Typography>

          <Typography
            color="error.main"
            fontWeight={600}
          >
            - {currency.format(totalDiscount)}
          </Typography>
        </Stack>

        <TextField
          label="Tax Rate (%)"
          type="number"
          value={taxRate}
          onChange={(e) =>
            setTaxRate(
              Math.max(
                0,
                Number(e.target.value) || 0
              )
            )
          }
          fullWidth
        />

        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <Typography color="text.secondary">
            Tax
          </Typography>

          <Typography fontWeight={600}>
            {currency.format(tax)}
          </Typography>
        </Stack>

        <Divider />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Grand Total
          </Typography>

          <Typography
            variant="h5"
            color="primary.main"
            fontWeight={700}
          >
            {currency.format(grandTotal)}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}