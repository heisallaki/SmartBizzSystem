import {
  Box,
  Typography,
} from "@mui/material";

export default function EmptyState({
  message = "No data available.",
}) {
  return (
    <Box py={6} textAlign="center">
      <Typography color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}