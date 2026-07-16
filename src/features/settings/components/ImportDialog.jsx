import PropTypes from "prop-types";
import { useRef } from "react";

import {
  UploadFileRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export default function ImportDialog({
  open,
  loading,
  selectedFile,
  onClose,
  onImport,
  onFileSelect,
}) {
  const fileInputRef = useRef(null);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

    event.target.value = "";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Import Settings
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Import a previously exported SmartBizz settings
            file. Existing settings will be replaced.
          </Typography>

          <Box
            sx={{
              border: (theme) =>
                `2px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <UploadFileRounded
                color="action"
                fontSize="large"
              />

              <Typography variant="body2">
                {selectedFile
                  ? selectedFile.name
                  : "No file selected"}
              </Typography>

              <Button
                variant="outlined"
                onClick={handleBrowse}
                disabled={loading}
              >
                Choose File
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Supported format: <strong>.json</strong>
          </Typography>

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
          />
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
          onClick={onImport}
          disabled={!selectedFile || loading}
        >
          {loading ? "Importing..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ImportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  selectedFile: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
};

ImportDialog.defaultProps = {
  loading: false,
  selectedFile: null,
};