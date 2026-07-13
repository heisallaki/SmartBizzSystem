import {
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { PAYMENT_METHODS } from "../../../constants/sales";

export default function PaymentSection({
  customers,
  customer,
  onCustomerChange,

  paymentMethod,
  onPaymentMethodChange,

  discount,
  onDiscountChange,

  taxRate,
  onTaxRateChange,

  notes,
  onNotesChange,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
      >
        Payment Details
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          select
          fullWidth
          label="Customer"
          value={customer?.id || ""}
          onChange={(event) => {
          const selected =
          customers.find(
          (item) =>
          item.id === event.target.value
        ) || customer;

      onCustomerChange(selected);
      }}
        >
          {customers.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
            >
              {item.fullName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Payment Method"
          value={paymentMethod}
          onChange={(event) =>
            onPaymentMethodChange(
              event.target.value
            )
          }
        >
          {PAYMENT_METHODS.map((method) => (
            <MenuItem
              key={method}
              value={method}
            >
              {method}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="number"
          label="Order Discount"
          value={discount}
          inputProps={{
            min: 0,
          }}
          onChange={(event) =>
            onDiscountChange(
              Number(
                event.target.value
              )
            )
          }
        />

        <TextField
          fullWidth
          type="number"
          label="Tax Rate (%)"
          value={taxRate}
          inputProps={{
            min: 0,
          }}
          onChange={(event) =>
            onTaxRateChange(
              Number(
                event.target.value
              )
            )
          }
        />
                <TextField
          fullWidth
          multiline
          minRows={4}
          label="Notes"
          placeholder="Optional notes for this sale..."
          value={notes}
          onChange={(event) =>
            onNotesChange(
              event.target.value
            )
          }
        />
      </Stack>
    </Paper>
  );
}