import {
  AddShoppingCart,
  Search,
} from "@mui/icons-material";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function ProductPickerModal({
  open,
  onClose,

  products,

  categories,
  category,
  onCategoryChange,

  search,
  onSearchChange,

  onSelectProduct,

  loading,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Add Product
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <TextField
              fullWidth
              label="Search Products"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(event) =>
                onCategoryChange(
                  event.target.value
                )
              }
            >
              {categories.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
        >
                    {products.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent:
                    "space-between",
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Typography
                      variant="h6"
                    >
                      {product.name}
                    </Typography>

                    <Chip
                      size="small"
                      label={
                        product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"
                      }
                      color={
                        product.stock > 0
                          ? "success"
                          : "error"
                      }
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    SKU: {product.sku}
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    Category:{" "}
                    {product.category}
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    Stock: {product.stock}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                  >
                    {new Intl.NumberFormat(
                      "en-KE",
                      {
                        style: "currency",
                        currency: "KES",
                      }
                    ).format(product.price)}
                  </Typography>
                </Stack>

                <Button
                  sx={{ mt: 3 }}
                  fullWidth
                  variant="contained"
                  startIcon={
                    <AddShoppingCart />
                  }
                  disabled={
                    loading ||
                    product.stock <= 0
                  }
                  onClick={() =>
                    onSelectProduct(
                      product
                    )
                  }
                >
                  Add to Cart
                </Button>
              </Paper>
            </Grid>
          ))}
                  </Grid>

        {!loading && products.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 5,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">
              No products found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Try changing the search term or
              selecting a different category.
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}