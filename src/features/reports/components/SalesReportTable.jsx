import PropTypes from "prop-types";

import ReportTable from "./ReportTable";

import {
  REPORT_TABLE_COLUMNS,
} from "../constants/reports.constants";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function SalesReportTable({
  rows,
  loading = false,
}) {
  const columns = REPORT_TABLE_COLUMNS.sales.map((column) => {
    switch (column.field) {
      case "revenue":
      case "profit":
        return {
          ...column,
          flex: 1,
          minWidth: 140,
          valueFormatter: (value) =>
            currencyFormatter.format(value ?? 0),
        };

      case "customer":
        return {
          ...column,
          flex: 1.5,
          minWidth: 180,
        };

      case "invoice":
        return {
          ...column,
          minWidth: 140,
        };

      case "date":
        return {
          ...column,
          minWidth: 130,
        };

      default:
        return {
          ...column,
          flex: 1,
          minWidth: 110,
        };
    }
  });

  return (
    <ReportTable
      title="Sales Report"
      subtitle="Detailed sales transactions within the selected period."
      rows={rows}
      columns={columns}
      loading={loading}
    />
  );
}

SalesReportTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  loading: PropTypes.bool,
};

export default SalesReportTable;