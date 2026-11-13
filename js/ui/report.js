import { store } from '../core/store.js';
import { INDICATORS } from '../config/indicators.js';
import { LEVELS } from '../core/status.js';
import { levelOf, formatValue } from '../core/health.js';
import { CAREER_DOSE_LIMIT_MSV } from '../core/insights.js';
import { SEVERITY_LABELS } from '../data/symptoms.js';

/** Descarga un texto como archivo en el navegador. */
export function download(filename, text, mime = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

/** Historial de indicadores de un astronauta en formato CSV (una fila por muestra). */
export function buildCsv(astronaut) {
  const length = astronaut.history.heartRate.length;
  const header = ['muestra', ...INDICATORS.map((i) => `${i.name} (${i.unit})`)].join(',');
  const rows = Array.from({ length }, (_, n) => [n + 1, ...INDICATORS.map((i) => formatValue(i, astronaut.history[i.id][n]))].join(','));
  return [header, ...rows].join('\n');
}

/** Informe de estado para enviar al cirujano de vuelo en tierra. */
export function buildReport(astronaut) {
  const lines = [
    'ASTRA · INFORME DE ESTADO DE SALUD',
    `Astronauta: ${astronaut.name} (${astronaut.role})`,
    `Misión: ${store.missionClock()} · ${store.environment.name} · gravedad ${store.environment.gravity}`,
    '',
    'INDICADORES ACTUALES'
  ];
  INDICATORS.forEach((i) => {
    const level = levelOf(i, astronaut.vitals[i.id]);
    lines.push(`- ${i.name}: ${formatValue(i, astronaut.vitals[i.id])} ${i.unit} [${LEVELS[level].label}]`);
  });

  lines.push('', 'RADIACIÓN', `- Dosis acumulada: ${astronaut.dose.toFixed(1)} mSv de ${CAREER_DOSE_LIMIT_MSV} mSv (límite de carrera NASA-STD-3001)`);

  const reports = store.reports.filter((r) => r.crewId === astronaut.id).slice(0, 3);
  lines.push('', 'ÚLTIMAS AUTOEVALUACIONES DE SÍNTOMAS');
  lines.push(...(reports.length ? reports.map((r) => `- ${r.time.toLocaleTimeString('es-PE')}: ${r.symptoms.join(', ')} → ${SEVERITY_LABELS[r.severity]}`) : ['- Sin reportes.']));

  const checkin = astronaut.checkins[0];
  lines.push('', 'ÚLTIMO CHEQUEO DE BIENESTAR', checkin ? `- Puntaje ${checkin.score}/100 (${checkin.label})` : '- Sin chequeos.');
  lines.push('', 'Datos simulados con fines de demostración. No sustituye la evaluación médica.');
  return lines.join('\n');
}
