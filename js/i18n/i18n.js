import { EN } from './en.js';

/**
 * Internacionalización mínima (español / inglés).
 * El texto fuente del proyecto está en español y funciona como clave: `t('Texto')` devuelve la
 * traducción de `en.js` cuando el idioma activo es el inglés, o el mismo texto si no hay entrada.
 */
const STORAGE_KEY = 'astra.lang';
export const LANGS = ['es', 'en'];

let lang = 'es';
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (LANGS.includes(saved)) lang = saved;
} catch { /* almacenamiento no disponible: se usa el idioma por defecto */ }
if (typeof document !== 'undefined') document.documentElement.lang = lang;

const listeners = new Set();

export const getLang = () => lang;

/** Configuración regional para fechas y horas. */
export const locale = () => (lang === 'en' ? 'en-US' : 'es-PE');

/** Traduce un texto y reemplaza los marcadores `{nombre}` con los valores indicados. */
export function t(text, vars) {
  let out = lang === 'en' && Object.hasOwn(EN, text) ? EN[text] : text;
  if (vars) out = out.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
  return out;
}

export function setLang(next) {
  if (next === lang || !LANGS.includes(next)) return;
  lang = next;
  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* sin persistencia */ }
  document.documentElement.lang = next;
  listeners.forEach((listener) => listener(next));
}

export const onLangChange = (listener) => listeners.add(listener);

const proxies = new WeakMap();

/**
 * Envuelve datos escritos en español para que cada texto se traduzca al leerlo.
 * Las vistas siguen usando `indicator.name` o `part.desc` y reciben el idioma activo.
 */
export function localized(data) {
  if (typeof data === 'string') return t(data);
  if (data === null || typeof data !== 'object') return data;
  if (!proxies.has(data)) {
    proxies.set(data, new Proxy(data, { get: (target, prop, receiver) => localized(Reflect.get(target, prop, receiver)) }));
  }
  return proxies.get(data);
}

/**
 * Traduce el HTML estático. El texto original (en español) se conserva en `data-es`:
 * - `data-i18n`: reemplaza el contenido del elemento.
 * - `data-i18n-attr="aria-label,title"`: traduce esos atributos.
 */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.dataset.es ??= el.textContent.trim();
    el.textContent = t(el.dataset.es);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((attr) => {
      const key = `es${attr.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}`;
      el.dataset[key] ??= el.getAttribute(attr);
      el.setAttribute(attr, t(el.dataset[key]));
    });
  });
}
