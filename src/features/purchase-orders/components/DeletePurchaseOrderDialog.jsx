import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function DeletePurchaseOrderDialog({ open, purchaseOrder, onClose, onDelete }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Purchase Order</DialogTitle>

      <DialogContent>
        <Typography>
          Delete the draft <strong>{purchaseOrder?.poNumber}</strong>? This removes it completely.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="error" variant="contained" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}