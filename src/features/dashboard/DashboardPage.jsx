import { Box, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h4" fontWeight={700}>
        Welcome to SmartBizzSystem 👋
      </Typography>

      <Typography mt={2} color="text.secondary">
        Your dashboard is ready.
      </Typography>
    </Box>
  );
}