import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import InventoryToolbar from "./components/InventoryToolbar";
import InventoryStats from "./components/InventoryStats";
import ProductTable from "./components/ProductTable";
import ProductTableSkeleton from "./components/ProductTableSkeleton";
import ProductDialog from "./components/ProductDialog";
import DeleteProductDialog from "./components/DeleteProductDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useInventory from "./hooks/useInventory";

export default function InventoryPage() {
  const {
    loading,

    filteredProducts,

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

    totalProducts,
    totalStock,
    inventoryValue,
    lowStockItems,

    openDialog,
    setOpenDialog,

    dialogMode,

    selectedProduct,

    addProduct,
    updateProduct,

    deleteDialogOpen,
    setDeleteDialogOpen,

    productToDelete,
    deleteProduct,

    handleAdd,
    handleEdit,
    handleDelete,

    snackbar,
    closeSnackbar,
  } = useInventory();

  const handleSave = (product) => {
    if (dialogMode === "edit") {
      updateProduct(product);
    } else {
      addProduct(product);
    }

    setOpenDialog(false);
  };

  return (
    <Box>
      <PageHeader
        title="Inventory"
        subtitle="Manage products and stock levels."
      />

      <InventoryStats
        totalProducts={totalProducts}
        totalStock={totalStock}
        inventoryValue={inventoryValue}
        lowStockItems={lowStockItems}
      />

      <InventoryToolbar
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
        <ProductTableSkeleton />
      ) : (
        <ProductTable
          rows={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        selectedProduct={selectedProduct}
        mode={dialogMode}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        product={productToDelete}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        onDelete={deleteProduct}
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