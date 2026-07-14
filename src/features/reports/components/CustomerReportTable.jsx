// src/features/reports/components/CustomerReportTable.jsx

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

function CustomerReportTable({
  rows,
  loading = false,
}) {
  const columns = REPORT_TABLE_COLUMNS.customers.map((column) => {
    switch (column.field) {
      case "customer":
        return {
          ...column,
          flex: 1.6,
          minWidth: 220,
        };

      case "totalSpend":
      case "averageOrder":
        return {
          ...column,
          flex: 1,
          minWidth: 160,
          valueFormatter: (value) =>
            currencyFormatter.format(value ?? 0),
        };

      case "lastPurchase":
        return {
          ...column,
          flex: 1,
          minWidth: 150,
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
      title="Customer Report"
      subtitle="Customer purchasing activity and spending summary."
      rows={rows}
      columns={columns}
      loading={loading}
    />
  );
}

CustomerReportTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  loading: PropTypes.bool,
};

export default CustomerReportTable;