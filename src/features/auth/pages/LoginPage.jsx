import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background:
          "linear-gradient(135deg,#7C3AED,#0F766E)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: 420,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          SBS
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Welcome back
        </Typography>

        <LoginForm />
      </Paper>
    </Box>
  );
}