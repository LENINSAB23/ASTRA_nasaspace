import { store } from '../core/store.js';
import { LEVELS, riskHex } from '../core/status.js';

/** Etiqueta de estado según el nivel (0 a 3). */
export const badge = (level, text = LEVELS[level].label) => `<span class="badge badge--${LEVELS[level].id}">${text}</span>`;

/** Barra de progreso coloreada según el riesgo (0 a 1). */
export const riskBar = (risk) =>
  `<div class="bar"><i style="width:${Math.round(risk * 100)}%;background:${riskHex(risk)}"></i></div>`;

/** Barra de progreso con un color CSS fijo. */
export const colorBar = (fraction, color = 'var(--accent)') =>
  `<div class="bar"><i style="width:${Math.round(Math.min(Math.max(fraction, 0), 1) * 100)}%;background:${color}"></i></div>`;

export const list = (items) => `<ul class="bullets">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

/** Tarjeta de indicador numérico para los paneles de resumen. */
export const stat = (label, value, sub = '') =>
  `<div class="stat"><span class="stat__label">${label}</span><strong class="stat__value">${value}</strong><span class="stat__sub">${sub}</span></div>`;

export const section = (title, body, extra = '') =>
  `<section class="card"><header class="card__head"><h2>${title}</h2>${extra}</header>${body}</section>`;

/**
 * Atiende los elementos con `data-goto="vista"` (y opcionalmente `data-crew` y `data-part`):
 * selecciona el astronauta o la región y cambia de sección. No devuelve valor, para poder usarse como `onclick`
 * sin cancelar la acción por defecto del navegador.
 */
export function handleGoto(event) {
  const target = event.target.closest('[data-goto]');
  if (!target) return;
  if (target.dataset.crew) store.selectCrew(target.dataset.crew);
  if (target.dataset.part) store.setFocus({ type: 'part', id: target.dataset.part });
  location.hash = target.dataset.goto;
}

export const firstName = (fullName) => fullName.split(' ')[0];
