import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { PAYMENT_METHODS } from "../../../constants/sales";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyExpense() {
  return {
    description: "",
    category: "",
    supplierId: "",
    amount: "",
    date: todayKey(),
    paymentMethod: "Cash",
    receiptUrl: "",
  };
}

export default function ExpenseDialog({
  open,
  onClose,
  onSave,
  selectedExpense,
  mode,
  suppliers,
}) {
  const [form, setForm] = useState(emptyExpense);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedExpense) {
      setForm({
        ...selectedExpense,
        supplierId: selectedExpense.supplierId || "",
      });
    } else {
      setForm(emptyExpense());
    }

    setErrors({});
  }, [selectedExpense, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!form.description.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (!form.category.trim()) {
      validationErrors.category = "Category is required.";
    }

    if (form.amount === "") {
      validationErrors.amount = "Amount is required.";
    } else if (Number(form.amount) <= 0) {
      validationErrors.amount = "Amount must be greater than zero.";
    }

    if (!form.date) {
      validationErrors.date = "Date is required.";
    }

    if (!form.paymentMethod) {
      validationErrors.paymentMethod = "Payment method is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave({
        ...form,
        supplierId: form.supplierId === "" ? undefined : Number(form.supplierId),
        amount: Number(form.amount),
      });

      setForm(emptyExpense());
      setErrors({});
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "edit" ? "Edit Expense" : "Add Expense"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            fullWidth
          />

          <TextField
            select
            label="Supplier (optional)"
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount (KES)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth
          />

          <TextField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            select
            label="Payment Method"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            error={!!errors.paymentMethod}
            helperText={errors.paymentMethod}
            fullWidth
          >
            {PAYMENT_METHODS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Receipt URL (optional)"
            name="receiptUrl"
            value={form.receiptUrl}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}