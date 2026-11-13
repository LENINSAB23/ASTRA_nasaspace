import { INDICATORS, INDICATOR_MAP } from '../config/indicators.js';

/** Nivel de un valor: 0 normal, 1 precaución, 2 alerta, 3 crítico. */
export function levelOf(indicator, value) {
  const within = ([min, max]) => value >= min && value <= max;
  if (within(indicator.normal)) return 0;
  if (within(indicator.watch)) return 1;
  if (within(indicator.alert)) return 2;
  return 3;
}

export const formatValue = (indicator, value) => Number(value).toFixed(indicator.decimals);

/** Riesgo (0 a 1) de una región del cuerpo: el peor nivel de sus indicadores. */
export function partRisk(part, vitals) {
  const worst = Math.max(...part.indicators.map((id) => levelOf(INDICATOR_MAP[id], vitals[id])));
  return worst / 3;
}

/** Peor nivel entre todos los indicadores de un astronauta. */
export const crewLevel = (vitals) => Math.max(...INDICATORS.map((i) => levelOf(i, vitals[i.id])));

/** Texto de rango para mostrar al usuario, p. ej. "50 – 90 lpm". */
export function rangeText(indicator, range) {
  const [min, max] = range;
  return `${min} – ${max} ${indicator.unit}`;
}
