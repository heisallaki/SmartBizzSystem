import {
  AddShoppingCart,
  Delete,
} from "@mui/icons-material";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

export default function CartPanel({
  cart,

  onAddProduct,

  onRemoveItem,

  onQuantityChange,

  onDiscountChange,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">
          Shopping Cart
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </Stack>

      {cart.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Cart is empty
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Click "Add Product" to begin
            creating a sale.
          </Typography>
        </Box>
      ) : (
        <Box
  sx={{
    overflowX: "auto",
  }}
>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>
          Product
        </TableCell>

        <TableCell align="right">
          Price
        </TableCell>

        <TableCell align="center">
          Qty
        </TableCell>

        <TableCell align="right">
          Discount
        </TableCell>

        <TableCell align="right">
          Total
        </TableCell>

        <TableCell />
      </TableRow>
    </TableHead>

    <TableBody>
      {cart.map((item) => (
        <TableRow
          key={item.productId}
          hover
        >
          <TableCell>
            <Stack spacing={0.5}>
              <Typography fontWeight={600}>
                {item.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {item.sku}
              </Typography>
            </Stack>
          </TableCell>

          <TableCell align="right">
            {formatCurrency(item.price)}
          </TableCell>

          <TableCell
            align="center"
            sx={{ width: 110 }}
          >
            <TextField
              size="small"
              type="number"
              value={item.quantity}
              inputProps={{
                min: 1,
                max: item.stock,
              }}
              onChange={(event) =>
                onQuantityChange(
                  item.productId,
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </TableCell>

          <TableCell
            align="right"
            sx={{ width: 120 }}
          >
            <TextField
              size="small"
              type="number"
              value={item.discount}
              inputProps={{
                min: 0,
              }}
              onChange={(event) =>
                onDiscountChange(
                  item.productId,
                  Number(
                    event.target.value
                  )
                )
              }
            />
          </TableCell>

          <TableCell align="right">
            <Typography fontWeight={600}>
              {formatCurrency(
                item.lineTotal
              )}
            </Typography>
          </TableCell>

          <TableCell align="center">
            <IconButton
              color="error"
              onClick={() =>
                onRemoveItem(
                  item.productId
                )
              }
            >
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>
      )}
    </Paper>
  );
}