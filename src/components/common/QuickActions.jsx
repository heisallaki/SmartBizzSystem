import {
  Paper,
  Typography,
  Stack,
  Button,
} from "@mui/material";

import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 4,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
      >
        Quick Actions
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Frequently used actions
      </Typography>

      <Stack spacing={2.5}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartRoundedIcon />}
          onClick={() => navigate("/sales")}
        >
          New Sale
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Inventory2RoundedIcon />}
          onClick={() => navigate("/inventory")}
        >
          Add Product
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<PersonAddRoundedIcon />}
          onClick={() => navigate("/customers")}
        >
          Add Customer
        </Button>
      </Stack>
    </Paper>
  );
}