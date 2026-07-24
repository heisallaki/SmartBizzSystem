export default function formatDate(value, options = { dateStyle: "medium" }) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-KE", options).format(new Date(value));
}