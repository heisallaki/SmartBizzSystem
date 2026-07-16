import PropTypes from "prop-types";

import { TextField } from "@mui/material";

export default function SettingsTextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  helperText = "",
  error = false,
  multiline = false,
  rows = 4,
  fullWidth = true,
  disabled = false,
  required = false,
  readOnly = false,
  size = "medium",
  InputProps = {},
  ...rest
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      size={size}
      InputProps={{
        readOnly,
        ...InputProps,
      }}
      {...rest}
    />
  );
}

SettingsTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,

  type: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,

  error: PropTypes.bool,

  multiline: PropTypes.bool,
  rows: PropTypes.number,

  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,

  size: PropTypes.oneOf([
    "small",
    "medium",
  ]),

  InputProps: PropTypes.object,
};

SettingsTextField.defaultProps = {
  type: "text",
  placeholder: "",
  helperText: "",

  error: false,

  multiline: false,
  rows: 4,

  fullWidth: true,
  disabled: false,
  required: false,
  readOnly: false,

  size: "medium",

  InputProps: {},
};