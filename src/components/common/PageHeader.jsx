import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle }) {
  return (
    <Box mb={4}>
      <Typography variant="h4" fontWeight={700}>
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
  );
}