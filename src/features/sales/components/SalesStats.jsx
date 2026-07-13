import {
  AttachMoney,
  ReceiptLong,
  TrendingUp,
  ShoppingCart,
} from "@mui/icons-material";

import { Grid } from "@mui/material";

import StatCard from "../../../components/common/StatCard";

const currency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function SalesStats({
  todayRevenue,
  todaySalesCount,
  monthlyRevenue,
  monthlySalesCount,
  averageOrderValue,
}) {
  return (
    <Grid
      container
      spacing={3}
      sx={{ mt: 1, mb: 4 }}
    >
      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3,
        }}
      >
        <StatCard
          title="Today's Revenue"
          value={currency(todayRevenue)}
          change={`${todaySalesCount} Sale${
            todaySalesCount === 1 ? "" : "s"
          }`}
          icon={<AttachMoney />}
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3,
        }}
      >
        <StatCard
          title="Today's Orders"
          value={todaySalesCount}
          change="Completed today"
          icon={<ReceiptLong />}
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3,
        }}
      >
        <StatCard
          title="Monthly Revenue"
          value={currency(monthlyRevenue)}
          change={`${monthlySalesCount} Sale${
            monthlySalesCount === 1 ? "" : "s"
          }`}
          icon={<TrendingUp />}
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          lg: 3,
        }}
      >
        <StatCard
          title="Average Order"
          value={currency(
            averageOrderValue
          )}
          change="Per transaction"
          icon={<ShoppingCart />}
        />
      </Grid>
    </Grid>
  );
}