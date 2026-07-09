import { Grid, MenuItem, TextField } from "@mui/material";

export default function CustomerForm({
  values,
  errors = {},
  onChange,
}) {
  const handleFieldChange =
    (field) => (event) => {
      onChange(field, event.target.value);
    };

  const handleAddressChange =
    (field) => (event) => {
      onChange(
        `address.${field}`,
        event.target.value
      );
    };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="First Name"
          value={values.firstName}
          onChange={handleFieldChange("firstName")}
          error={Boolean(errors.firstName)}
          helperText={errors.firstName}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Last Name"
          value={values.lastName}
          onChange={handleFieldChange("lastName")}
          error={Boolean(errors.lastName)}
          helperText={errors.lastName}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          type="email"
          label="Email Address"
          value={values.email}
          onChange={handleFieldChange("email")}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Phone Number"
          value={values.phone}
          onChange={handleFieldChange("phone")}
          error={Boolean(errors.phone)}
          helperText={errors.phone}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Company"
          value={values.company}
          onChange={handleFieldChange("company")}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Tax Number"
          value={values.taxNumber}
          onChange={handleFieldChange("taxNumber")}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          label="Street Address"
          value={values.address.street}
          onChange={handleAddressChange("street")}
          error={Boolean(errors.street)}
          helperText={errors.street}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="City"
          value={values.address.city}
          onChange={handleAddressChange("city")}
          error={Boolean(errors.city)}
          helperText={errors.city}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="County"
          value={values.address.county}
          onChange={handleAddressChange("county")}
          error={Boolean(errors.county)}
          helperText={errors.county}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Postal Code"
          value={values.address.postalCode}
          onChange={handleAddressChange("postalCode")}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Country"
          value={values.address.country}
          onChange={handleAddressChange("country")}
          error={Boolean(errors.country)}
          helperText={errors.country}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          label="Status"
          value={values.status}
          onChange={handleFieldChange("status")}
        >
          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Notes"
          value={values.notes}
          onChange={handleFieldChange("notes")}
        />
      </Grid>
    </Grid>
  );
}