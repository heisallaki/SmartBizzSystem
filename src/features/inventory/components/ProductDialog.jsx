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

export default function ProductDialog({
  open,
  onClose,
  onSave,
  selectedProduct,
  mode,
}) {
  const emptyProduct = {
    sku: "",
    name: "",
    category: "",
    stock: "",
    price: "",
    status: "In Stock",
  };

  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (selectedProduct) {
      setForm(selectedProduct);
    } else {
      setForm(emptyProduct);
    }
  }, [selectedProduct]);

  const handleChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = () => {
    onSave(form);

    setForm(emptyProduct);

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
        {mode === "edit" ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
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
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}