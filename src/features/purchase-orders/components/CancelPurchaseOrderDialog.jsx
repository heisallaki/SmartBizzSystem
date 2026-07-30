import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function CancelPurchaseOrderDialog({ open, purchaseOrder, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cancel Purchase Order</DialogTitle>

      <DialogContent>
        <Typography>
          Cancel <strong>{purchaseOrder?.poNumber}</strong>? This can't be undone, and you'll need to
          create a new purchase order if you still need these items.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Keep It</Button>

        <Button color="warning" variant="contained" onClick={onConfirm}>
          Cancel Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}