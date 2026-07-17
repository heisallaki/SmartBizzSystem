import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const COPY = {
  void: {
    title: "Void Sale",
    confirmLabel: "Void Sale",
    message: (sale) =>
      `Void ${sale?.invoice}? Its status will change to Cancelled` +
      (sale?.status === "Completed"
        ? ", stock will be restored, and it will be removed from the customer's purchase history."
        : "."),
    warning: null,
  },
  delete: {
    title: "Delete Sale",
    confirmLabel: "Delete Sale",
    message: (sale) =>
      `Permanently delete ${sale?.invoice}? This cannot be undone.` +
      (sale?.status === "Completed"
        ? " Stock will be restored and it will be removed from the customer's purchase history."
        : ""),
    warning:
      "This removes the record entirely — voiding keeps it for your records.",
  },
};

export default function SaleConfirmDialog({
  open,
  sale,
  action,
  loading,
  onClose,
  onConfirm,
}) {
  const copy = COPY[action] || COPY.void;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{copy.title}</DialogTitle>

      <DialogContent>
        <Typography>{copy.message(sale)}</Typography>

        {copy.warning && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {copy.warning}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Working..." : copy.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}