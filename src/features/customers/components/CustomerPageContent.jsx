import { Stack } from "@mui/material";

import PageHeader from "../../../components/common/PageHeader";

import CustomerStats from "./CustomerStats";
import CustomerToolbar from "./CustomerToolbar";
import CustomersTable from "./CustomersTable";

export default function CustomerPageContent({
  statistics,
  customers,

  search,
  setSearch,

  filters,
  setFilters,

  onAddCustomer,

  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Customers"
        subtitle="Manage customer information, purchase history and outstanding balances."
      />

      <CustomerStats
        statistics={statistics}
      />

      <CustomerToolbar
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        onAddCustomer={onAddCustomer}
      />

      <CustomersTable
        customers={customers}
        onView={onViewCustomer}
        onEdit={onEditCustomer}
        onDelete={onDeleteCustomer}
      />
    </Stack>
  );
}