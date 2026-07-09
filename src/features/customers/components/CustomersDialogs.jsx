import AddCustomerDialog from "./AddCustomerDialog";
import EditCustomerDialog from "./EditCustomerDialog";
import DeleteCustomerDialog from "./DeleteCustomerDialog";
import CustomerDetailsDrawer from "./CustomerDetailsDrawer";

export default function CustomersDialogs({
  addOpen,
  editOpen,
  deleteOpen,
  detailsOpen,

  selectedCustomer,

  loading,

  onAddClose,
  onEditClose,
  onDeleteClose,
  onDetailsClose,

  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) {
  return (
    <>
      <AddCustomerDialog
        open={addOpen}
        loading={loading}
        onClose={onAddClose}
        onSave={onCreateCustomer}
      />

      <EditCustomerDialog
        open={editOpen}
        customer={selectedCustomer}
        loading={loading}
        onClose={onEditClose}
        onSave={onUpdateCustomer}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        customer={selectedCustomer}
        loading={loading}
        onClose={onDeleteClose}
        onDelete={onDeleteCustomer}
      />

      <CustomerDetailsDrawer
        open={detailsOpen}
        customer={selectedCustomer}
        onClose={onDetailsClose}
      />
    </>
  );
}