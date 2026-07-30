import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const PAYMENT_METHODS = ["Cash", "M-Pesa", "Card", "Bank Transfer"];

export default function RecordPaymentDialog({ open, invoice, onClose, onRecordPayment }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [referenceCode, setReferenceCode] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setMethod("Cash");
      setReferenceCode("");
      setErrors({});
    }
  }, [open]);

  if (!invoice) return null;

  const handleSave = async () => {
    const validationErrors = {};
    if (!amount || Number(amount) <= 0) {
      validationErrors.amount = "Enter an amount greater than zero.";
    } else if (Number(amount) > invoice.balanceDue) {
      validationErrors.amount = `Can't exceed the balance due (KES ${invoice.balanceDue.toLocaleString()}).`;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await onRecordPayment({
        amount: Number(amount),
        method,
        referenceCode: referenceCode || undefined,
      });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Record Payment — {invoice.invoiceNumber}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Alert severity="info">Balance due: KES {invoice.balanceDue.toLocaleString()}</Alert>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth
          />

          <TextField
            select
            label="Method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            fullWidth
          >
            {PAYMENT_METHODS.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Reference Code"
            value={referenceCode}
            onChange={(event) => setReferenceCode(event.target.value)}
            helperText="Optional — e.g. M-Pesa transaction code"
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Recording..." : "Record Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}