import Button from "@mui/material/Button";

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  fullWidth = false,
}) {
  return (
    <Button
      variant="contained"
      color="primary"
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}