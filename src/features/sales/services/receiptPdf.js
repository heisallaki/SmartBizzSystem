import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const currency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

export function exportSaleReceiptToPdf(sale) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SmartBizz", 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Sales Receipt", 14, 25);
  doc.setTextColor(0);

  doc.setFontSize(10);
  doc.text(`Invoice: ${sale.invoice}`, 14, 36);
  doc.text(`Date: ${sale.date}`, 14, 42);
  doc.text(`Customer: ${sale.customerName}`, 14, 48);
  doc.text(`Cashier: ${sale.cashier}`, 14, 54);
  doc.text(`Payment: ${sale.paymentMethod}`, 14, 60);
  doc.text(`Status: ${sale.status}`, 14, 66);

  autoTable(doc, {
    startY: 74,

    head: [["Product", "Qty", "Price", "Discount", "Total"]],

    body: sale.items.map((item) => [
      item.name,
      item.quantity,
      currency(item.price),
      currency(item.discount),
      currency(item.lineTotal),
    ]),

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [15, 118, 110],
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text(`Subtotal: ${currency(sale.subtotal)}`, 140, finalY);
  doc.text(`Discount: ${currency(sale.discount)}`, 140, finalY + 6);
  doc.text(`Tax: ${currency(sale.tax)}`, 140, finalY + 12);

  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text(`Total: ${currency(sale.total)}`, 140, finalY + 22);
  doc.setFont(undefined, "normal");

  if (sale.notes) {
    doc.setFontSize(9);
    doc.text(`Notes: ${sale.notes}`, 14, finalY + 34);
  }

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Thank you for your business.", 14, 285);

  doc.save(`${sale.invoice}.pdf`);
}