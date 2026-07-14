import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";

import ReportTable from "./ReportTable";

import {
  REPORT_TABLE_COLUMNS,
} from "../constants/reports.constants";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function InventoryReportTable({
  rows,
  loading = false,
}) {
  const columns = REPORT_TABLE_COLUMNS.inventory.map((column) => {
    switch (column.field) {
      case "product":
        return {
          ...column,
          flex: 1.5,
          minWidth: 220,
        };

      case "category":
        return {
          ...column,
          flex: 1,
          minWidth: 150,
        };

      case "stockValue":
        return {
          ...column,
          flex: 1,
          minWidth: 150,
          valueFormatter: (value) =>
            currencyFormatter.format(value ?? 0),
        };

      case "status":
        return {
          ...column,
          flex: 1,
          minWidth: 140,
          sortable: false,
          renderCell: ({ value }) => (
            <Chip
              label={value}
              size="small"
              color={
                value === "In Stock"
                  ? "success"
                  : value === "Low Stock"
                  ? "warning"
                  : "error"
              }
              variant="outlined"
            />
          ),
        };

      default:
        return {
          ...column,
          flex: 1,
          minWidth: 120,
        };
    }
  });

  return (
    <ReportTable
      title="Inventory Report"
      subtitle="Current inventory levels and stock valuation."
      rows={rows}
      columns={columns}
      loading={loading}
    />
  );
}

InventoryReportTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  loading: PropTypes.bool,
};

export default InventoryReportTable;