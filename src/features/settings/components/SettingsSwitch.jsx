import PropTypes from "prop-types";

import {
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export default function SettingsSwitch({
  title,
  description,
  checked,
  onChange,
  name,
  disabled = false,
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: "100%",
        py: 1.5,
      }}
    >
      <Stack
        spacing={0.25}
        flex={1}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        )}
      </Stack>

      <FormControlLabel
        sx={{ ml: 2, mr: 0 }}
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            name={name}
            disabled={disabled}
          />
        }
        label=""
      />
    </Stack>
  );
}

SettingsSwitch.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

SettingsSwitch.defaultProps = {
  description: "",
  name: "",
  disabled: false,
};