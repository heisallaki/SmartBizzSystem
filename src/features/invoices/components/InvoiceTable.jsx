import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import DataTable from "../../../components/common/DataTable";
import invoiceColumns from "../config/invoiceColumns";

export default function InvoiceTable({ rows, onRecordPayment, onVoid, onDelete }) {
  return (
    <DataTable
      columns={invoiceColumns(onRecordPayment, onVoid, onDelete)}
      rows={rows}
      emptyIcon={DescriptionOutlinedIcon}
      emptyTitle="No invoices found"
      emptyMessage="Try changing your search or filters."
    />
  );
}