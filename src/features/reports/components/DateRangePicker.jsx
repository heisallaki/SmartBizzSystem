import PropTypes from "prop-types";

import { Stack, TextField } from "@mui/material";

function DateRangePicker({ value, onChange }) {
  const handleStartChange = (event) => {
    onChange({
      ...value,
      startDate: event.target.value || null,
    });
  };

  const handleEndChange = (event) => {
    onChange({
      ...value,
      endDate: event.target.value || null,
    });
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
    >
      <TextField
        label="Start Date"
        type="date"
        size="small"
        value={value.startDate || ""}
        onChange={handleStartChange}
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: value.endDate || undefined }}
        sx={{ minWidth: { xs: "100%", sm: 200 } }}
      />

      <TextField
        label="End Date"
        type="date"
        size="small"
        value={value.endDate || ""}
        onChange={handleEndChange}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: value.startDate || undefined }}
        sx={{ minWidth: { xs: "100%", sm: 200 } }}
      />
    </Stack>
  );
}

DateRangePicker.propTypes = {
  value: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateRangePicker;