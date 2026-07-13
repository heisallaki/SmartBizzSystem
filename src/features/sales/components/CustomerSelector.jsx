import {
  Autocomplete,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function CustomerSelector({
  customers = [],
  customer,
  setCustomer,
  walkInCustomer,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="h6"
          fontWeight={600}
        >
          Customer
        </Typography>

        <Autocomplete
          options={[
            walkInCustomer,
            ...customers.filter(
              (c) => c.id !== walkInCustomer.id
            ),
          ]}
          value={customer}
          onChange={(_, value) =>
            setCustomer(value || walkInCustomer)
          }
          isOptionEqualToValue={(option, value) =>
            option.id === value.id
          }
          getOptionLabel={(option) =>
            option?.fullName || ""
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Customer"
              placeholder="Search customer..."
            />
          )}
        />

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Selected Customer
          </Typography>

          <Typography fontWeight={600}>
            {customer?.fullName}
          </Typography>

          {customer?.email && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {customer.email}
            </Typography>
          )}

          {customer?.phone && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {customer.phone}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}