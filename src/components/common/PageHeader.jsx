import { Box, Stack, Typography } from "@mui/material";

export default function PageHeader({
  title,
  subtitle,
  action = null,
  children = null,
  mb = 4,
}) {
  return (
    <Box mb={mb}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              color="text.secondary"
              mt={1}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && <Box>{action}</Box>}
      </Stack>

      {children && (
        <Box mt={3}>
          {children}
        </Box>
      )}
    </Box>
  );
}