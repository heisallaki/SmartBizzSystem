import { Chip, IconButton, Stack, Tooltip } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";

import formatDate from "../../../utils/formatDate";

const STATUS_COLOR = {
  Active: "success",
  Invited: "warning",
  Suspended: "error",
};

// currentUserId disables Reset Password / Deactivate on your own row —
// those actions need a different Admin, enforced server-side too, but
// disabling here avoids a round-trip just to show an error.
const userColumns = (onEdit, onResetPassword, onDeactivate, currentUserId) => [
  {
    field: "fullName",
    headerName: "Name",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "phone",
    headerName: "Phone",
    renderCell: (row) => row.phone || "—",
  },
  {
    field: "role",
    headerName: "Role",
    renderCell: (row) => <Chip size="small" label={row.role?.name} />,
  },
  {
    field: "status",
    headerName: "Status",
    renderCell: (row) => (
      <Chip size="small" label={row.status} color={STATUS_COLOR[row.status] || "default"} />
    ),
  },
  {
    field: "lastLoginAt",
    headerName: "Last Login",
    renderCell: (row) =>
      row.lastLoginAt
        ? formatDate(row.lastLoginAt, { dateStyle: "medium", timeStyle: "short" })
        : "Never logged in",
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",

    renderCell: (row) => {
      const isSelf = row.id === currentUserId;

      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton size="small" onClick={() => onEdit(row)}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>

          <Tooltip title={isSelf ? "Ask another Admin to reset your password" : "Reset password"}>
            <span>
              <IconButton
                size="small"
                disabled={isSelf}
                onClick={() => onResetPassword(row)}
              >
                <LockResetRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={isSelf ? "You can't deactivate your own account" : "Deactivate"}>
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={isSelf}
                onClick={() => onDeactivate(row)}
              >
                <PersonOffRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      );
    },
  },
];

export default userColumns;