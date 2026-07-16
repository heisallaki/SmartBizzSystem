import PropTypes from "prop-types";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export default function ConfirmationDialog({
  open,
  loading,

  title,
  message,

  icon,

  confirmText,
  cancelText,

  confirmColor,

  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{ pt: 1 }}
        >
          {icon}

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {message}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Please wait..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,

  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,

  icon: PropTypes.node,

  confirmText: PropTypes.string,
  cancelText: PropTypes.string,

  confirmColor: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ]),

  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmationDialog.defaultProps = {
  loading: false,

  icon: null,

  confirmText: "Confirm",
  cancelText: "Cancel",

  confirmColor: "primary",
};