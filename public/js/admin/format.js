export const euroFormatter = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
export const dateFormatter = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" });

export const orderStatusLabels = {
  in_attesa: "In attesa",
  in_lavorazione: "In lavorazione",
  completato: "Completato",
  consegnato: "Consegnato",
};

export function formatDate(value) {
  return dateFormatter.format(new Date(`${value.replace(" ", "T")}Z`));
}

export function formatHours(value) {
  if (!Number.isFinite(value)) return "-";
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${String(minutes).padStart(2, "0")} min` : `${minutes} min`;
}

export function formatQuoteSummary(quote) {
  if (!quote) return "Non calcolata";
  return `${quote.grams} g / ${formatHours(quote.hours)} / ${euroFormatter.format(quote.unitPriceCents / 100)}`;
}
