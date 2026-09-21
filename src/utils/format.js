export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function isExpiringSoon(dateStr, days = 3) {
  if (!dateStr) return false;
  const deadline = new Date(dateStr);
  if (Number.isNaN(deadline.getTime())) return false;
  const now = Date.now();
  if (deadline.getTime() < now) return false;
  return deadline.getTime() - now < days * 24 * 60 * 60 * 1000;
}