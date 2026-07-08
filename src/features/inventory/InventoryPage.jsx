import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import InventoryToolbar from "./components/InventoryToolbar";
import ProductTable from "./components/ProductTable";

import useInventory from "./hooks/useInventory";

export default function InventoryPage() {
  const {
  products,
  openDialog,
  setOpenDialog,
  addProduct,
} = useInventory();
  return (
    <Box>
      <PageHeader
        title="Inventory"
        subtitle="Manage products and stock levels."
      />

      <InventoryToolbar />

      <ProductTable rows={products} />

      
    </Box>
  );
}