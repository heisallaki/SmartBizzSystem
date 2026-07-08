import { Grid } from "@mui/material";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import SalesChart from "../../components/common/SalesChart";
import RecentTransactions from "../../components/common/RecentTransactions";
import LowStockProducts from "../../components/common/LowStockProducts";
import QuickActions from "../../components/common/QuickActions";

import dashboardData from "../../data/dashboardData";
import salesChartData from "../../data/salesChartData";
import recentTransactions from "../../data/recentTransactions";
import lowStockProducts from "../../data/lowStockProducts";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your business."
      />

      <Grid container spacing={4} sx={{ mt: 2, width: "100%" }}>
  {dashboardData.stats.map((stat) => (
    <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 3 }}>
      <StatCard
        title={stat.title}
        value={stat.value}
        change={stat.change}
      />
    </Grid>
  ))}

  <Grid size={{ xs: 12, lg: 9 }} sx={{ mt: 1 }}
 >
    <SalesChart data={salesChartData} />
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