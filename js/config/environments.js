import { localized } from '../i18n/i18n.js';

/** Entornos de misión. `radiation` es la dosis diaria base (mSv/día) usada por la simulación (valores de demostración). */
export const ENVIRONMENTS = localized([
  { id: 'ship', name: 'Nave en tránsito a Marte', gravity: '0 g', radiation: 1.8, note: 'Fuera de la magnetosfera: mayor exposición a radiación.' },
  { id: 'station', name: 'Estación espacial (órbita baja)', gravity: '0 g', radiation: 0.6, note: 'Protegida en parte por el campo magnético terrestre.' },
  { id: 'moon', name: 'Base lunar', gravity: '0,17 g', radiation: 1.2, note: 'Sin atmósfera; polvo lunar abrasivo.' },
  { id: 'rover', name: 'Rover en Marte', gravity: '0,38 g', radiation: 0.7, note: 'Atmósfera delgada; tormentas de polvo.' }
]);

export const ENVIRONMENT_MAP = Object.fromEntries(ENVIRONMENTS.map((e) => [e.id, e]));
