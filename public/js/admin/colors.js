import { state, hooks } from "./state.js";

export function initColors({ api, reloadCatalog }) {
  const colorList = document.querySelector("#color-list");
  const colorTemplate = document.querySelector("#color-template");
  const newColorForm = document.querySelector("#new-color-form");
  const colorFeedback = document.querySelector("#color-feedback");
  const colorCount = document.querySelector("#color-count");
  const colorTitle = document.querySelector("#color-title");
  const deleteColorButton = document.querySelector("#delete-color");
  const hexInput = newColorForm.querySelector('[name="hexValue"]');
  const nameInput = newColorForm.querySelector('[name="name"]');
  const activeInput = newColorForm.querySelector('[name="active"]');

  let selectedColorId = null;

  function nextSortOrder() {
    return Math.max(0, ...state.colors.map((color) => color.sortOrder)) + 10;
  }

  function clearSelection() {
    selectedColorId = null;
    newColorForm.reset();
    hexInput.value = "#FF6534";
    activeInput.checked = true;
    newColorForm.querySelector('[type="submit"]').textContent = "Aggiungi";
    colorTitle.textContent = "Nuovo colore";
    deleteColorButton.hidden = true;
    colorList.querySelectorAll(".color-list-item--active").forEach((item) => item.classList.remove("color-list-item--active"));
  }

  function selectColor(id) {
    const color = state.colors.find((current) => current.id === id);
    if (!color) return;
    selectedColorId = id;
    nameInput.value = color.name;
    hexInput.value = color.hexValue;
    activeInput.checked = color.active;
    newColorForm.querySelector('[type="submit"]').textContent = "Salva modifiche";
    colorTitle.textContent = "Modifica colore";
    deleteColorButton.hidden = false;
    colorList.querySelectorAll(".color-list-item--active").forEach((item) => item.classList.remove("color-list-item--active"));
    const activeItem = colorList.querySelector(`[data-color-id="${id}"]`);
    if (activeItem) activeItem.classList.add("color-list-item--active");
  }

  async function moveColor(index, direction) {
    const reordered = [...state.colors];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    try {
      state.colors = await api("/api/admin/colors/order", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((color) => color.id) }),
      });
      renderColors();
    } catch (error) {
      colorFeedback.textContent = error.message;
      colorFeedback.classList.add("admin-feedback--error");
    }
  }

  function renderColors() {
    colorCount.textContent = String(state.colors.length).padStart(2, "0");
    colorList.replaceChildren();
    state.colors.forEach((color, index) => {
      const item = colorTemplate.content.firstElementChild.cloneNode(true);
      item.dataset.colorId = color.id;
      item.querySelector('[data-field="swatch"]').style.backgroundColor = color.hexValue;
      item.querySelector('[data-field="name"]').textContent = color.name;
      item.querySelector('[data-field="status"]').textContent = color.active ? "Attivo" : "Inattivo";
      item.querySelector('[data-field="up"]').disabled = index === 0;
      item.querySelector('[data-field="down"]').disabled = index === state.colors.length - 1;
      item.querySelector('[data-field="select"]').addEventListener("click", () => selectColor(color.id));
      item.querySelector('[data-field="up"]').addEventListener("click", () => moveColor(index, -1));
      item.querySelector('[data-field="down"]').addEventListener("click", () => moveColor(index, 1));
      item.querySelector('[data-field="delete"]').addEventListener("click", async () => {
        if (!confirm(`Rimuovere il colore "${color.name}"?`)) return;
        try {
          await api(`/api/admin/colors/${color.id}`, { method: "DELETE" });
          await reloadCatalog();
          colorFeedback.textContent = "Colore rimosso.";
          colorFeedback.classList.remove("admin-feedback--error");
        } catch (error) {
          colorFeedback.textContent = error.message;
          colorFeedback.classList.add("admin-feedback--error");
        }
      });
      colorList.append(item);
    });
  }

  newColorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      name: nameInput.value,
      hexValue: hexInput.value,
      active: activeInput.checked,
    };
    try {
      if (selectedColorId) {
        const existing = state.colors.find((color) => color.id === selectedColorId);
        await api(`/api/admin/colors/${selectedColorId}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...payload, sortOrder: existing?.sortOrder ?? nextSortOrder() }),
        });
        colorFeedback.textContent = "Colore aggiornato.";
      } else {
        await api("/api/admin/colors", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...payload, sortOrder: nextSortOrder() }),
        });
        colorFeedback.textContent = "Colore aggiunto.";
      }
      newColorForm.reset();
      await reloadCatalog();
      clearSelection();
      colorFeedback.classList.remove("admin-feedback--error");
    } catch (error) {
      colorFeedback.textContent = error.message;
      colorFeedback.classList.add("admin-feedback--error");
    }
  });

  deleteColorButton.addEventListener("click", async () => {
    if (!selectedColorId) return;
    const color = state.colors.find((current) => current.id === selectedColorId);
    if (!confirm(`Rimuovere il colore "${color?.name ?? ""}"?`)) return;
    try {
      await api(`/api/admin/colors/${selectedColorId}`, { method: "DELETE" });
      await reloadCatalog();
      clearSelection();
      colorFeedback.textContent = "Colore rimosso.";
      colorFeedback.classList.remove("admin-feedback--error");
    } catch (error) {
      colorFeedback.textContent = error.message;
      colorFeedback.classList.add("admin-feedback--error");
    }
  });

  hooks.renderColors = renderColors;
}
