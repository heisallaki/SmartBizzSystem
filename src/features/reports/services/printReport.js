export function printReport({
  title = "SmartBizz Report",
} = {}) {
  const originalTitle = document.title;

  document.title = title;

  window.print();

  // Restore the original title after printing.
  // Using a timeout ensures the browser has
  // already opened the print dialog.
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
}