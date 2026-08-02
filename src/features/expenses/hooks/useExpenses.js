import { useEffect, useMemo, useState } from "react";

import expenseService from "../services/expense.service";
import suppliersService from "../../suppliers/services/suppliers.service";

import { PAYMENT_METHODS } from "../../../constants/sales";

export default function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [paymentMethod, setPaymentMethod] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogMode, setDialogMode] = useState("add");

  const [selectedExpense, setSelectedExpense] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);

      const [expenseData, supplierData] = await Promise.all([
        expenseService.getExpenses(),
        suppliersService.getSuppliers(),
      ]);

      setExpenses(expenseData);
      setSuppliers(supplierData);

      setLoading(false);
    };

    loadExpenses();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, severity, message });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({ ...previous, open: false }));
  };

  const addExpense = async (expense) => {
    try {
      const newExpense = await expenseService.createExpense(expense);

      setExpenses((previousExpenses) => [...previousExpenses, newExpense]);

      showSnackbar("Expense added successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const updateExpense = async (updatedExpense) => {
    try {
      const saved = await expenseService.updateExpense(updatedExpense);

      setExpenses((previousExpenses) =>
        previousExpenses.map((expense) => (expense.id === saved.id ? saved : expense))
      );

      showSnackbar("Expense updated successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const deleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await expenseService.deleteExpense(expenseToDelete.id);

      setExpenses((previousExpenses) =>
        previousExpenses.filter((expense) => expense.id !== expenseToDelete.id)
      );

      showSnackbar("Expense deleted successfully.");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedExpense(null);
    setOpenDialog(true);
  };

  const handleEdit = (expense) => {
    setDialogMode("edit");
    setSelectedExpense(expense);
    setOpenDialog(true);
  };

  const handleDelete = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const categories = useMemo(
    () => ["All", ...new Set(expenses.map((expense) => expense.category))],
    [expenses]
  );

  const paymentMethods = ["All", ...PAYMENT_METHODS];

  const sortOptions = [
    "Newest",
    "Oldest",
    "Date (Newest)",
    "Date (Oldest)",
    "Amount (High-Low)",
    "Amount (Low-High)",
  ];

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query)
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((expense) => expense.category === category);
    }

    if (paymentMethod !== "All") {
      filtered = filtered.filter((expense) => expense.paymentMethod === paymentMethod);
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;

      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;

      case "Date (Newest)":
        filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
        break;

      case "Date (Oldest)":
        filtered.sort((a, b) => (a.date > b.date ? 1 : -1));
        break;

      case "Amount (High-Low)":
        filtered.sort((a, b) => b.amount - a.amount);
        break;

      case "Amount (Low-High)":
        filtered.sort((a, b) => a.amount - b.amount);
        break;

      default:
        break;
    }

    return filtered;
  }, [expenses, search, category, paymentMethod, sortBy]);

  const totalExpenses = expenses.length;

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonthKey = new Date().toISOString().slice(0, 7);

  const thisMonthAmount = expenses
    .filter((expense) => expense.date.startsWith(currentMonthKey))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryCount = new Set(expenses.map((expense) => expense.category)).size;

  return {
    loading,

    filteredExpenses,

    search,
    setSearch,

    category,
    setCategory,
    categories,

    paymentMethod,
    setPaymentMethod,
    paymentMethods,

    sortBy,
    setSortBy,
    sortOptions,

    totalExpenses,
    totalAmount,
    thisMonthAmount,
    categoryCount,

    suppliers,

    openDialog,
    setOpenDialog,

    dialogMode,

    selectedExpense,

    addExpense,
    updateExpense,

    deleteDialogOpen,
    setDeleteDialogOpen,

    expenseToDelete,

    deleteExpense,

    handleAdd,
    handleEdit,
    handleDelete,

    snackbar,
    closeSnackbar,
  };
}