import PropTypes from "prop-types";

import Chip from "@mui/material/Chip";

import ReportTable from "./ReportTable";

import {
  REPORT_TABLE_COLUMNS,
} from "../constants/reports.constants";

function LowStockReport({
  rows,
  loading = false,
}) {
  const columns = REPORT_TABLE_COLUMNS.lowStock.map((column) => {
    switch (column.field) {
      case "product":
        return {
          ...column,
          flex: 1.8,
          minWidth: 220,
        };

      case "remaining":
      case "minimum":
        return {
          ...column,
          type: "number",
          flex: 1,
          minWidth: 120,
        };

      case "status":
        return {
          ...column,
          flex: 1,
          minWidth: 140,
          sortable: false,
          renderCell: ({ value }) => (
            <Chip
              size="small"
              label={value}
              color={
                value === "Critical"
                  ? "error"
                  : value === "Low Stock"
                  ? "warning"
                  : "success"
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
      title="Low Stock Report"
      subtitle="Products that require replenishment based on minimum stock levels."
      rows={rows}
      columns={columns}
      loading={loading}
    />
  );
}

LowStockReport.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  loading: PropTypes.bool,
};

export default LowStockReport;