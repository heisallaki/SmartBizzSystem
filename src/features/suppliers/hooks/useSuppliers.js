import {
  useEffect,
  useMemo,
  useState,
} from "react";

import suppliersService from "../../../services/suppliers/suppliers.service";

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [status, setStatus] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogMode, setDialogMode] = useState("add");

  const [selectedSupplier, setSelectedSupplier] =
    useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [supplierToDelete, setSupplierToDelete] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const loadSuppliers = async () => {
      setLoading(true);

      const data =
        await suppliersService.getSuppliers();

      setSuppliers(data);

      setLoading(false);
    };

    loadSuppliers();
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

  const addSupplier = async (supplier) => {
    const newSupplier =
      await suppliersService.createSupplier(
        supplier
      );

    setSuppliers((previousSuppliers) => [
      ...previousSuppliers,
      newSupplier,
    ]);

    showSnackbar(
      "Supplier added successfully."
    );
  };

  const updateSupplier = async (
    updatedSupplier
  ) => {
    await suppliersService.updateSupplier(
      updatedSupplier
    );

    setSuppliers((previousSuppliers) =>
      previousSuppliers.map((supplier) =>
        supplier.id === updatedSupplier.id
          ? updatedSupplier
          : supplier
      )
    );

    showSnackbar(
      "Supplier updated successfully."
    );
  };

  const deleteSupplier = async () => {
    if (!supplierToDelete) return;

    await suppliersService.deleteSupplier(
      supplierToDelete.id
    );

    setSuppliers((previousSuppliers) =>
      previousSuppliers.filter(
        (supplier) =>
          supplier.id !== supplierToDelete.id
      )
    );

    setDeleteDialogOpen(false);

    setSupplierToDelete(null);

    showSnackbar(
      "Supplier deleted successfully."
    );
  };

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedSupplier(null);
    setOpenDialog(true);
  };

  const handleEdit = (supplier) => {
    setDialogMode("edit");
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        suppliers.map(
          (supplier) => supplier.category
        )
      ),
    ],
    [suppliers]
  );

  const statuses = [
    "All",
    "Active",
    "On Hold",
    "Inactive",
  ];

  const sortOptions = [
    "Newest",
    "Oldest",
    "Name (A-Z)",
    "Name (Z-A)",
    "Total Spend (Low-High)",
    "Total Spend (High-Low)",
    "Orders (Low-High)",
    "Orders (High-Low)",
  ];

  const filteredSuppliers = useMemo(() => {
    let filtered = [...suppliers];

    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (supplier) =>
          supplier.name
            .toLowerCase()
            .includes(query) ||
          supplier.contactPerson
            .toLowerCase()
            .includes(query) ||
          supplier.email
            .toLowerCase()
            .includes(query)
      );
    }

    if (category !== "All") {
      filtered = filtered.filter(
        (supplier) =>
          supplier.category === category
      );
    }

    if (status !== "All") {
      filtered = filtered.filter(
        (supplier) =>
          supplier.status === status
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

      case "Total Spend (Low-High)":
        filtered.sort(
          (a, b) => a.totalSpend - b.totalSpend
        );
        break;

      case "Total Spend (High-Low)":
        filtered.sort(
          (a, b) => b.totalSpend - a.totalSpend
        );
        break;

      case "Orders (Low-High)":
        filtered.sort(
          (a, b) => a.totalOrders - b.totalOrders
        );
        break;

      case "Orders (High-Low)":
        filtered.sort(
          (a, b) => b.totalOrders - a.totalOrders
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    suppliers,
    search,
    category,
    status,
    sortBy,
  ]);

  const totalSuppliers = suppliers.length;

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Active"
  ).length;

  const totalPurchaseValue = suppliers.reduce(
    (sum, supplier) =>
      sum + supplier.totalSpend,
    0
  );

  const onHoldSuppliers = suppliers.filter(
    (supplier) => supplier.status === "On Hold"
  ).length;

  return {
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
  };
}