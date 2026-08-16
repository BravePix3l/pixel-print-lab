import { parseStoredCart } from "./cart.js";

export const CART_STORAGE_KEY = "pixel-print-lab:cart:v1";

export const state = {
  products: [],
  colors: [],
  productsById: new Map(),
  colorsById: new Map(),
  cart: readCart(),
  currentAccount: undefined,
};

const cartListeners = new Set();
const catalogListeners = new Set();

export function onCartChange(listener) {
  cartListeners.add(listener);
}

export function onCatalogLoaded(listener) {
  catalogListeners.add(listener);
}

export function notifyCatalogLoaded() {
  catalogListeners.forEach((listener) => listener());
}

export function setCart(nextCart) {
  state.cart = nextCart;
  saveCart();
  cartListeners.forEach((listener) => listener());
}

function readCart() {
  try {
    return parseStoredCart(localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  } catch (error) {
    console.warn("Impossibile salvare il carrello nel browser.", error);
  }
}
