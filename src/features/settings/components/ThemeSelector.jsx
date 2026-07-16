import PropTypes from "prop-types";

import {
  CheckCircleRounded,
  DarkModeRounded,
  LightModeRounded,
  SettingsBrightnessRounded,
} from "@mui/icons-material";

import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const icons = {
  light: LightModeRounded,
  dark: DarkModeRounded,
  system: SettingsBrightnessRounded,
};

export default function ThemeSelector({
  value,
  options,
  onChange,
}) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
      >
        Theme
      </Typography>

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
      >
        {options.map((option) => {
          const selected = option.value === value;

          const Icon = icons[option.value];

          return (
            <Paper
              key={option.value}
              elevation={0}
              onClick={() => onChange(option.value)}
              sx={{
                flex: 1,
                cursor: "pointer",
                p: 2.5,
                borderRadius: 3,

                border: (theme) =>
                  `2px solid ${
                    selected
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,

                transition: "all .2s ease",

                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Icon
                    color={
                      selected
                        ? "primary"
                        : "action"
                    }
                  />

                  {selected && (
                    <CheckCircleRounded
                      color="primary"
                    />
                  )}
                </Stack>

                <Box
                  sx={{
                    height: 80,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      height: 20,
                      bgcolor:
                        option.value === "dark"
                          ? "grey.900"
                          : option.value === "light"
                          ? "grey.100"
                          : "grey.300",
                    }}
                  />

                  <Stack
                    direction="row"
                    sx={{
                      height: 60,
                    }}
                  >
                    <Box
                      sx={{
                        width: "30%",
                        bgcolor:
                          option.value === "dark"
                            ? "grey.800"
                            : "grey.200",
                      }}
                    />

                    <Box
                      sx={{
                        flex: 1,
                        bgcolor:
                          option.value === "dark"
                            ? "grey.700"
                            : "background.paper",
                      }}
                    />
                  </Stack>
                </Box>

                <Typography
                  fontWeight={600}
                >
                  {option.label}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}

ThemeSelector.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};