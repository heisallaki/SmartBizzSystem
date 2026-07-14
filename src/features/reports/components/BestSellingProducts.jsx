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

function BestSellingProducts({
  rows,
  loading = false,
}) {
  const columns = REPORT_TABLE_COLUMNS.bestSelling.map((column) => {
    switch (column.field) {
      case "product":
        return {
          ...column,
          flex: 1.8,
          minWidth: 220,
        };

      case "revenue":
      case "profit":
        return {
          ...column,
          flex: 1,
          minWidth: 150,
          valueFormatter: (value) =>
            currencyFormatter.format(value ?? 0),
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
      title="Best Selling Products"
      subtitle="Products ranked by units sold and generated revenue."
      rows={rows}
      columns={columns}
      loading={loading}
    />
  );
}

BestSellingProducts.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  loading: PropTypes.bool,
};

export default BestSellingProducts;