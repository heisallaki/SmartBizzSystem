import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import DataTable from "../../../components/common/DataTable";
import supplierColumns from "../config/supplierColumns";

export default function SupplierTable({
  rows,
  onEdit,
  onDelete,
}) {
  return (
    <DataTable
      columns={supplierColumns(
        onEdit,
        onDelete
      )}
      rows={rows}
      emptyIcon={LocalShippingOutlinedIcon}
      emptyTitle="No suppliers found"
      emptyMessage="Try changing your search or filters."
    />
  );
}