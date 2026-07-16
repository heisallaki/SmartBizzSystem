import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function SettingsCard({
  title,
  description,
  children,
  action = null,
  sx = {},
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        ...sx,
      }}
    >
      {(title || description || action) && (
        <>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{
              px: 3,
              py: 2.5,
            }}
          >
            <Stack
              spacing={0.5}
              flex={1}
            >
              {title && (
                <Typography
                  variant="h6"
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

            {action}
          </Stack>

          <Divider />
        </>
      )}

      <CardContent
        sx={{
          p: 3,
          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Stack spacing={2.5}>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

SettingsCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  action: PropTypes.node,
  sx: PropTypes.object,
};

SettingsCard.defaultProps = {
  title: "",
  description: "",
  action: null,
  sx: {},
};