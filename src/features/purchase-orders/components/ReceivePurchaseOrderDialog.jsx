import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ReceivePurchaseOrderDialog({ open, purchaseOrder, onClose, onReceive }) {
  const [quantities, setQuantities] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (purchaseOrder) {
      const initial = {};
      purchaseOrder.items.forEach((item) => {
        initial[item.id] = "";
      });
      setQuantities(initial);
    }
  }, [purchaseOrder, open]);

  if (!purchaseOrder) return null;

  const handleChange = (itemId, value) => {
    setQuantities((previous) => ({ ...previous, [itemId]: value }));
  };

  const handleReceive = async () => {
    const items = purchaseOrder.items
      .filter((item) => Number(quantities[item.id]) > 0)
      .map((item) => ({
        purchaseOrderItemId: item.id,
        quantityReceived: Number(quantities[item.id]),
      }));

    if (items.length === 0) return;

    setSaving(true);
    try {
      await onReceive(items);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Receive Items — {purchaseOrder.poNumber}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {purchaseOrder.items.map((item) => {
            const remaining = item.quantityOrdered - item.quantityReceived;

            return (
              <Box key={item.id} display="flex" alignItems="center" gap={2}>
                <Box flex={2}>
                  <Typography variant="body2">{item.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ordered {item.quantityOrdered} · Received {item.quantityReceived} · Remaining {remaining}
                  </Typography>
                </Box>

                <TextField
                  label="Receive now"
                  type="number"
                  value={quantities[item.id] || ""}
                  onChange={(event) => handleChange(item.id, event.target.value)}
                  inputProps={{ min: 0, max: remaining }}
                  disabled={remaining === 0}
                  sx={{ flex: 1 }}
                />
              </Box>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleReceive} disabled={saving}>
          {saving ? "Saving..." : "Record Received Items"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}