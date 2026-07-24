import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Active", "Suspended", "Invited"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_USER = {
  fullName: "",
  email: "",
  phone: "",
  roleId: "",
  status: "Active",
  password: "",
};

export default function UserDialog({
  open,
  onClose,
  onSave,
  selectedUser,
  mode,
  roles,
  isSelf,
}) {
  const [form, setForm] = useState(EMPTY_USER);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setForm({ ...EMPTY_USER, ...selectedUser, password: "" });
    } else {
      setForm(EMPTY_USER);
    }

    setErrors({});
  }, [selectedUser, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!form.fullName.trim()) {
      validationErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(form.email)) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!form.roleId) {
      validationErrors.roleId = "Select a role.";
    }

    if (mode === "add" && form.password && form.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload =
      mode === "edit"
        ? {
            id: form.id,
            fullName: form.fullName,
            email: form.email,
            phone: form.phone || undefined,
            roleId: isSelf ? undefined : Number(form.roleId),
            status: isSelf ? undefined : form.status,
          }
        : {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone || undefined,
            roleId: Number(form.roleId),
            status: form.status,
            password: form.password || undefined,
          };

    setSaving(true);
    try {
      await onSave(payload);
      // Only reached on success — a thrown error (shown via snackbar by the
      // hook) leaves the dialog open with the form intact so it can be
      // corrected, rather than silently closing on a real server rejection.
      setForm(EMPTY_USER);
      setErrors({});
      onClose();
    } catch {
      // already surfaced via snackbar — nothing further to do here
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "edit" ? "Edit User" : "Add User"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {isSelf && (
            <Alert severity="info">
              You're editing your own account — role and status can only be changed by
              another Admin.
            </Alert>
          )}

          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Role"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            error={!!errors.roleId}
            helperText={errors.roleId}
            disabled={isSelf}
            fullWidth
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isSelf}
            fullWidth
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {mode === "add" && (
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || "Leave blank to auto-generate a temporary password"}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}