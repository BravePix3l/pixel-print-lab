import { state } from "./state.js";
import { api } from "./api.js";
import {
  dateFormatter,
  euroFormatter,
  priceStatusLabel,
  publicStatusLabels,
} from "./format.js";

export function initAccount() {
  const accountOpenButton = document.querySelector("#account-open");
  const accountDialog = document.querySelector("#account-dialog");
  const accountDialogBackdrop = document.querySelector("#account-dialog-backdrop");
  const accountGuestView = document.querySelector("#account-guest-view");
  const accountUserView = document.querySelector("#account-user-view");
  const accountLoginForm = document.querySelector("#account-login-form");
  const accountRegisterForm = document.querySelector("#account-register-form");
  const accountGuestFeedback = document.querySelector("#account-guest-feedback");
  const accountDisplayName = document.querySelector("#account-display-name");
  const accountUsername = document.querySelector("#account-username");
  const accountAdminLink = document.querySelector("#account-admin-link");
  const accountLogoutButton = document.querySelector("#account-logout");
  const accountOrdersRefresh = document.querySelector("#account-orders-refresh");
  const accountOrdersStatus = document.querySelector("#account-orders-status");
  const accountOrderList = document.querySelector("#account-order-list");
  const accountOrderTemplate = document.querySelector("#account-order-template");
  const checkoutCustomerNote = document.querySelector("#checkout-customer-note");

  let accountStateVersion = 0;
  let accountAuthPending = false;

  function renderAccount() {
    const authenticated = Boolean(state.currentAccount);
    accountGuestView.hidden = authenticated;
    accountUserView.hidden = !authenticated;
    accountOpenButton.textContent = authenticated ? `@${state.currentAccount.username}` : "Accedi";
    checkoutCustomerNote.textContent = authenticated
      ? `La richiesta verra salvata nello storico di @${state.currentAccount.username}.`
      : "Puoi inviare la richiesta come ospite. Accordi e consegna avverranno privatamente.";
    if (!authenticated) {
      accountOrderList.replaceChildren();
      return;
    }
    accountDisplayName.textContent = `${state.currentAccount.firstName} ${state.currentAccount.lastName}`;
    accountUsername.textContent = `@${state.currentAccount.username}`;
    accountAdminLink.hidden = state.currentAccount.role !== "admin";
  }

  function renderAccountOrders(orders) {
    const elements = orders.map((order) => {
      const element = accountOrderTemplate.content.firstElementChild.cloneNode(true);
      const date = new Date(`${order.createdAt.replace(" ", "T")}Z`);
      element.querySelector('[data-field="account-order-date"]').textContent = Number.isNaN(date.valueOf())
        ? order.createdAt
        : dateFormatter.format(date);
      element.querySelector('[data-field="account-order-code"]').textContent = order.code;
      element.querySelector('[data-field="account-order-status"]').textContent = publicStatusLabels[order.status] ?? order.status;
      element.querySelector('[data-field="account-order-total-label"]').textContent = priceStatusLabel(order.priceStatus);
      element.querySelector('[data-field="account-order-total"]').textContent = euroFormatter.format((order.totalPriceCents ?? order.catalogTotalCents) / 100);
      const deleteButton = element.querySelector('[data-field="account-order-delete"]');
      deleteButton.addEventListener("click", () => deleteAccountOrder(order.code));
      const itemList = element.querySelector('[data-field="account-order-items"]');
      order.items.forEach((item) => {
        const listItem = document.createElement("li");
        const name = document.createElement("span");
        const detail = document.createElement("span");
        const unitPrice = item.unitPriceCents === null
          ? "prezzo da definire"
          : `${priceStatusLabel(item.priceStatus).toLowerCase()} ${euroFormatter.format(item.unitPriceCents / 100)} / cad.`;
        const lineTotal = item.lineTotalCents === null
          ? ""
          : ` - totale ${euroFormatter.format(item.lineTotalCents / 100)}`;
        name.textContent = item.productName;
        detail.textContent = `${item.colorName} / ${item.quantity} pz. / ${unitPrice}${lineTotal}`;
        listItem.append(name, detail);
        itemList.append(listItem);
      });
      return element;
    });
    accountOrderList.replaceChildren(...elements);
    accountOrdersStatus.textContent = orders.length ? "" : "Non hai ancora inviato ordini con questo account.";
  }

  async function deleteAccountOrder(code) {
    if (!confirm(`Eliminare definitivamente l'ordine ${code}?`)) return;
    try {
      await api(`/api/account/orders/${encodeURIComponent(code)}`, { method: "DELETE" });
      accountOrdersStatus.textContent = "Ordine eliminato.";
      accountOrdersStatus.classList.remove("account-feedback--error");
      await loadAccountOrders();
    } catch (error) {
      accountOrdersStatus.textContent = error.message;
      accountOrdersStatus.classList.add("account-feedback--error");
    }
  }

  async function loadAccountOrders() {
    if (!state.currentAccount) return;
    const version = accountStateVersion;
    const accountId = state.currentAccount.id;
    accountOrdersRefresh.disabled = true;
    accountOrdersStatus.textContent = "Caricamento storico...";
    try {
      const orders = await api("/api/account/orders", { cache: "no-store" });
      if (version !== accountStateVersion || state.currentAccount?.id !== accountId) return;
      renderAccountOrders(orders);
    } catch (error) {
      if (version !== accountStateVersion || state.currentAccount?.id !== accountId) return;
      if (error.status === 401) {
        clearSession();
      }
      accountOrdersStatus.textContent = error.message;
    } finally {
      if (version === accountStateVersion) accountOrdersRefresh.disabled = false;
    }
  }

  async function loadAccountSession() {
    const version = accountStateVersion;
    let account;
    try {
      account = await api("/api/account/session", { cache: "no-store" });
    } catch (error) {
      if (version !== accountStateVersion) return;
      if (error.status !== 401) console.error(error);
      account = undefined;
    }
    if (version !== accountStateVersion) return;
    state.currentAccount = account;
    renderAccount();
  }

  async function submitAccountForm(form, endpoint) {
    if (accountAuthPending) return;
    accountAuthPending = true;
    const buttons = [
      accountLoginForm.querySelector('[type="submit"]'),
      accountRegisterForm.querySelector('[type="submit"]'),
    ];
    const formData = new FormData(form);
    buttons.forEach((button) => { button.disabled = true; });
    accountGuestFeedback.textContent = "";
    accountGuestFeedback.classList.remove("account-feedback--error");
    const version = ++accountStateVersion;
    try {
      const account = await api(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (version !== accountStateVersion) return;
      state.currentAccount = account;
      form.reset();
      renderAccount();
      accountDisplayName.focus();
      await loadAccountOrders();
    } catch (error) {
      if (version !== accountStateVersion) return;
      accountGuestFeedback.textContent = error.message;
      accountGuestFeedback.classList.add("account-feedback--error");
    } finally {
      accountAuthPending = false;
      buttons.forEach((button) => { button.disabled = false; });
    }
  }

  function clearSession() {
    state.currentAccount = undefined;
    accountStateVersion += 1;
    renderAccount();
  }

  accountOpenButton.addEventListener("click", () => {
    accountGuestFeedback.textContent = "";
    accountDialogBackdrop.hidden = false;
    accountDialog.show();
    if (!accountGuestView.hidden) document.querySelector("#login-username").focus();
    if (state.currentAccount) loadAccountOrders();
  });
  accountDialog.addEventListener("close", () => {
    accountDialogBackdrop.hidden = true;
  });
  accountDialogBackdrop.addEventListener("click", () => accountDialog.close());
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !accountDialog.open) return;
    if (document.querySelector("dialog:modal")) return;
    accountDialog.close();
  });
  accountLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAccountForm(accountLoginForm, "/api/account/login");
  });
  accountRegisterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAccountForm(accountRegisterForm, "/api/account/register");
  });
  accountLogoutButton.addEventListener("click", async () => {
    accountLogoutButton.disabled = true;
    const version = ++accountStateVersion;
    try {
      const response = await fetch("/api/account/logout", { method: "POST" });
      if (!response.ok) throw new Error("Disconnessione non riuscita.");
      if (version !== accountStateVersion) return;
      state.currentAccount = undefined;
      renderAccount();
      document.querySelector("#login-username").focus();
    } catch (error) {
      if (version === accountStateVersion) accountOrdersStatus.textContent = error.message;
    } finally {
      if (version === accountStateVersion) accountLogoutButton.disabled = false;
    }
  });

  accountOrdersRefresh.addEventListener("click", loadAccountOrders);

  return { loadAccountSession, loadAccountOrders, clearSession };
}
