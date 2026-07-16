import PropTypes from "prop-types";

import {
  DownloadRounded,
} from "@mui/icons-material";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export default function ExportDialog({
  open,
  loading,
  onClose,
  onExport,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Export Settings
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Export your SmartBizz settings as a JSON file. This file can later
            be imported into another SmartBizz installation or used as a backup.
          </Typography>

          <Typography variant="body2">
            The exported file includes:
          </Typography>

          <Stack component="ul" spacing={0.5} sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">
              General Settings
            </Typography>

            <Typography component="li" variant="body2">
              Business Settings
            </Typography>

            <Typography component="li" variant="body2">
              Appearance
            </Typography>

            <Typography component="li" variant="body2">
              Notifications
            </Typography>

            <Typography component="li" variant="body2">
              User Preferences
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
         variant="contained"
         startIcon={<DownloadRounded />}
         onClick={onExport}
         disabled={loading}
        >
            {loading ? "Exporting..." : "Export"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

ExportDialog.defaultProps = {
  loading: false,
};