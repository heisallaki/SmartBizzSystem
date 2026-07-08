import DataTable from "../../../components/common/DataTable";
import productColumns from "../config/productColumns";

export default function ProductTable({
  rows,
  onEdit,
  onDelete,
}) {
  return (
    <DataTable
      columns={productColumns(
        onEdit,
        onDelete
      )}
      rows={rows}
    />
  );
}