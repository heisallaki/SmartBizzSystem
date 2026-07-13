import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";
import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import SalesStats from "./components/SalesStats";
import SalesToolbar from "./components/SalesToolbar";
import SalesTable from "./components/SalesTable";
import SalesTableSkeleton from "./components/SalesTableSkeleton";
import CreateSaleDialog from "./components/CreateSaleDialog";
import SaleDetailsDialog from "./components/SaleDetailsDialog";

import useSales from "./hooks/useSales";

export default function SalesPage() {
  const {
    loading,

    filteredSales,

    search,
    setSearch,

    dateFilter,
    setDateFilter,

    customerFilter,
    setCustomerFilter,
    customerOptions,

    paymentFilter,
    setPaymentFilter,
    paymentOptions,

    statusFilter,
    setStatusFilter,
    statusOptions,

    sortBy,
    setSortBy,
    sortOptions,

    todayRevenue,
    todaySalesCount,
    monthlyRevenue,
    monthlySalesCount,
    averageOrderValue,

    createDialogOpen,
    setCreateDialogOpen,

    detailsDialogOpen,
    setDetailsDialogOpen,

    selectedSale,
    setSelectedSale,

    addSaleToList,

    snackbar,
    showSnackbar,
    closeSnackbar,
  } = useSales();

  const handleSaleCreated = (sale) => {
    addSaleToList(sale);

    showSnackbar(
      "Sale completed successfully."
    );

    setCreateDialogOpen(false);
  };

  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setDetailsDialogOpen(true);
  };

  return (
    <Box>
      <PageHeader
        title="Sales"
        subtitle="Manage sales transactions."
      />

      <SalesStats
        todayRevenue={todayRevenue}
        todaySalesCount={todaySalesCount}
        monthlyRevenue={monthlyRevenue}
        monthlySalesCount={monthlySalesCount}
        averageOrderValue={averageOrderValue}
      />

      <SalesToolbar
        search={search}
        onSearch={setSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customerFilter={customerFilter}
        customerOptions={customerOptions}
        onCustomerFilterChange={setCustomerFilter}
        paymentFilter={paymentFilter}
        paymentOptions={paymentOptions}
        onPaymentFilterChange={setPaymentFilter}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAddSale={() =>
          setCreateDialogOpen(true)
        }
      />

      {loading ? (
        <SalesTableSkeleton />
      ) : (
        <SalesTable
          rows={filteredSales}
          onView={handleViewSale}
        />
      )}

      <CreateSaleDialog
        open={createDialogOpen}
        onClose={() =>
          setCreateDialogOpen(false)
        }
        onSaleCreated={handleSaleCreated}
      />

      <SaleDetailsDialog
        open={detailsDialogOpen}
        sale={selectedSale}
        onClose={() =>
          setDetailsDialogOpen(false)
        }
      />

      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </Box>
  );
}