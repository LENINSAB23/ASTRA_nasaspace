export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Ruido aproximadamente gaussiano en el rango [-1, 1]. */
export const noise = () => Math.random() + Math.random() - 1;

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const pad2 = (n) => String(n).padStart(2, '0');

/** Atajo para consultar un elemento del DOM. */
export const $ = (selector, root = document) => root.querySelector(selector);
