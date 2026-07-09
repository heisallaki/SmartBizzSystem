import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function DeleteCustomerDialog({
  open,
  customer,
  loading = false,
  onClose,
  onDelete,
}) {
  const handleDelete = async () => {
    if (!customer) return;

    await onDelete(customer.id);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Customer
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ pt: 1 }}
        >
          <WarningAmberRoundedIcon
            color="warning"
            sx={{ fontSize: 60 }}
          />

          <Typography variant="h6">
            Are you sure?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            You are about to permanently delete
            this customer.
          </Typography>

          {customer && (
            <Stack spacing={0.5}>
              <Typography fontWeight={600}>
                {customer.fullName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {customer.email}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {customer.phone}
              </Typography>
            </Stack>
          )}

          <Typography
            variant="caption"
            color="error"
          >
            This action cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading
            ? "Deleting..."
            : "Delete Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}