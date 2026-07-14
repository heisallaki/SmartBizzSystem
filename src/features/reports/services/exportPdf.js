import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export function exportReportToPdf({
  title = "SmartBizz Report",
  filename = "report.pdf",
  columns = [],
  rows = [],
  summary = [],
}) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SmartBizz", 14, 18);

  doc.setFontSize(14);
  doc.text(title, 14, 30);

  let startY = 40;

  if (summary.length > 0) {
    doc.setFontSize(11);

    summary.forEach(({ label, value }) => {
      doc.text(
        `${label}: ${formatValue(value)}`,
        14,
        startY
      );

      startY += 7;
    });

    startY += 5;
  }

  autoTable(doc, {
    startY,

    head: [
      columns.map((column) => column.headerName),
    ],

    body: rows.map((row) =>
      columns.map((column) =>
        formatValue(row[column.field])
      )
    ),

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [15, 118, 110], // SmartBizz teal
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
  });

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);

    doc.setFontSize(9);

    doc.text(
      `Page ${i} of ${pageCount}`,
      170,
      290
    );
  }

  doc.save(filename);
}