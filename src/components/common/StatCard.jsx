import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Box,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  change,
}) {
  const positive = change.startsWith("+");

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 4,
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            {positive ? (
              <TrendingUpRoundedIcon color="success" />
            ) : (
              <TrendingDownRoundedIcon color="error" />
            )}
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            {value}
          </Typography>

          <Chip
            label={change}
            color={positive ? "success" : "error"}
            size="small"
            sx={{
              width: "fit-content",
              fontWeight: 700,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}