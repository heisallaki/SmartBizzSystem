import { Box, Button, CircularProgress, Stack, Tab, Tabs } from "@mui/material";

import PermissionTable from "./PermissionTable";

import SnackbarAlert from "../../../components/feedback/SnackbarAlert";

import usePermissionMatrix from "../hooks/usePermissionMatrix";

export default function PermissionMatrix() {
  const {
    roles,
    selectedRoleId,
    setSelectedRoleId,

    matrix,

    loading,
    loadingMatrix,
    saving,
    dirty,

    handlePermissionChange,
    save,
    discard,

    snackbar,
    closeSnackbar,
  } = usePermissionMatrix();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={selectedRoleId}
        onChange={(event, value) => setSelectedRoleId(value)}
        sx={{ mb: 2 }}
      >
        {roles.map((role) => (
          <Tab key={role.id} label={role.name} value={role.id} />
        ))}
      </Tabs>

      {loadingMatrix ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <PermissionTable permissions={matrix} onPermissionChange={handlePermissionChange} />
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button disabled={!dirty || saving} onClick={discard}>
          Discard Changes
        </Button>

        <Button variant="contained" disabled={!dirty || saving} onClick={save}>
          {saving ? "Saving..." : "Save Permissions"}
        </Button>
      </Stack>

      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </Box>
  );
}