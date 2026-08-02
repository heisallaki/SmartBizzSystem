import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import DataTable from "../../../components/common/DataTable";
import expenseColumns from "../config/expenseColumns";

export default function ExpenseTable({ rows, onEdit, onDelete }) {
  return (
    <DataTable
      columns={expenseColumns(onEdit, onDelete)}
      rows={rows}
      emptyIcon={ReceiptLongOutlinedIcon}
      emptyTitle="No expenses found"
      emptyMessage="Try changing your search or filters."
    />
  );
}