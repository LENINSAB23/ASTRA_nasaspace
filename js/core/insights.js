import { store } from './store.js';
import { INDICATORS } from '../config/indicators.js';
import { SHIP_PARTS } from '../data/ship.js';
import { SUIT_PARTS } from '../data/suit.js';
import { levelOf, formatValue } from './health.js';
import { levelFromRisk } from './status.js';
import { t } from '../i18n/i18n.js';

export const CAREER_DOSE_LIMIT_MSV = 600;
export const SOLAR_EVENT_LIMIT_MSV = 250;

const firstName = (name) => name.split(' ')[0];

/** Integridad global de la nave (0 a 100). */
export function shipIntegrity() {
  const values = SHIP_PARTS.map((p) => store.shipDamage[p.id]);
  return Math.round((1 - values.reduce((a, b) => a + b, 0) / values.length) * 100);
}

/** Acciones prioritarias ordenadas por gravedad: indicadores vitales, nave y trajes en nivel Alerta o Crítico. */
export function priorities(limit = 6) {
  const items = [];

  store.crew.forEach((c) => INDICATORS.forEach((ind) => {
    const level = levelOf(ind, c.vitals[ind.id]);
    if (level >= 2) {
      items.push({
        level, section: 'crew', crewId: c.id,
        title: `${firstName(c.name)} · ${ind.name}: ${formatValue(ind, c.vitals[ind.id])} ${ind.unit}`,
        action: ind.actions[0]
      });
    }
  }));

  SHIP_PARTS.forEach((p) => {
    const damage = store.shipDamage[p.id];
    const level = levelFromRisk(damage);
    if (level >= 2) items.push({ level, section: 'ship', title: t('Nave · {part}: {pct} % de integridad', { part: p.name, pct: Math.round((1 - damage) * 100) }), action: p.repair });
  });

  store.crew.forEach((c) => SUIT_PARTS.forEach((p) => {
    const level = levelFromRisk(c.suitDamage[p.id]);
    if (level >= 2) items.push({ level, section: 'suit', crewId: c.id, title: t('Traje de {name} · {part}', { name: firstName(c.name), part: p.name }), action: p.repair });
  }));

  return items.sort((a, b) => b.level - a.level).slice(0, limit);
}

/** Días estimados hasta alcanzar el límite de carrera con la tasa diaria actual. */
export function daysToLimit(astronaut) {
  const rate = astronaut.vitals.radiation;
  return rate > 0 ? Math.max(0, (CAREER_DOSE_LIMIT_MSV - astronaut.dose) / rate) : Infinity;
}
