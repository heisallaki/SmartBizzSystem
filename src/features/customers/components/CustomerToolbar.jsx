import {
  Box,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import PrimaryButton from "../../../components/ui/PrimaryButton";
import { CUSTOMER_STATUS_OPTIONS } from "../constants/customerFilters";

export default function CustomerToolbar({
  search,
  setSearch,
  filters,
  setFilters,
  onAddCustomer,
}) {
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleStatusChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      status: event.target.value,
    }));
  };

  return (
    <Stack
      spacing={2}
      direction={{
        xs: "column",
        md: "row",
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "stretch",
        md: "center",
      }}
    >
      <Stack
        spacing={2}
        direction={{
          xs: "column",
          md: "row",
        }}
        flex={1}
      >
        <TextField
          fullWidth
          size="small"
          label="Search Customers"
          placeholder="Name, email, phone..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  color="action"
                  fontSize="small"
                />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={filters.status}
          onChange={handleStatusChange}
          sx={{
            minWidth: 180,
          }}
        >
          {CUSTOMER_STATUS_OPTIONS.map(
            (option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            )
          )}
        </TextField>
      </Stack>

      <Box>
        <PrimaryButton
          onClick={onAddCustomer}
        >
          Add Customer
        </PrimaryButton>
      </Box>
    </Stack>
  );
}