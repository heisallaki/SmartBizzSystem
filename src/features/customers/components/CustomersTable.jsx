import DataTable from "../../../components/common/DataTable";
import { customerColumns } from "../constants/customerColumns";

export default function CustomersTable({
  customers,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = customerColumns({
    onView,
    onEdit,
    onDelete,
  });

  return (
    <DataTable
      columns={columns}
      rows={customers}
    />
  );
}