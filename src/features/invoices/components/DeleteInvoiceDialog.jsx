import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function DeleteInvoiceDialog({ open, invoice, onClose, onDelete }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Invoice</DialogTitle>

      <DialogContent>
        <Typography>
          Delete <strong>{invoice?.invoiceNumber}</strong>? This removes it completely and can't be
          undone.
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