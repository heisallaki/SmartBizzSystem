import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import CustomerForm from "./CustomerForm";
import {
  emptyCustomer,
  validateCustomer,
} from "../utils/customerValidation";

export default function AddCustomerDialog({
  open,
  loading = false,
  onClose,
  onSave,
}) {
  const [customer, setCustomer] = useState(
    emptyCustomer()
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setCustomer(emptyCustomer());
      setErrors({});
    }
  }, [open]);

  const handleChange = (field, value) => {
    if (field.startsWith("address.")) {
      const key = field.split(".")[1];

      setCustomer((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));

      if (errors[key]) {
        setErrors((prev) => ({
          ...prev,
          [key]: "",
        }));
      }

      return;
    }

    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSave = async () => {
    const validation =
      validateCustomer(customer);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    await onSave(customer);

    setCustomer(emptyCustomer());
    setErrors({});
  };

  const handleClose = () => {
    if (loading) return;

    setCustomer(emptyCustomer());
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Add Customer
      </DialogTitle>

      <DialogContent dividers>
        <CustomerForm
          values={customer}
          errors={errors}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}