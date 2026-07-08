import {
  Box,
  Button,
  TextField,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function InventoryToolbar({
  onAdd,
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      gap={2}
      flexWrap="wrap"
    >
      <TextField
        label="Search products..."
        size="small"
        sx={{ minWidth: 300 }}
      />

      <Button
  variant="contained"
  startIcon={<AddRoundedIcon />}
  onClick={onAdd}
>
  Add Product
</Button>
    </Box>
  );
}