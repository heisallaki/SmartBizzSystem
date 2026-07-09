import {
  Box,
  Chip,
  Divider,
  Drawer,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import formatCurrency from "../../../utils/formatCurrency";

const DetailItem = ({
  icon,
  label,
  value,
}) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="flex-start"
  >
    {icon}

    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography fontWeight={500}>
        {value || "-"}
      </Typography>
    </Box>
  </Stack>
);

export default function CustomerDetailsDrawer({
  open,
  customer,
  onClose,
}) {
  if (!customer) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: {
            xs: 340,
            sm: 430,
          },
          p: 3,
        }}
      >
        <Stack
          spacing={1}
          mb={3}
        >
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {customer.fullName}
          </Typography>

          <Chip
            label={customer.status}
            color={
              customer.status === "Active"
                ? "success"
                : "default"
            }
            sx={{ width: "fit-content" }}
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={12}>
            <DetailItem
              icon={<PersonOutlineOutlinedIcon />}
              label="Customer ID"
              value={customer.id}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={<BusinessOutlinedIcon />}
              label="Company"
              value={
                customer.company ||
                "Individual Customer"
              }
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={<EmailOutlinedIcon />}
              label="Email"
              value={customer.email}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={<PhoneOutlinedIcon />}
              label="Phone"
              value={customer.phone}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={
                <LocationOnOutlinedIcon />
              }
              label="Address"
              value={`${customer.address.street}, ${customer.address.city}, ${customer.address.county}, ${customer.address.country}`}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          mb={2}
        >
          Customer Summary
        </Typography>

        <Grid container spacing={3}>
          <Grid size={12}>
            <DetailItem
              icon={
                <ReceiptLongOutlinedIcon />
              }
              label="Total Orders"
              value={customer.totalOrders}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={
                <AccountBalanceWalletOutlinedIcon />
              }
              label="Total Spent"
              value={formatCurrency(
                customer.totalSpent
              )}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={
                <AccountBalanceWalletOutlinedIcon />
              }
              label="Outstanding Balance"
              value={formatCurrency(
                customer.outstandingBalance
              )}
            />
          </Grid>

          <Grid size={12}>
            <DetailItem
              icon={
                <ReceiptLongOutlinedIcon />
              }
              label="Last Purchase"
              value={
                customer.lastPurchase ||
                "No purchases yet"
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          mb={2}
        >
          Notes
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <NotesOutlinedIcon />

          <Typography color="text.secondary">
            {customer.notes ||
              "No notes available."}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          gutterBottom
        >
          Purchase History
        </Typography>

        {customer.purchaseHistory
          ?.length ? (
          <Stack spacing={2}>
            {customer.purchaseHistory.map(
              (purchase) => (
                <Box
                  key={purchase.id}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography
                    fontWeight={600}
                  >
                    {purchase.invoice}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {purchase.date}
                  </Typography>

                  <Typography
                    mt={1}
                  >
                    {formatCurrency(
                      purchase.total
                    )}
                  </Typography>
                </Box>
              )
            )}
          </Stack>
        ) : (
          <Typography
            color="text.secondary"
          >
            Purchase history will appear
            here once the Sales module is
            connected.
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}