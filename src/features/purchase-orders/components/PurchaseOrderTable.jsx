import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import DataTable from "../../../components/common/DataTable";
import purchaseOrderColumns from "../config/purchaseOrderColumns";

export default function PurchaseOrderTable({ rows, onEdit, onAdvance, onReceive, onCancel, onDelete }) {
  return (
    <DataTable
      columns={purchaseOrderColumns(onEdit, onAdvance, onReceive, onCancel, onDelete)}
      rows={rows}
      emptyIcon={ReceiptLongOutlinedIcon}
      emptyTitle="No purchase orders found"
      emptyMessage="Try changing your search or filters."
    />
  );
}