import {
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const EMPTY_LINE = { description: "", quantity: "", unitPrice: "" };

export default function CreateInvoiceDialog({ open, onClose, onCreateFromSale, onCreateStandalone, customers, sales }) {
  const [tab, setTab] = useState(0);
  const [saleId, setSaleId] = useState("");
  const [dueInDays, setDueInDays] = useState(30);
  const [notes, setNotes] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ ...EMPTY_LINE }]);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(0);
      setSaleId("");
      setDueInDays(30);
      setNotes("");
      setCustomerId("");
      setItems([{ ...EMPTY_LINE }]);
      setErrors({});
    }
  }, [open]);

  const handleItemChange = (index, field, value) => {
    setItems((previous) => {
      const next = [...previous];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addLine = () => setItems((previous) => [...previous, { ...EMPTY_LINE }]);
  const removeLine = (index) => setItems((previous) => previous.filter((_, i) => i !== index));

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 0) {
        if (!saleId) {
          setErrors({ saleId: "Select a sale." });
          setSaving(false);
          return;
        }
        await onCreateFromSale({ saleId: Number(saleId), dueInDays: Number(dueInDays), notes: notes || undefined });
      } else {
        if (!customerId) {
          setErrors({ customerId: "Select a customer." });
          setSaving(false);
          return;
        }
        if (items.some((item) => !item.description || !item.quantity || item.unitPrice === "")) {
          setErrors({ items: "Every line needs a description, quantity, and unit price." });
          setSaving(false);
          return;
        }
        await onCreateStandalone({
          customerId,
          items: items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
          dueInDays: Number(dueInDays),
          notes: notes || undefined,
        });
      }
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>New Invoice</DialogTitle>

      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 3 }}>
        <Tab label="From a Sale" />
        <Tab label="Standalone" />
      </Tabs>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {tab === 0 ? (
            <TextField
              select
              label="Sale"
              value={saleId}
              onChange={(event) => setSaleId(event.target.value)}
              error={!!errors.saleId}
              helperText={errors.saleId || "Only completed sales with a registered customer can be invoiced."}
              fullWidth
            >
              {sales.map((sale) => (
                <MenuItem key={sale.id} value={sale.id}>
                  {sale.invoice} — {sale.customerName} — KES {sale.total.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <>
              <TextField
                select
                label="Customer"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                error={!!errors.customerId}
                helperText={errors.customerId}
                fullWidth
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.fullName}
                  </MenuItem>
                ))}
              </TextField>

              <Divider />

              <Typography variant="subtitle2">Line Items</Typography>

              {errors.items && <Typography color="error" variant="body2">{errors.items}</Typography>}

              {items.map((item, index) => (
                <Box key={index} display="flex" gap={1} alignItems="center">
                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(event) => handleItemChange(index, "description", event.target.value)}
                    sx={{ flex: 3 }}
                  />

                  <TextField
                    label="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(event) => handleItemChange(index, "quantity", event.target.value)}
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    label="Unit Price"
                    type="number"
                    value={item.unitPrice}
                    onChange={(event) => handleItemChange(index, "unitPrice", event.target.value)}
                    sx={{ flex: 1 }}
                  />

                  <IconButton onClick={() => removeLine(index)} disabled={items.length === 1}>
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Box>
              ))}

              <Button startIcon={<AddRoundedIcon />} onClick={addLine} sx={{ alignSelf: "flex-start" }}>
                Add Line
              </Button>

              <Divider />

              <Typography variant="subtitle1" textAlign="right">
                Subtotal: KES {subtotal.toLocaleString()}
              </Typography>
            </>
          )}

          <TextField
            label="Due In (days)"
            type="number"
            value={dueInDays}
            onChange={(event) => setDueInDays(event.target.value)}
            fullWidth
          />

          <TextField
            label="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
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
          {saving ? "Creating..." : "Create Invoice"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}