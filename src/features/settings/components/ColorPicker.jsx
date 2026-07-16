import PropTypes from "prop-types";

import {
  Check,
} from "@mui/icons-material";

import {
  Box,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const previewColors = {
  teal: "#0F766E",
  blue: "#2563EB",
  purple: "#7C3AED",
  green: "#16A34A",
  orange: "#EA580C",
};

export default function ColorPicker({
  colors,
  value,
  onChange,
  title = "Primary Color",
  description = "",
}) {
  return (
    <Stack spacing={2}>
      <Box>
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
            sx={{ mt: 0.5 }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
      >
        {colors.map((color) => {
          const selected = color.value === value;

          return (
            <Tooltip
              key={color.value}
              title={color.label}
              arrow
            >
              <Box
                onClick={() => onChange(color.value)}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  bgcolor: previewColors[color.value],
                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  border: (theme) =>
                    selected
                      ? `3px solid ${theme.palette.primary.main}`
                      : `2px solid ${theme.palette.divider}`,

                  transition: "all 0.2s ease",

                  "&:hover": {
                    transform: "scale(1.08)",
                  },
                }}
              >
                {selected && (
                  <Check
                    sx={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Stack>
  );
}

ColorPicker.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

ColorPicker.defaultProps = {
  title: "Primary Color",
  description: "",
};