import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const EMPTY_ITEM = { productId: "", quantityOrdered: "", unitCost: "" };

function emptyForm() {
  return {
    supplierId: "",
    expectedDate: "",
    notes: "",
    items: [{ ...EMPTY_ITEM }],
  };
}

export default function PurchaseOrderDialog({ open, onClose, onSave, selectedPurchaseOrder, mode, suppliers, products }) {
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedPurchaseOrder) {
      setForm({
        supplierId: selectedPurchaseOrder.supplierId,
        expectedDate: selectedPurchaseOrder.expectedDate ? selectedPurchaseOrder.expectedDate.slice(0, 10) : "",
        notes: selectedPurchaseOrder.notes || "",
        items: selectedPurchaseOrder.items.map((item) => ({
          productId: item.productId,
          quantityOrdered: item.quantityOrdered,
          unitCost: item.unitCost,
        })),
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [selectedPurchaseOrder, open]);

  const handleFieldChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((previous) => {
      const items = [...previous.items];
      items[index] = { ...items[index], [field]: value };
      return { ...previous, items };
    });
  };

  const addItemRow = () => {
    setForm((previous) => ({ ...previous, items: [...previous.items, { ...EMPTY_ITEM }] }));
  };

  const removeItemRow = (index) => {
    setForm((previous) => ({ ...previous, items: previous.items.filter((_, i) => i !== index) }));
  };

  const subtotal = form.items.reduce(
    (sum, item) => sum + (Number(item.quantityOrdered) || 0) * (Number(item.unitCost) || 0),
    0
  );

  const validateForm = () => {
    const validationErrors = {};

    if (!form.supplierId) {
      validationErrors.supplierId = "Select a supplier.";
    }

    if (form.items.length === 0) {
      validationErrors.items = "Add at least one item.";
    } else if (form.items.some((item) => !item.productId || !item.quantityOrdered || item.unitCost === "")) {
      validationErrors.items = "Every item needs a product, quantity, and unit cost.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      supplierId: Number(form.supplierId),
      expectedDate: form.expectedDate || undefined,
      notes: form.notes || undefined,
      items: form.items.map((item) => ({
        productId: Number(item.productId),
        quantityOrdered: Number(item.quantityOrdered),
        unitCost: Number(item.unitCost),
      })),
    };

    setSaving(true);
    try {
      if (mode === "edit") {
        await onSave(selectedPurchaseOrder.id, payload);
      } else {
        await onSave(payload);
      }
      setForm(emptyForm());
      setErrors({});
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "edit" ? "Edit Purchase Order" : "New Purchase Order"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Supplier"
            value={form.supplierId}
            onChange={(event) => handleFieldChange("supplierId", event.target.value)}
            error={!!errors.supplierId}
            helperText={errors.supplierId}
            fullWidth
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Expected Date"
            type="date"
            value={form.expectedDate}
            onChange={(event) => handleFieldChange("expectedDate", event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Divider />

          <Typography variant="subtitle2">Items</Typography>

          {errors.items && <Alert severity="error">{errors.items}</Alert>}

          {form.items.map((item, index) => (
            <Box key={index} display="flex" gap={1} alignItems="center">
              <TextField
                select
                label="Product"
                value={item.productId}
                onChange={(event) => handleItemChange(index, "productId", event.target.value)}
                sx={{ flex: 3 }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Qty"
                type="number"
                value={item.quantityOrdered}
                onChange={(event) => handleItemChange(index, "quantityOrdered", event.target.value)}
                sx={{ flex: 1 }}
              />

              <TextField
                label="Unit Cost"
                type="number"
                value={item.unitCost}
                onChange={(event) => handleItemChange(index, "unitCost", event.target.value)}
                sx={{ flex: 1 }}
              />

              <IconButton onClick={() => removeItemRow(index)} disabled={form.items.length === 1}>
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Box>
          ))}

          <Button startIcon={<AddRoundedIcon />} onClick={addItemRow} sx={{ alignSelf: "flex-start" }}>
            Add Item
          </Button>

          <Divider />

          <Typography variant="subtitle1" textAlign="right">
            Subtotal: KES {subtotal.toLocaleString()}
          </Typography>

          <TextField
            label="Notes"
            value={form.notes}
            onChange={(event) => handleFieldChange("notes", event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}