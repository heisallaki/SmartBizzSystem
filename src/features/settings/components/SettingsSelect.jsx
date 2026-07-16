import PropTypes from "prop-types";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function SettingsSelect({
  label,
  name,
  value,
  options,
  onChange,
  helperText = "",
  fullWidth = true,
  disabled = false,
  size = "medium",
}) {
  const labelId = `${name}-label`;

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
    >
      <InputLabel id={labelId}>
        {label}
      </InputLabel>

      <Select
        labelId={labelId}
        id={name}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

SettingsSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf([
    "small",
    "medium",
  ]),
};

SettingsSelect.defaultProps = {
  helperText: "",
  fullWidth: true,
  disabled: false,
  size: "medium",
};