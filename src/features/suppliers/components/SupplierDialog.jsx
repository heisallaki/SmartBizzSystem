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

const STATUS_OPTIONS = [
  "Active",
  "On Hold",
  "Inactive",
];

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_SUPPLIER = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  category: "",
  totalOrders: "",
  totalSpend: "",
  status: "Active",
};

export default function SupplierDialog({
  open,
  onClose,
  onSave,
  selectedSupplier,
  mode,
}) {
  const [form, setForm] = useState(
    EMPTY_SUPPLIER
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedSupplier) {
      setForm(selectedSupplier);
    } else {
      setForm(EMPTY_SUPPLIER);
    }

    setErrors({});
  }, [selectedSupplier, open]);

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

    if (!form.name.trim()) {
      validationErrors.name =
        "Supplier name is required.";
    }

    if (!form.contactPerson.trim()) {
      validationErrors.contactPerson =
        "Contact person is required.";
    }

    if (!form.email.trim()) {
      validationErrors.email =
        "Email is required.";
    } else if (
      !EMAIL_PATTERN.test(form.email)
    ) {
      validationErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      validationErrors.phone =
        "Phone number is required.";
    }

    if (!form.category.trim()) {
      validationErrors.category =
        "Category is required.";
    }

    if (form.totalOrders === "") {
      validationErrors.totalOrders =
        "Total orders is required.";
    } else if (
      Number(form.totalOrders) < 0
    ) {
      validationErrors.totalOrders =
        "Orders cannot be negative.";
    }

    if (form.totalSpend === "") {
      validationErrors.totalSpend =
        "Total spend is required.";
    } else if (
      Number(form.totalSpend) < 0
    ) {
      validationErrors.totalSpend =
        "Total spend cannot be negative.";
    }

    setErrors(validationErrors);

    return (
      Object.keys(validationErrors)
        .length === 0
    );
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      ...form,
      totalOrders: Number(
        form.totalOrders
      ),
      totalSpend: Number(
        form.totalSpend
      ),
    });

    setForm(EMPTY_SUPPLIER);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {mode === "edit"
          ? "Edit Supplier"
          : "Add Supplier"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Supplier Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            error={
              !!errors.contactPerson
            }
            helperText={
              errors.contactPerson
            }
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={
              errors.category
            }
            fullWidth
          />

          <TextField
            label="Total Orders"
            name="totalOrders"
            type="number"
            value={form.totalOrders}
            onChange={handleChange}
            error={
              !!errors.totalOrders
            }
            helperText={
              errors.totalOrders
            }
            fullWidth
          />

          <TextField
            label="Total Spend (KES)"
            name="totalSpend"
            type="number"
            value={form.totalSpend}
            onChange={handleChange}
            error={
              !!errors.totalSpend
            }
            helperText={
              errors.totalSpend
            }
            fullWidth
          />

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            {STATUS_OPTIONS.map(
              (option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              )
            )}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {mode === "edit"
            ? "Update"
            : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}