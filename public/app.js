import { state } from "./js/state.js";
import { initCatalog } from "./js/catalog.js";
import { initCartUI } from "./js/cart-ui.js";
import { initCheckout } from "./js/checkout.js";
import { initAccount } from "./js/account.js";
import { initOrders } from "./js/orders.js";
import { initCustomModel } from "./js/custom-model.js";

initCartUI();
const catalog = initCatalog();
const orders = initOrders();
const account = initAccount();
initCheckout({
  onOrderCreated: () => {
    orders.loadPublicOrders();
    if (state.currentAccount) account.loadAccountOrders();
  },
  onSessionExpired: () => account.clearSession(),
});
initCustomModel();

account.loadAccountSession();
catalog.loadCatalog();
orders.loadPublicOrders();

setInterval(() => {
  if (document.visibilityState === "visible") orders.loadPublicOrders();
}, 45_000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") orders.loadPublicOrders();
});
