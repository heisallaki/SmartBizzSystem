import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function DeactivateUserDialog({ open, user, onClose, onDeactivate }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Deactivate User</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to deactivate <strong>{user?.fullName}</strong>? They'll no
          longer be able to log in, but their sales and activity history is kept.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="error" variant="contained" onClick={onDeactivate}>
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
}