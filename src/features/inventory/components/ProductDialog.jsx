import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const EMPTY_PRODUCT = {
  sku: "",
  name: "",
  category: "",
  stock: "",
  price: "",
  status: "In Stock",
};

export default function ProductDialog({
  open,
  onClose,
  onSave,
  selectedProduct,
  mode,
}) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setForm(selectedProduct);
    } else {
      setForm(EMPTY_PRODUCT);
    }

    setErrors({});
  }, [selectedProduct, open]);

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

    if (!form.sku.trim()) {
      validationErrors.sku = "SKU is required.";
    }

    if (!form.name.trim()) {
      validationErrors.name = "Product name is required.";
    }

    if (!form.category.trim()) {
      validationErrors.category = "Category is required.";
    }

    if (form.stock === "") {
      validationErrors.stock = "Stock quantity is required.";
    } else if (Number(form.stock) < 0) {
      validationErrors.stock = "Stock cannot be negative.";
    }

    if (form.price === "") {
      validationErrors.price = "Price is required.";
    } else if (Number(form.price) <= 0) {
      validationErrors.price =
        "Price must be greater than zero.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      ...form,
      stock: Number(form.stock),
      price: Number(form.price),
    });

    setForm(EMPTY_PRODUCT);
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
          ? "Edit Product"
          : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            error={!!errors.sku}
            helperText={errors.sku}
            fullWidth
          />

          <TextField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            error={!!errors.stock}
            helperText={errors.stock}
            fullWidth
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />
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