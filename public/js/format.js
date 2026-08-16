export const euroFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const publicStatusLabels = {
  in_attesa: "In attesa",
  in_lavorazione: "In lavorazione",
  completato: "Completato",
  consegnato: "Consegnato",
};

export function priceStatusLabel(status) {
  if (status === "confirmed") return "Confermato";
  if (status === "estimated") return "Stimato";
  if (status === "partial") return "Parziale";
  return "Da definire";
}
