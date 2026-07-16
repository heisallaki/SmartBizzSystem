import PropTypes from "prop-types";

import {
  SaveRounded,
  RestartAltRounded,
} from "@mui/icons-material";

import {
  Alert,
  Button,
  Paper,
  Stack,
} from "@mui/material";

export default function SaveSettingsBar({
  visible,
  saving,
  onSave,
  onReset,
}) {
  if (!visible) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: "sticky",
        bottom: 16,
        zIndex: (theme) => theme.zIndex.appBar,

        mt: 4,
        p: 2,
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
      >
        <Alert
          severity="warning"
          sx={{
            flex: 1,
          }}
        >
          You have unsaved changes.
        </Alert>

        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltRounded />}
            disabled={saving}
            onClick={onReset}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveRounded />}
            disabled={saving}
            onClick={onSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

SaveSettingsBar.propTypes = {
  visible: PropTypes.bool.isRequired,
  saving: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

SaveSettingsBar.defaultProps = {
  saving: false,
};