import PropTypes from "prop-types";
import { useRef } from "react";

import {
  Avatar,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import SettingsCard from "./SettingsCard";

export default function LogoUploader({
  logo,
  businessName,
  onUpload,
  onRemove,
  disabled = false,
}) {
  const inputRef = useRef(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    onUpload(file);

    event.target.value = "";
  };

  return (
    <SettingsCard
      title="Business Logo"
      description="Upload the logo displayed on invoices, receipts and reports."
    >
      <Stack
        spacing={3}
        alignItems="center"
      >
        <Avatar
          src={logo || undefined}
          alt={businessName}
          sx={{
            width: 120,
            height: 120,
            fontSize: 36,
          }}
        >
          {!logo &&
            businessName?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          PNG, JPG or WEBP
          <br />
          Recommended size: 512 × 512 pixels
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <Button
            variant="contained"
            onClick={handleBrowse}
            disabled={disabled}
          >
            {logo ? "Replace Logo" : "Upload Logo"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={!logo || disabled}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Stack>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
        />
      </Stack>
    </SettingsCard>
  );
}

LogoUploader.propTypes = {
  logo: PropTypes.string,
  businessName: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

LogoUploader.defaultProps = {
  logo: null,
  businessName: "",
  disabled: false,
};