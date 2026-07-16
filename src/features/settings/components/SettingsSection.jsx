import PropTypes from "prop-types";

import {
  Grid,
  Stack,
  Typography,
} from "@mui/material";

export default function SettingsSection({
  title,
  description,
  children,
  spacing = 3,
  sx = {},
}) {
  return (
    <Stack
      spacing={3}
      sx={sx}
    >
      {(title || description) && (
        <Stack spacing={0.5}>
          {title && (
            <Typography
              variant="h5"
              fontWeight={700}
            >
              {title}
            </Typography>
          )}

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {description}
            </Typography>
          )}
        </Stack>
      )}

      <Grid
        container
        spacing={spacing}
      >
        {children}
      </Grid>
    </Stack>
  );
}

SettingsSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  spacing: PropTypes.number,
  sx: PropTypes.object,
};

SettingsSection.defaultProps = {
  title: "",
  description: "",
  spacing: 3,
  sx: {},
};