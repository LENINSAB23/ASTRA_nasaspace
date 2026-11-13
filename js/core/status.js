import * as THREE from 'three';
import { clamp } from './utils.js';
import { localized } from '../i18n/i18n.js';

/** Niveles de estado compartidos por nave, traje y cuerpo. */
export const LEVELS = localized([
  { id: 'ok', label: 'Normal' },
  { id: 'watch', label: 'Precaución' },
  { id: 'alert', label: 'Alerta' },
  { id: 'critical', label: 'Crítico' }
]);

/** Convierte un riesgo (0 a 1) en un nivel (0 a 3). */
export const levelFromRisk = (risk) => (risk < 0.25 ? 0 : risk < 0.5 ? 1 : risk < 0.75 ? 2 : 3);

const STOPS = [
  [0, new THREE.Color('#3b82f6')],
  [0.5, new THREE.Color('#f2b134')],
  [1, new THREE.Color('#e5484d')]
];

/** Azul → ámbar → rojo según el riesgo. */
export function riskColor(risk, target = new THREE.Color()) {
  const r = clamp(risk, 0, 1);
  const i = r < 0.5 ? 0 : 1;
  const [t0, c0] = STOPS[i];
  const [t1, c1] = STOPS[i + 1];
  return target.copy(c0).lerp(c1, (r - t0) / (t1 - t0));
}

export const riskHex = (risk) => `#${riskColor(risk).getHexString()}`;
