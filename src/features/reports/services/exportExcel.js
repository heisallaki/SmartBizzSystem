import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function formatValue(value) {
  if (typeof value === "number") {
    return currencyFormatter.format(value);
  }

  return value ?? "";
}

export function exportReportToExcel({
  sheetName = "Report",
  filename = "report.xlsx",
  columns = [],
  rows = [],
  summary = [],
}) {
  const worksheetData = [];

  if (summary.length > 0) {
    summary.forEach(({ label, value }) => {
      worksheetData.push({
        Metric: label,
        Value: formatValue(value),
      });
    });

    worksheetData.push({});
  }

  worksheetData.push(
    Object.fromEntries(
      columns.map((column) => [
        column.headerName,
        column.headerName,
      ])
    )
  );

  rows.forEach((row) => {
    const formattedRow = {};

    columns.forEach((column) => {
      formattedRow[column.headerName] = formatValue(
        row[column.field]
      );
    });

    worksheetData.push(formattedRow);
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
    skipHeader: true,
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, filename);
}