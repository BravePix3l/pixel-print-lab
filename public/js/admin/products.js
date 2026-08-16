import { state, hooks } from "./state.js";
import { euroFormatter } from "./format.js";
import { getViewerModule } from "../viewer-loader.js";

export function initProducts({ api }) {
  const productCount = document.querySelector("#product-count");
  const productList = document.querySelector("#product-list");
  const productListTemplate = document.querySelector("#product-list-template");
  const newProductButton = document.querySelector("#new-product");
  const productForm = document.querySelector("#product-form");
  const productFormTitle = document.querySelector("#product-form-title");
  const productFeedback = document.querySelector("#product-feedback");
  const deleteProductButton = document.querySelector("#delete-product");
  const assetSummary = document.querySelector("#asset-summary");
  const imageLabelSpan = productForm.elements.image.closest("label").querySelector("span");
  const modelLabelSpan = productForm.elements.model.closest("label").querySelector("span");

  function renderProductList() {
    productList.replaceChildren();
    productCount.textContent = String(state.products.length).padStart(2, "0");
    state.products.forEach((product) => {
      const button = productListTemplate.content.firstElementChild.cloneNode(true);
      button.querySelector('[data-field="product-code"]').textContent = product.code;
      button.querySelector('[data-field="product-name"]').textContent = product.name;
      button.querySelector('[data-field="product-status"]').textContent = product.visible ? "Visibile" : "Nascosto";
      button.querySelector('[data-field="product-price"]').textContent = euroFormatter.format(product.priceCents / 100);
      button.classList.toggle("order-list-item--active", product.id === state.selectedProductId);
      button.addEventListener("click", () => selectProduct(product.id));
      productList.append(button);
    });
  }

  function renderAssetSummary(product) {
    assetSummary.replaceChildren();
    if (!product) {
      assetSummary.textContent = "L'immagine e obbligatoria. Il modello 3MF e facoltativo.";
      return;
    }
    const imageLink = document.createElement("a");
    imageLink.href = product.imageUrl;
    imageLink.target = "_blank";
    imageLink.rel = "noopener";
    imageLink.textContent = "Apri immagine attuale";
    assetSummary.append(imageLink);
    if (product.modelUrl) {
      const modelLink = document.createElement("a");
      modelLink.href = product.modelUrl;
      modelLink.target = "_blank";
      modelLink.rel = "noopener";
      modelLink.textContent = "Apri 3MF attuale";
      assetSummary.append(modelLink);

      const viewButton = document.createElement("button");
      viewButton.type = "button";
      viewButton.className = "asset-summary__viewer";
      viewButton.textContent = "Visualizza modello 3D";
      viewButton.addEventListener("click", () => viewModel(product, viewButton));
      assetSummary.append(viewButton);
    }
  }

  async function viewModel(product, button) {
    button.disabled = true;
    try {
      const { openModelViewer } = await getViewerModule();
      const colorHex = state.colors[0]?.hexValue ?? "#ffffff";
      await openModelViewer(product, colorHex, state.colors);
    } catch (error) {
      console.error(error);
    } finally {
      button.disabled = false;
    }
  }

  function newProduct() {
    state.selectedProductId = undefined;
    productForm.reset();
    productForm.elements.visible.checked = true;
    productForm.elements.sortOrder.value = (Math.max(0, ...state.products.map((product) => product.sortOrder)) + 10);
    productForm.elements.image.required = true;
    productForm.elements.model.required = true;
    imageLabelSpan.textContent = "Immagine PNG, JPG o WebP";
    modelLabelSpan.textContent = "Modello 3MF";
    productFormTitle.textContent = "Nuovo prodotto";
    deleteProductButton.hidden = true;
    productFeedback.textContent = "";
    renderAssetSummary();
    renderProductList();
  }

  function selectProduct(id) {
    const product = state.products.find((entry) => entry.id === id);
    if (!product) return newProduct();
    state.selectedProductId = id;
    productForm.reset();
    for (const field of ["code", "slug", "name", "category", "description", "priceCents", "imageAlt", "dimensionLabel", "dimensionValue", "material", "sortOrder"]) {
      productForm.elements[field].value = product[field];
    }
    productForm.elements.visible.checked = product.visible;
    productForm.elements.image.required = !product.imageUrl;
    productForm.elements.model.required = !product.modelUrl;
    const imageName = product.imageUrl ? product.imageUrl.split("/").pop() : null;
    const modelName = product.modelUrl ? product.modelUrl.split("/").pop() : null;
    imageLabelSpan.textContent = imageName ? `Immagine — attuale: ${imageName}` : "Immagine PNG, JPG o WebP";
    modelLabelSpan.textContent = modelName ? `Modello 3MF — attuale: ${modelName}` : "Modello 3MF";
    productFormTitle.textContent = product.name;
    deleteProductButton.hidden = false;
    productFeedback.textContent = "";
    renderAssetSummary(product);
    renderProductList();
  }

  async function loadCatalog(productId = state.selectedProductId, preserveProductForm = false) {
    const catalog = await api("/api/admin/catalog");
    state.products = catalog.products;
    state.colors = catalog.colors;
    hooks.renderColors();
    if (preserveProductForm) {
      renderProductList();
      return;
    }
    if (productId && state.products.some((product) => product.id === productId)) selectProduct(productId);
    else newProduct();
  }

  newProductButton.addEventListener("click", newProduct);

  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = productForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    productFeedback.textContent = "";
    productFeedback.classList.remove("admin-feedback--error");
    try {
      const formData = new FormData(productForm);
      formData.set("visible", String(productForm.elements.visible.checked));
      formData.set("removeModel", String(productForm.elements.removeModel.checked));
      const saved = await api(state.selectedProductId ? `/api/admin/products/${state.selectedProductId}` : "/api/admin/products", {
        method: state.selectedProductId ? "PUT" : "POST",
        body: formData,
      });
      await loadCatalog(saved.id);
      productFeedback.textContent = "Prodotto salvato.";
    } catch (error) {
      productFeedback.textContent = error.message;
      productFeedback.classList.add("admin-feedback--error");
    } finally {
      submitButton.disabled = false;
    }
  });

  deleteProductButton.addEventListener("click", async () => {
    const product = state.products.find(({ id }) => id === state.selectedProductId);
    if (!product || !confirm(`Eliminare definitivamente ${product.name}?`)) return;
    deleteProductButton.disabled = true;
    try {
      await api(`/api/admin/products/${product.id}`, { method: "DELETE" });
      await loadCatalog();
    } catch (error) {
      productFeedback.textContent = error.message;
      productFeedback.classList.add("admin-feedback--error");
    } finally {
      deleteProductButton.disabled = false;
    }
  });

  return { loadCatalog };
}
