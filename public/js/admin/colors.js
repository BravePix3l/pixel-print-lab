import { state, hooks } from "./state.js";

export function initColors({ api, reloadCatalog }) {
  const colorList = document.querySelector("#color-list");
  const colorTemplate = document.querySelector("#color-template");
  const newColorForm = document.querySelector("#new-color-form");
  const colorFeedback = document.querySelector("#color-feedback");

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
    colorList.replaceChildren();
    state.colors.forEach((color, index) => {
      const form = colorTemplate.content.firstElementChild.cloneNode(true);
      const nameInput = form.querySelector('[data-field="name"]');
      const hexInput = form.querySelector('[data-field="hex"]');
      const activeInput = form.querySelector('[data-field="active"]');
      const swatch = form.querySelector('[data-field="swatch"]');
      nameInput.value = color.name;
      hexInput.value = color.hexValue;
      activeInput.checked = color.active;
      swatch.style.backgroundColor = color.hexValue;
      hexInput.addEventListener("input", () => { swatch.style.backgroundColor = hexInput.value; });
      form.querySelector('[data-field="up"]').disabled = index === 0;
      form.querySelector('[data-field="down"]').disabled = index === state.colors.length - 1;
      form.querySelector('[data-field="up"]').addEventListener("click", () => moveColor(index, -1));
      form.querySelector('[data-field="down"]').addEventListener("click", () => moveColor(index, 1));
      form.querySelector('[data-field="delete"]').addEventListener("click", async () => {
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
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
          await api(`/api/admin/colors/${color.id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: nameInput.value,
              hexValue: hexInput.value,
              active: activeInput.checked,
              sortOrder: color.sortOrder,
            }),
          });
          await reloadCatalog();
          colorFeedback.textContent = "Colore salvato.";
          colorFeedback.classList.remove("admin-feedback--error");
        } catch (error) {
          colorFeedback.textContent = error.message;
          colorFeedback.classList.add("admin-feedback--error");
        }
      });
      colorList.append(form);
    });
  }

  newColorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(newColorForm);
    try {
      await api("/api/admin/colors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          hexValue: formData.get("hexValue"),
          active: true,
          sortOrder: Math.max(0, ...state.colors.map((color) => color.sortOrder)) + 10,
        }),
      });
      newColorForm.reset();
      await reloadCatalog();
      colorFeedback.textContent = "Colore aggiunto.";
      colorFeedback.classList.remove("admin-feedback--error");
    } catch (error) {
      colorFeedback.textContent = error.message;
      colorFeedback.classList.add("admin-feedback--error");
    }
  });

  hooks.renderColors = renderColors;
}
