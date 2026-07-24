import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function ResetPasswordDialog({ open, user, onClose, onReset }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset Password</DialogTitle>

      <DialogContent>
        <Typography>
          Generate a new temporary password for <strong>{user?.fullName}</strong>? Their
          current password will stop working immediately, and you'll need to share the new
          one with them directly.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={onReset}>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}