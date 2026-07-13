import {
  Add,
  Search,
} from "@mui/icons-material";

import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";

export default function SalesToolbar({
  search,
  onSearch,

  dateFilter,
  onDateFilterChange,

  customerFilter,
  customerOptions,
  onCustomerFilterChange,

  paymentFilter,
  paymentOptions,
  onPaymentFilterChange,

  statusFilter,
  statusOptions,
  onStatusFilterChange,

  sortBy,
  sortOptions,
  onSortChange,

  onAddSale,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
      }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <TextField
            fullWidth
            label="Search Sales"
            placeholder="Invoice or customer..."
            value={search}
            onChange={(event) =>
              onSearch(
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
            sm: 6,
            md: 2,
          }}
        >
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={dateFilter}
            onChange={(event) =>
              onDateFilterChange(
                event.target.value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2,
          }}
        >
          <TextField
            select
            fullWidth
            label="Customer"
            value={customerFilter}
            onChange={(event) =>
              onCustomerFilterChange(
                event.target.value
              )
            }
          >
            {customerOptions.map(
              (customer) => (
                <MenuItem
                  key={customer}
                  value={customer}
                >
                  {customer}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2,
          }}
        >
          <TextField
            select
            fullWidth
            label="Payment"
            value={paymentFilter}
            onChange={(event) =>
              onPaymentFilterChange(
                event.target.value
              )
            }
          >
            {paymentOptions.map(
              (payment) => (
                <MenuItem
                  key={payment}
                  value={payment}
                >
                  {payment}
                </MenuItem>
              )
            )}
          </TextField>
                  </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 2,
          }}
        >
          <TextField
            select
            fullWidth
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value
              )
            }
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                value={status}
              >
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <TextField
            select
            fullWidth
            label="Sort By"
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value)
            }
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={onAddSale}
            sx={{
              height: "56px",
            }}
          >
            New Sale
          </Button>
        </Grid>

      </Grid>
    </Paper>
  );
}