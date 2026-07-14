import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import useReports from "./hooks/useReports";

import ReportsToolbar from "./components/ReportsToolbar";
import ExportMenu from "./components/ExportMenu";
import ReportsStats from "./components/ReportsStats";
import RevenueChart from "./components/RevenueChart";
import ProfitLossCard from "./components/ProfitLossCard";
import SalesReportTable from "./components/SalesReportTable";
import InventoryReportTable from "./components/InventoryReportTable";
import CustomerReportTable from "./components/CustomerReportTable";
import BestSellingProducts from "./components/BestSellingProducts";
import LowStockReport from "./components/LowStockReport";
import ReportSkeleton from "./components/ReportSkeleton";

function ReportsPage() {
  const {
    loading,

    selectedTab,
    dateFilter,

    stats,

    revenueTrend,

    salesReport,
    inventoryReport,
    customerReport,
    bestSellingProducts,
    lowStockProducts,

    refreshReports,

    setSelectedTab,
    setDateFilter,

    exportPdf,
    exportExcel,
    printReport,
  } = useReports();

  if (loading) {
    return <ReportSkeleton />;
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "flex-start",
        }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Reports
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Monitor revenue, inventory, customers and
            overall business performance.
          </Typography>
        </Box>

        <ExportMenu
          onPdfExport={exportPdf}
          onExcelExport={exportExcel}
          onPrint={printReport}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: (theme) =>
            `1px solid ${theme.palette.divider}`,
        }}
      >
        <ReportsToolbar
          selectedTab={selectedTab}
          dateFilter={dateFilter}
          onTabChange={setSelectedTab}
          onDateFilterChange={setDateFilter}
          onRefresh={refreshReports}
        />
      </Paper>

      {selectedTab === "overview" && (
        <Stack spacing={3}>
          <ReportsStats stats={stats} />

          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
                lg: 8,
              }}
            >
              <RevenueChart
                title="Revenue & Profit Trends"
                subtitle="Monthly business performance"
                data={revenueTrend}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <ProfitLossCard
                revenue={stats.revenue}
                expenses={stats.expenses}
                grossProfit={stats.grossProfit}
                netProfit={stats.netProfit}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
                lg: 6,
              }}
            >
              <BestSellingProducts
                rows={bestSellingProducts}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                lg: 6,
              }}
            >
              <LowStockReport
                rows={lowStockProducts}
              />
            </Grid>
          </Grid>
        </Stack>
      )}

      {selectedTab === "sales" && (
        <SalesReportTable
          rows={salesReport}
        />
      )}

      {selectedTab === "inventory" && (
        <InventoryReportTable
          rows={inventoryReport}
        />
      )}

      {selectedTab === "customers" && (
        <CustomerReportTable
          rows={customerReport}
        />
      )}
    </Stack>
  );
}

export default ReportsPage;