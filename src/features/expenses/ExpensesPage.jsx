import Box from "@mui/material/Box";

import PageHeader from "../../components/common/PageHeader";

import ExpensesToolbar from "./components/ExpensesToolbar";
import ExpensesStats from "./components/ExpensesStats";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseTableSkeleton from "./components/ExpenseTableSkeleton";
import ExpenseDialog from "./components/ExpenseDialog";
import DeleteExpenseDialog from "./components/DeleteExpenseDialog";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

import useExpenses from "./hooks/useExpenses";

export default function ExpensesPage() {
  const {
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
  } = useExpenses();

  const handleSave = (expense) =>
    dialogMode === "edit" ? updateExpense(expense) : addExpense(expense);

  return (
    <Box>
      <PageHeader title="Expenses" subtitle="Track and manage business expenses." />

      <ExpensesStats
        totalExpenses={totalExpenses}
        totalAmount={totalAmount}
        thisMonthAmount={thisMonthAmount}
        categoryCount={categoryCount}
      />

      <ExpensesToolbar
        search={search}
        onSearch={setSearch}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
        paymentMethod={paymentMethod}
        paymentMethods={paymentMethods}
        onPaymentMethodChange={setPaymentMethod}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onSortChange={setSortBy}
        onAdd={handleAdd}
      />

      {loading ? (
        <ExpenseTableSkeleton />
      ) : (
        <ExpenseTable rows={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ExpenseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        selectedExpense={selectedExpense}
        mode={dialogMode}
        suppliers={suppliers}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        expense={expenseToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={deleteExpense}
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