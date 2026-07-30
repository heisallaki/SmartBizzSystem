import { useEffect, useMemo, useState } from "react";

import purchaseOrderService from "../services/purchaseOrder.service";
import inventoryService from "../../inventory/services/inventory.service";
import suppliersService from "../../suppliers/services/suppliers.service";

export default function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [purchaseOrderToReceive, setPurchaseOrderToReceive] = useState(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [purchaseOrderToCancel, setPurchaseOrderToCancel] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({ ...previous, open: false }));
  };

  const load = async () => {
    setLoading(true);
    try {
      const [poData, productData, supplierData] = await Promise.all([
        purchaseOrderService.getPurchaseOrders(),
        inventoryService.getProducts(),
        suppliersService.getSuppliers(),
      ]);
      setPurchaseOrders(poData);
      setProducts(productData);
      setSuppliers(supplierData);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addPurchaseOrder = async (payload) => {
    try {
      const created = await purchaseOrderService.createPurchaseOrder(payload);
      setPurchaseOrders((previous) => [...previous, created]);
      showSnackbar("Purchase order created successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const editPurchaseOrder = async (id, payload) => {
    try {
      const updated = await purchaseOrderService.updatePurchaseOrder(id, payload);
      setPurchaseOrders((previous) => previous.map((po) => (po.id === updated.id ? updated : po)));
      showSnackbar("Purchase order updated successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const updated = await purchaseOrderService.updateStatus(id, status);
      setPurchaseOrders((previous) => previous.map((po) => (po.id === updated.id ? updated : po)));
      showSnackbar(`Purchase order marked as ${status}.`);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const confirmCancel = async () => {
    if (!purchaseOrderToCancel) return;
    try {
      const updated = await purchaseOrderService.updateStatus(purchaseOrderToCancel.id, "Cancelled");
      setPurchaseOrders((previous) => previous.map((po) => (po.id === updated.id ? updated : po)));
      showSnackbar("Purchase order cancelled.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setCancelDialogOpen(false);
      setPurchaseOrderToCancel(null);
    }
  };

  const receiveItems = async (items) => {
    if (!purchaseOrderToReceive) return;
    try {
      const updated = await purchaseOrderService.receivePurchaseOrder(purchaseOrderToReceive.id, items);
      setPurchaseOrders((previous) => previous.map((po) => (po.id === updated.id ? updated : po)));
      setProducts(await inventoryService.getProducts());
      showSnackbar("Received items recorded.");
      setReceiveDialogOpen(false);
      setPurchaseOrderToReceive(null);
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!purchaseOrderToDelete) return;
    try {
      await purchaseOrderService.deletePurchaseOrder(purchaseOrderToDelete.id);
      setPurchaseOrders((previous) => previous.filter((po) => po.id !== purchaseOrderToDelete.id));
      showSnackbar("Purchase order deleted.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeleteDialogOpen(false);
      setPurchaseOrderToDelete(null);
    }
  };

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedPurchaseOrder(null);
    setOpenDialog(true);
  };

  const handleEdit = (po) => {
    setDialogMode("edit");
    setSelectedPurchaseOrder(po);
    setOpenDialog(true);
  };

  const handleReceive = (po) => {
    setPurchaseOrderToReceive(po);
    setReceiveDialogOpen(true);
  };

  const handleCancel = (po) => {
    setPurchaseOrderToCancel(po);
    setCancelDialogOpen(true);
  };

  const handleDelete = (po) => {
    setPurchaseOrderToDelete(po);
    setDeleteDialogOpen(true);
  };

  const supplierNames = useMemo(
    () => ["All", ...new Set(suppliers.map((supplier) => supplier.name))],
    [suppliers]
  );

  const statuses = ["All", "Draft", "Submitted", "Approved", "PartiallyReceived", "Received", "Cancelled"];

  const sortOptions = ["Newest", "Oldest", "Total (Low-High)", "Total (High-Low)"];

  const filteredPurchaseOrders = useMemo(() => {
    let filtered = [...purchaseOrders];

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (po) =>
          po.poNumber.toLowerCase().includes(query) ||
          (po.supplierName || "").toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((po) => po.status === statusFilter);
    }

    if (supplierFilter !== "All") {
      filtered = filtered.filter((po) => po.supplierName === supplierFilter);
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "Total (Low-High)":
        filtered.sort((a, b) => a.grandTotal - b.grandTotal);
        break;
      case "Total (High-Low)":
        filtered.sort((a, b) => b.grandTotal - a.grandTotal);
        break;
      default:
        break;
    }

    return filtered;
  }, [purchaseOrders, search, statusFilter, supplierFilter, sortBy]);

  const totalPurchaseOrders = purchaseOrders.length;
  const openPurchaseOrders = purchaseOrders.filter((po) =>
    ["Draft", "Submitted", "Approved", "PartiallyReceived"].includes(po.status)
  ).length;
  const receivedPurchaseOrders = purchaseOrders.filter((po) => po.status === "Received").length;
  const totalPurchaseValue = purchaseOrders
    .filter((po) => po.status !== "Cancelled")
    .reduce((sum, po) => sum + po.grandTotal, 0);

  return {
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
  };
}