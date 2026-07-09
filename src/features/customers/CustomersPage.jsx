import { useState } from "react";

import {
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";

import useCustomers from "./hooks/useCustomers";

import CustomerPageContent from "./components/CustomerPageContent";
import CustomersDialogs from "./components/CustomersDialogs";

import SnackbarAlert from "../../components/feedback/SnackbarAlert";

export default function CustomersPage() {
  const {
    customers,
    statistics,

    loading,
    saving,
    error,

    search,
    setSearch,

    filters,
    setFilters,

    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    delete: false,
    details: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const openDialog = (dialog) =>
    setDialogs((prev) => ({
      ...prev,
      [dialog]: true,
    }));

  const closeDialog = (dialog) =>
    setDialogs((prev) => ({
      ...prev,
      [dialog]: false,
    }));

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    openDialog("details");
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    openDialog("edit");
  };

  const handleDeleteCustomer = (
    customer
  ) => {
    setSelectedCustomer(customer);
    openDialog("delete");
  };

  const handleCreateCustomer = async (
    customer
  ) => {
    try {
      await createCustomer(customer);

      closeDialog("add");

      showSnackbar(
        "Customer created successfully."
      );
    } catch {
      showSnackbar(
        "Failed to create customer.",
        "error"
      );
    }
  };

  const handleUpdateCustomer = async (
    id,
    customer
  ) => {
    try {
      await updateCustomer(id, customer);

      closeDialog("edit");

      showSnackbar(
        "Customer updated successfully."
      );
    } catch {
      showSnackbar(
        "Failed to update customer.",
        "error"
      );
    }
  };

  const handleDeleteConfirmed =
    async (id) => {
      try {
        await deleteCustomer(id);

        closeDialog("delete");

        showSnackbar(
          "Customer deleted successfully."
        );

        setSelectedCustomer(null);
      } catch {
        showSnackbar(
          "Failed to delete customer.",
          "error"
        );
      }
    };

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <CustomerPageContent
        statistics={statistics}
        customers={customers}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        onAddCustomer={() =>
          openDialog("add")
        }
        onViewCustomer={
          handleViewCustomer
        }
        onEditCustomer={
          handleEditCustomer
        }
        onDeleteCustomer={
          handleDeleteCustomer
        }
      />

      <CustomersDialogs
        addOpen={dialogs.add}
        editOpen={dialogs.edit}
        deleteOpen={dialogs.delete}
        detailsOpen={dialogs.details}
        selectedCustomer={
          selectedCustomer
        }
        loading={saving}
        onAddClose={() =>
          closeDialog("add")
        }
        onEditClose={() =>
          closeDialog("edit")
        }
        onDeleteClose={() =>
          closeDialog("delete")
        }
        onDetailsClose={() =>
          closeDialog("details")
        }
        onCreateCustomer={
          handleCreateCustomer
        }
        onUpdateCustomer={
          handleUpdateCustomer
        }
        onDeleteCustomer={
          handleDeleteConfirmed
        }
      />

      <SnackbarAlert
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </Container>
  );
}