export function printReport({
  title = "SmartBizz Report",
} = {}) {
  const originalTitle = document.title;

  document.title = title;

  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
}