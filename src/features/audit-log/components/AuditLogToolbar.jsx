import { Box, MenuItem, TextField, Typography } from "@mui/material";

export default function AuditLogToolbar({
  userId,
  userOptions,
  onUserChange,

  entityType,
  entityTypeOptions,
  onEntityTypeChange,

  action,
  actionOptions,
  onActionChange,

  total,
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mb={3}
      flexWrap="wrap"
    >
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          select
          label="Performed By"
          value={userId}
          onChange={(event) => onUserChange(event.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {userOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Entity"
          value={entityType}
          onChange={(event) => onEntityTypeChange(event.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          {entityTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Action"
          value={action}
          onChange={(event) => onActionChange(event.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        >
          {actionOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {`${total.toLocaleString()} events`}
      </Typography>
    </Box>
  );
}