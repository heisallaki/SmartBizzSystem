import {
  Alert,
  Snackbar,
} from "@mui/material";

export default function SnackbarAlert({
  open,
  onClose,
  severity = "success",
  message = "",
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={onClose}
        sx={{
          width: "100%",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}