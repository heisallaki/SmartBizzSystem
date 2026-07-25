import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import SuppliersToolbar from "./components/SuppliersToolbar";
import SuppliersStats from "./components/SuppliersStats";
import SupplierTable from "./components/SupplierTable";
import SupplierTableSkeleton from "./components/SupplierTableSkeleton";
import SupplierDialog from "./components/SupplierDialog";
import DeleteSupplierDialog from "./components/DeleteSupplierDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useSuppliers from "./hooks/useSuppliers";

export default function SuppliersPage() {
  const {
    loading,

    filteredSuppliers,

    search,
    setSearch,

    category,
    setCategory,
    categories,

    status,
    setStatus,
    statuses,

    sortBy,
    setSortBy,
    sortOptions,

    totalSuppliers,
    activeSuppliers,
    totalPurchaseValue,
    onHoldSuppliers,

    openDialog,
    setOpenDialog,

    dialogMode,

    selectedSupplier,

    addSupplier,
    updateSupplier,

    deleteDialogOpen,
    setDeleteDialogOpen,

    supplierToDelete,
    deleteSupplier,

    handleAdd,
    handleEdit,
    handleDelete,

    snackbar,
    closeSnackbar,
  } = useSuppliers();

  // SupplierDialog awaits this and only closes itself on success — a thrown
  // error (already surfaced via snackbar inside useSuppliers.js) leaves the
  // dialog open so the fields can be corrected, instead of closing over a
  // real server rejection. 
  const handleSave = (supplier) =>
    dialogMode === "edit"
      ? updateSupplier(supplier)
      : addSupplier(supplier);

  return (
    <Box>
      <PageHeader
        title="Suppliers"
        subtitle="Manage supplier relationships and purchase activity."
      />

      <SuppliersStats
        totalSuppliers={totalSuppliers}
        activeSuppliers={activeSuppliers}
        totalPurchaseValue={totalPurchaseValue}
        onHoldSuppliers={onHoldSuppliers}
      />

      <SuppliersToolbar
        search={search}
        onSearch={setSearch}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
        status={status}
        statuses={statuses}
        onStatusChange={setStatus}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAdd={handleAdd}
      />

      {loading ? (
        <SupplierTableSkeleton />
      ) : (
        <SupplierTable
          rows={filteredSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <SupplierDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        selectedSupplier={selectedSupplier}
        mode={dialogMode}
      />

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        supplier={supplierToDelete}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        onDelete={deleteSupplier}
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