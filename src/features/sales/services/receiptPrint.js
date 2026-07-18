const currency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(Number(value || 0));

export function printSaleReceipt(sale) {
  const printWindow = window.open("", "_blank", "width=420,height=600");

  if (!printWindow) return;

  const itemsRows = sale.items
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${currency(item.price)}</td>
          <td style="text-align:right;">${currency(item.lineTotal)}</td>
        </tr>
      `
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${sale.invoice}</title>
        <style>
          body {
            font-family: "Segoe UI", Arial, sans-serif;
            padding: 24px;
            color: #111827;
          }
          h1 {
            font-size: 18px;
            margin-bottom: 0;
            color: #0f766e;
          }
          .subtitle {
            color: #6b7280;
            margin-top: 2px;
            margin-bottom: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          th, td {
            padding: 6px 4px;
            font-size: 13px;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            text-align: left;
            color: #374151;
          }
          .totals td {
            border: none;
            padding: 3px 4px;
          }
          .grand-total {
            font-weight: 700;
            font-size: 15px;
          }
          .meta {
            font-size: 13px;
            margin-bottom: 4px;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>SmartBizz</h1>
        <div class="subtitle">Sales Receipt</div>

        <div class="meta"><strong>Invoice:</strong> ${sale.invoice}</div>
        <div class="meta"><strong>Date:</strong> ${sale.date}</div>
        <div class="meta"><strong>Customer:</strong> ${sale.customerName}</div>
        <div class="meta"><strong>Cashier:</strong> ${sale.cashier}</div>
        <div class="meta"><strong>Payment:</strong> ${sale.paymentMethod}</div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Subtotal</td>
            <td style="text-align:right;">${currency(sale.subtotal)}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td style="text-align:right;">${currency(sale.discount)}</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td style="text-align:right;">${currency(sale.tax)}</td>
          </tr>
          <tr class="grand-total">
            <td>Total</td>
            <td style="text-align:right;">${currency(sale.total)}</td>
          </tr>
        </table>

        <div class="footer">Thank you for your business.</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}