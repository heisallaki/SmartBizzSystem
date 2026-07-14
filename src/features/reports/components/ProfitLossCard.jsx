// src/features/reports/components/ProfitLossCard.jsx

import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function ProfitLossCard({
  revenue,
  expenses,
  grossProfit,
  netProfit,
}) {
  const grossMargin =
    revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  const netMargin =
    revenue > 0 ? (netProfit / revenue) * 100 : 0;

  const profitable = netProfit >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Profit & Loss
          </Typography>

          <Chip
            color={profitable ? "success" : "error"}
            icon={
              profitable ? (
                <TrendingUpRoundedIcon />
              ) : (
                <TrendingDownRoundedIcon />
              )
            }
            label={profitable ? "Profitable" : "Loss"}
          />
        </Stack>

        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Revenue
            </Typography>

            <Typography fontWeight={600}>
              {currencyFormatter.format(revenue)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Expenses
            </Typography>

            <Typography fontWeight={600}>
              {currencyFormatter.format(expenses)}
            </Typography>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Gross Profit
            </Typography>

            <Typography
              fontWeight={700}
              color="success.main"
            >
              {currencyFormatter.format(grossProfit)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Gross Margin
            </Typography>

            <Typography fontWeight={600}>
              {grossMargin.toFixed(1)}%
            </Typography>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Net Profit
            </Typography>

            <Typography
              fontWeight={700}
              color={
                profitable
                  ? "success.main"
                  : "error.main"
              }
            >
              {currencyFormatter.format(netProfit)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography color="text.secondary">
              Net Margin
            </Typography>

            <Typography fontWeight={600}>
              {netMargin.toFixed(1)}%
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

ProfitLossCard.propTypes = {
  revenue: PropTypes.number.isRequired,
  expenses: PropTypes.number.isRequired,
  grossProfit: PropTypes.number.isRequired,
  netProfit: PropTypes.number.isRequired,
};

export default ProfitLossCard;