export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

export function formatName(parts = []) {
  return parts.filter(Boolean).join(" ");
}
