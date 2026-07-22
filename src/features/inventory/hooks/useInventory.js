import {
  useEffect,
  useMemo,
  useState,
} from "react";

import inventoryService from "../services/inventory.service";

export default function useInventory() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [status, setStatus] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogMode, setDialogMode] = useState("add");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [productToDelete, setProductToDelete] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
  const loadProducts = async () => {
    setLoading(true);

    const data =
      await inventoryService.getProducts();

    setProducts(data);

    setLoading(false);
  };

  loadProducts();
}, []);

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const addProduct = async (product) => {
  const newProduct =
    await inventoryService.createProduct(
      product
    );

  setProducts((previousProducts) => [
    ...previousProducts,
    newProduct,
  ]);

  showSnackbar(
    "Product added successfully."
  );
};

  const updateProduct = async (
  updatedProduct
) => {
  await inventoryService.updateProduct(
    updatedProduct
  );

  setProducts((previousProducts) =>
    previousProducts.map((product) =>
      product.id === updatedProduct.id
        ? updatedProduct
        : product
    )
  );

  showSnackbar(
    "Product updated successfully."
  );
};

  const deleteProduct = async () => {
  if (!productToDelete) return;

  await inventoryService.deleteProduct(
    productToDelete.id
  );

  setProducts((previousProducts) =>
    previousProducts.filter(
      (product) =>
        product.id !== productToDelete.id
    )
  );

  setDeleteDialogOpen(false);

  setProductToDelete(null);

  showSnackbar(
    "Product deleted successfully."
  );
};

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEdit = (product) => {
    setDialogMode("edit");
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products.map(
          (product) => product.category
        )
      ),
    ],
    [products]
  );

  const statuses = [
    "All",
    "In Stock",
    "Low Stock",
    "Out of Stock",
  ];

  const sortOptions = [
    "Newest",
    "Oldest",
    "Name (A-Z)",
    "Name (Z-A)",
    "Price (Low-High)",
    "Price (High-Low)",
    "Stock (Low-High)",
    "Stock (High-Low)",
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.sku
            .toLowerCase()
            .includes(query)
      );
    }

    if (category !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.category === category
      );
    }

    if (status !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.status === status
      );
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;

      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;

      case "Name (A-Z)":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "Name (Z-A)":
        filtered.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      case "Price (Low-High)":
        filtered.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "Price (High-Low)":
        filtered.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "Stock (Low-High)":
        filtered.sort(
          (a, b) => a.stock - b.stock
        );
        break;

      case "Stock (High-Low)":
        filtered.sort(
          (a, b) => b.stock - a.stock
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    products,
    search,
    category,
    status,
    sortBy,
  ]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.stock * product.price,
    0
  );

  const lowStockItems = products.filter(
    (product) =>
      product.status === "Low Stock"
  ).length;

  return {
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
  };
}