import { Alert, Box, CircularProgress, Grid } from "@mui/material";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import SalesChart from "../../components/common/SalesChart";
import RecentTransactions from "../../components/common/RecentTransactions";
import LowStockProducts from "../../components/common/LowStockProducts";
import QuickActions from "../../components/common/QuickActions";

import formatCurrency from "../../utils/formatCurrency";

import useDashboard from "./hooks/useDashboard";

export default function DashboardPage() {
  const { loading, error, statCards, salesChart, recentTransactions, lowStockProducts } =
    useDashboard();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your business."
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2, width: "100%" }}>
        {statCards.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title={stat.title}
              value={stat.isCurrency ? formatCurrency(stat.value) : stat.value.toLocaleString()}
              change={stat.change}
            />
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 9 }} sx={{ mt: 1 }}>
          <SalesChart data={salesChart} />
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          <RecentTransactions data={recentTransactions} />
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Grid container spacing={4} direction="column">
            <Grid size={12}>
              <LowStockProducts data={lowStockProducts} />
            </Grid>

            <Grid size={12}>
              <QuickActions />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}