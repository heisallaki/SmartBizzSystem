import DataTable from "../../../components/common/DataTable";

import productColumns from "../config/productColumns";

export default function ProductTable({ rows }) {
  return (
    <DataTable
      columns={productColumns}
      rows={rows}
    />
  );
}