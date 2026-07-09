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
  validateCustomer,
} from "../utils/customerValidation";

export default function EditCustomerDialog({
  open,
  customer,
  loading = false,
  onClose,
  onSave,
}) {
  const [formData, setFormData] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    if (customer) {
      setFormData(
        JSON.parse(JSON.stringify(customer))
      );

      setErrors({});
    }
  }, [customer]);

  const handleChange = (
    field,
    value
  ) => {
    if (!formData) return;

    if (field.startsWith("address.")) {
      const key = field.split(".")[1];

      setFormData((prev) => ({
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

    setFormData((prev) => ({
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
      validateCustomer(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    await onSave(
      formData.id,
      formData
    );
  };

  const handleClose = () => {
    if (loading) return;

    setErrors({});
    onClose();
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Edit Customer
      </DialogTitle>

      <DialogContent dividers>
        <CustomerForm
          values={formData}
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
            ? "Updating..."
            : "Update Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}