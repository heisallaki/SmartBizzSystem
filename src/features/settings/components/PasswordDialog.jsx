import PropTypes from "prop-types";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";

import SettingsTextField from "./SettingsTextField";

export default function PasswordDialog({
  open,
  passwords,
  showPasswords,

  onClose,
  onSave,

  onPasswordChange,
  onToggleVisibility,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Change Password
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <SettingsTextField
            label="Current Password"
            name="currentPassword"
            type={
              showPasswords.currentPassword
                ? "text"
                : "password"
            }
            value={passwords.currentPassword}
            onChange={onPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      onToggleVisibility(
                        "currentPassword"
                      )
                    }
                  >
                    {showPasswords.currentPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <SettingsTextField
            label="New Password"
            name="newPassword"
            type={
              showPasswords.newPassword
                ? "text"
                : "password"
            }
            value={passwords.newPassword}
            onChange={onPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      onToggleVisibility(
                        "newPassword"
                      )
                    }
                  >
                    {showPasswords.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <SettingsTextField
            label="Confirm Password"
            name="confirmPassword"
            type={
              showPasswords.confirmPassword
                ? "text"
                : "password"
            }
            value={passwords.confirmPassword}
            onChange={onPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      onToggleVisibility(
                        "confirmPassword"
                      )
                    }
                  >
                    {showPasswords.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Update Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,

  passwords: PropTypes.shape({
    currentPassword: PropTypes.string,
    newPassword: PropTypes.string,
    confirmPassword: PropTypes.string,
  }).isRequired,

  showPasswords: PropTypes.shape({
    currentPassword: PropTypes.bool,
    newPassword: PropTypes.bool,
    confirmPassword: PropTypes.bool,
  }).isRequired,

  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
};