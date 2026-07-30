import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import PurchaseOrdersToolbar from "./components/PurchaseOrdersToolbar";
import PurchaseOrdersStats from "./components/PurchaseOrdersStats";
import PurchaseOrderTable from "./components/PurchaseOrderTable";
import PurchaseOrderTableSkeleton from "./components/PurchaseOrderTableSkeleton";
import PurchaseOrderDialog from "./components/PurchaseOrderDialog";
import ReceivePurchaseOrderDialog from "./components/ReceivePurchaseOrderDialog";
import CancelPurchaseOrderDialog from "./components/CancelPurchaseOrderDialog";
import DeletePurchaseOrderDialog from "./components/DeletePurchaseOrderDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import usePurchaseOrders from "./hooks/usePurchaseOrders";

export default function PurchaseOrdersPage() {
  const {
    loading,

    products,
    suppliers,

    filteredPurchaseOrders,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,
    statuses,

    supplierFilter,
    setSupplierFilter,
    supplierNames,

    sortBy,
    setSortBy,
    sortOptions,

    totalPurchaseOrders,
    openPurchaseOrders,
    receivedPurchaseOrders,
    totalPurchaseValue,

    openDialog,
    setOpenDialog,
    dialogMode,
    selectedPurchaseOrder,

    addPurchaseOrder,
    editPurchaseOrder,
    changeStatus,

    receiveDialogOpen,
    setReceiveDialogOpen,
    purchaseOrderToReceive,
    receiveItems,

    cancelDialogOpen,
    setCancelDialogOpen,
    purchaseOrderToCancel,
    confirmCancel,

    deleteDialogOpen,
    setDeleteDialogOpen,
    purchaseOrderToDelete,
    confirmDelete,

    handleAdd,
    handleEdit,
    handleReceive,
    handleCancel,
    handleDelete,

    snackbar,
    closeSnackbar,
  } = usePurchaseOrders();

  const handleSave = (idOrPayload, maybePayload) =>
    dialogMode === "edit" ? editPurchaseOrder(idOrPayload, maybePayload) : addPurchaseOrder(idOrPayload);

  return (
    <Box>
      <PageHeader title="Purchase Orders" subtitle="Order stock from suppliers and track receiving." />

      <PurchaseOrdersStats
        totalPurchaseOrders={totalPurchaseOrders}
        openPurchaseOrders={openPurchaseOrders}
        receivedPurchaseOrders={receivedPurchaseOrders}
        totalPurchaseValue={totalPurchaseValue}
      />

      <PurchaseOrdersToolbar
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        statuses={statuses}
        onStatusChange={setStatusFilter}
        supplier={supplierFilter}
        suppliers={supplierNames}
        onSupplierChange={setSupplierFilter}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAdd={handleAdd}
      />

      {loading ? (
        <PurchaseOrderTableSkeleton />
      ) : (
        <PurchaseOrderTable
          rows={filteredPurchaseOrders}
          onEdit={handleEdit}
          onAdvance={(row, nextStatus) => changeStatus(row.id, nextStatus)}
          onReceive={handleReceive}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}

      <PurchaseOrderDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        selectedPurchaseOrder={selectedPurchaseOrder}
        mode={dialogMode}
        suppliers={suppliers}
        products={products}
      />

      <ReceivePurchaseOrderDialog
        open={receiveDialogOpen}
        purchaseOrder={purchaseOrderToReceive}
        onClose={() => setReceiveDialogOpen(false)}
        onReceive={receiveItems}
      />

      <CancelPurchaseOrderDialog
        open={cancelDialogOpen}
        purchaseOrder={purchaseOrderToCancel}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={confirmCancel}
      />

      <DeletePurchaseOrderDialog
        open={deleteDialogOpen}
        purchaseOrder={purchaseOrderToDelete}
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