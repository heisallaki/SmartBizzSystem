import { useEffect, useMemo, useState } from "react";

import invoiceService from "../services/invoice.service";
import customerService from "../../customers/services/customer.service";
import salesService from "../../sales/services/sales.service";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState(null);

  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [invoiceToVoid, setInvoiceToVoid] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

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
      const [invoiceData, customerData, salesData] = await Promise.all([
        invoiceService.getInvoices(),
        customerService.getAll(),
        salesService.getSales(),
      ]);
      setInvoices(invoiceData);
      setCustomers(customerData);
      setSales(salesData.filter((sale) => sale.status === "Completed" && sale.customerId !== "walk-in"));
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createFromSale = async (payload) => {
    try {
      const created = await invoiceService.createFromSale(payload);
      setInvoices((previous) => [...previous, created]);
      showSnackbar("Invoice generated from sale.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const createStandalone = async (payload) => {
    try {
      const created = await invoiceService.createStandalone(payload);
      setInvoices((previous) => [...previous, created]);
      showSnackbar("Invoice created successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const recordPayment = async (payload) => {
    if (!invoiceForPayment) return;
    try {
      const updated = await invoiceService.recordPayment(invoiceForPayment.id, payload);
      setInvoices((previous) => previous.map((invoice) => (invoice.id === updated.id ? updated : invoice)));
      showSnackbar("Payment recorded.");
      setPaymentDialogOpen(false);
      setInvoiceForPayment(null);
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const confirmVoid = async () => {
    if (!invoiceToVoid) return;
    try {
      const updated = await invoiceService.voidInvoice(invoiceToVoid.id);
      setInvoices((previous) => previous.map((invoice) => (invoice.id === updated.id ? updated : invoice)));
      showSnackbar("Invoice voided.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setVoidDialogOpen(false);
      setInvoiceToVoid(null);
    }
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await invoiceService.deleteInvoice(invoiceToDelete.id);
      setInvoices((previous) => previous.filter((invoice) => invoice.id !== invoiceToDelete.id));
      showSnackbar("Invoice deleted.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleRecordPayment = (invoice) => {
    setInvoiceForPayment(invoice);
    setPaymentDialogOpen(true);
  };

  const handleVoid = (invoice) => {
    setInvoiceToVoid(invoice);
    setVoidDialogOpen(true);
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const statuses = ["All", "Unpaid", "PartiallyPaid", "Paid", "Overdue", "Void"];

  const sortOptions = ["Newest", "Oldest", "Balance Due (High-Low)", "Total (High-Low)"];

  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          (invoice.customerName || "").toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "Balance Due (High-Low)":
        filtered.sort((a, b) => b.balanceDue - a.balanceDue);
        break;
      case "Total (High-Low)":
        filtered.sort((a, b) => b.grandTotal - a.grandTotal);
        break;
      default:
        break;
    }

    return filtered;
  }, [invoices, search, statusFilter, sortBy]);

  const totalInvoices = invoices.length;
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "Unpaid").length;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "Overdue").length;
  const totalOutstanding = invoices
    .filter((invoice) => invoice.status !== "Void")
    .reduce((sum, invoice) => sum + invoice.balanceDue, 0);

  return {
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
  };
}