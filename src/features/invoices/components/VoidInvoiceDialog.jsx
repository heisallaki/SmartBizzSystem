import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

export default function VoidInvoiceDialog({ open, invoice, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Void Invoice</DialogTitle>

      <DialogContent>
        <Typography>
          Void <strong>{invoice?.invoiceNumber}</strong>? It will stay on record for reference, but
          no further payments can be recorded against it.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Keep It</Button>

        <Button color="warning" variant="contained" onClick={onConfirm}>
          Void Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
}