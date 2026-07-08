import { useState } from "react";

import initialProducts from "../../../data/products";

export default function useInventory() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

const [dialogMode, setDialogMode] = useState("add");

const updateProduct = (updatedProduct) => {
  setProducts((previousProducts) =>
    previousProducts.map((product) =>
      product.id === updatedProduct.id
        ? updatedProduct
        : product
    )
  );
};

  const addProduct = (product) => {
    setProducts((previousProducts) => [
      ...previousProducts,
      {
        id: Date.now(),
        ...product,
      },
    ]);
  };

  return {
    updateProduct,
    products,
    search,
    setSearch,

    openDialog,
    setOpenDialog,

    addProduct,

    selectedProduct,
setSelectedProduct,

dialogMode,
setDialogMode,
  };
}