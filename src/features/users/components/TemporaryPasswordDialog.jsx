import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export default function TemporaryPasswordDialog({ open, info, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!info?.password) return;
    await navigator.clipboard.writeText(info.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Temporary Password</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Alert severity="warning">
            This password is shown only once and can't be retrieved again. Copy it now and
            share it with <strong>{info?.email}</strong> directly.
          </Alert>

          <TextField
            label="Temporary Password"
            value={info?.password || ""}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton onClick={handleCopy} edge="end">
                      <ContentCopyRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          {copied && (
            <Typography variant="caption" color="success.main">
              Copied to clipboard.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}