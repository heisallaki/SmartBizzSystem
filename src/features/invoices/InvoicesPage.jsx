import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import InvoicesToolbar from "./components/InvoicesToolbar";
import InvoicesStats from "./components/InvoicesStats";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceTableSkeleton from "./components/InvoiceTableSkeleton";
import CreateInvoiceDialog from "./components/CreateInvoiceDialog";
import RecordPaymentDialog from "./components/RecordPaymentDialog";
import VoidInvoiceDialog from "./components/VoidInvoiceDialog";
import DeleteInvoiceDialog from "./components/DeleteInvoiceDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useInvoices from "./hooks/useInvoices";

export default function InvoicesPage() {
  const {
    loading,

    customers,
    sales,

    filteredInvoices,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,
    statuses,

    sortBy,
    setSortBy,
    sortOptions,

    totalInvoices,
    unpaidInvoices,
    overdueInvoices,
    totalOutstanding,

    createDialogOpen,
    setCreateDialogOpen,
    createFromSale,
    createStandalone,

    paymentDialogOpen,
    setPaymentDialogOpen,
    invoiceForPayment,
    recordPayment,

    voidDialogOpen,
    setVoidDialogOpen,
    invoiceToVoid,
    confirmVoid,

    deleteDialogOpen,
    setDeleteDialogOpen,
    invoiceToDelete,
    confirmDelete,

    handleRecordPayment,
    handleVoid,
    handleDelete,

    snackbar,
    closeSnackbar,
  } = useInvoices();

  return (
    <Box>
      <PageHeader title="Invoices" subtitle="Bill customers and track payments." />

      <InvoicesStats
        totalInvoices={totalInvoices}
        unpaidInvoices={unpaidInvoices}
        overdueInvoices={overdueInvoices}
        totalOutstanding={totalOutstanding}
      />

      <InvoicesToolbar
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        statuses={statuses}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAdd={() => setCreateDialogOpen(true)}
      />

      {loading ? (
        <InvoiceTableSkeleton />
      ) : (
        <InvoiceTable
          rows={filteredInvoices}
          onRecordPayment={handleRecordPayment}
          onVoid={handleVoid}
          onDelete={handleDelete}
        />
      )}

      <CreateInvoiceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateFromSale={createFromSale}
        onCreateStandalone={createStandalone}
        customers={customers}
        sales={sales}
      />

      <RecordPaymentDialog
        open={paymentDialogOpen}
        invoice={invoiceForPayment}
        onClose={() => setPaymentDialogOpen(false)}
        onRecordPayment={recordPayment}
      />

      <VoidInvoiceDialog
        open={voidDialogOpen}
        invoice={invoiceToVoid}
        onClose={() => setVoidDialogOpen(false)}
        onConfirm={confirmVoid}
      />

      <DeleteInvoiceDialog
        open={deleteDialogOpen}
        invoice={invoiceToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
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