import { api } from "./api.js";
import { publicStatusLabels } from "./format.js";

export function initOrders() {
  const trackingStatus = document.querySelector("#tracking-status");
  const requestList = document.querySelector("#request-list");
  const requestTemplate = document.querySelector("#request-template");
  const trackingAnnouncement = document.querySelector("#tracking-announcement");
  const printSceneScreen = document.querySelector("#print-scene-screen");
  const printSceneProgressText = document.querySelector("#print-scene-progress-text");
  const printSceneProgressBar = document.querySelector("#print-scene-progress-bar");
  const heroProgressBar = document.querySelector("#hero-progress-bar");
  const heroProgressText = document.querySelector("#hero-progress-text");
  const heroKicker = document.querySelector("#hero-kicker");

  let publicOrdersSignature = "";
  let trackingLoadVersion = 0;

  function updatePrintScene(orders) {
    const completed = orders.filter((order) => order.status === "completato").length;
    const total = orders.length;
    printSceneProgressText.textContent = orders.length ? `Livello ${completed} / ${total}` : "Livello 0 / 0";
    printSceneProgressBar.style.width = orders.length ? `${(completed / total) * 100}%` : "0%";
    const printingOrder = orders.find((order) => order.status === "in_lavorazione");
    printSceneScreen.textContent = printingOrder ? printingOrder.code : "STANDBY";
  }

  function updateHeroProgress(orders) {
    const completed = orders.filter((order) => order.status === "completato").length;
    const total = orders.length;
    heroProgressText.textContent = orders.length ? `Ordini completati ${completed} / ${total}` : "Ordini completati 0 / 0";
    heroProgressBar.style.width = orders.length ? `${(completed / total) * 100}%` : "0%";
  }

  function updateHeroKicker(orders) {
    const busy = orders.some((order) => order.status === "in_lavorazione");
    if (busy) {
      heroKicker.lastChild.textContent = " Stampante occupata";
      heroKicker.classList.add("kicker--busy");
    } else {
      heroKicker.lastChild.textContent = " Stampante pronta";
      heroKicker.classList.remove("kicker--busy");
    }
  }

  async function loadPublicOrders() {
    const loadVersion = ++trackingLoadVersion;
    try {
      const orders = await api("/api/orders", { cache: "no-store" });
      if (loadVersion !== trackingLoadVersion) return;
      const signature = JSON.stringify(orders);
      trackingStatus.classList.remove("request-tracker__status--error");
      trackingStatus.textContent = orders.length ? "" : "Nessuna richiesta presente.";
      trackingStatus.hidden = orders.length > 0;
      if (signature === publicOrdersSignature) return;
      const hadPreviousData = publicOrdersSignature !== "";
      publicOrdersSignature = signature;
      requestList.replaceChildren();
      orders.forEach((order, index) => {
        const item = requestTemplate.content.firstElementChild.cloneNode(true);
        item.querySelector('[data-field="request-code"]').textContent = order.code;
        const statusEl = item.querySelector('[data-field="request-status"]');
        statusEl.textContent = publicStatusLabels[order.status] ?? order.status;
        statusEl.dataset.status = order.status;
        item.querySelector('[data-field="request-order"]').textContent = String(index + 1).padStart(2, "0");
        item.querySelector('[data-field="request-animation"]').hidden = order.status !== "in_lavorazione";
        requestList.append(item);
      });
      updatePrintScene(orders);
      updateHeroProgress(orders);
      updateHeroKicker(orders);
      trackingAnnouncement.textContent = hadPreviousData ? "Lo stato degli ordini e stato aggiornato." : "Elenco ordini caricato.";
    } catch (error) {
      if (loadVersion !== trackingLoadVersion) return;
      console.error(error);
      trackingStatus.hidden = false;
      trackingStatus.textContent = "Stato ordini non disponibile.";
      trackingStatus.classList.add("request-tracker__status--error");
    }
  }

  return { loadPublicOrders };
}
