import { store } from '../core/store.js';
import { INDICATORS } from '../config/indicators.js';
import { LEVELS } from '../core/status.js';
import { levelOf, formatValue } from '../core/health.js';
import { CAREER_DOSE_LIMIT_MSV } from '../core/insights.js';
import { SEVERITY_LABELS, SYMPTOMS } from '../data/symptoms.js';
import { WELLBEING_BANDS } from '../data/wellbeing.js';
import { t, locale } from '../i18n/i18n.js';

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
  const header = [t('muestra'), ...INDICATORS.map((i) => `${i.name} (${i.unit})`)].join(',');
  const rows = Array.from({ length }, (_, n) => [n + 1, ...INDICATORS.map((i) => formatValue(i, astronaut.history[i.id][n]))].join(','));
  return [header, ...rows].join('\n');
}

/** Informe de estado para enviar al cirujano de vuelo en tierra. */
export function buildReport(astronaut) {
  const lines = [
    t('ASTRA · INFORME DE ESTADO DE SALUD'),
    t('Astronauta: {name} ({role})', { name: astronaut.name, role: astronaut.role }),
    t('Misión: {clock} · {env} · gravedad {gravity}', { clock: store.missionClock(), env: store.environment.name, gravity: store.environment.gravity }),
    '',
    t('INDICADORES ACTUALES')
  ];
  INDICATORS.forEach((i) => {
    const level = levelOf(i, astronaut.vitals[i.id]);
    lines.push(`- ${i.name}: ${formatValue(i, astronaut.vitals[i.id])} ${i.unit} [${LEVELS[level].label}]`);
  });

  lines.push('', t('RADIACIÓN'), t('- Dosis acumulada: {dose} mSv de {limit} mSv (límite de carrera NASA-STD-3001)', { dose: astronaut.dose.toFixed(1), limit: CAREER_DOSE_LIMIT_MSV }));

  const reports = store.reports.filter((r) => r.crewId === astronaut.id).slice(0, 3);
  lines.push('', t('ÚLTIMAS AUTOEVALUACIONES DE SÍNTOMAS'));
  lines.push(...(reports.length ? reports.map((r) => `- ${r.time.toLocaleTimeString(locale())}: ${r.symptoms.map((id) => SYMPTOMS.find((s) => s.id === id).label).join(', ')} → ${SEVERITY_LABELS[r.severity]}`) : [t('- Sin reportes.')]));

  const checkin = astronaut.checkins[0];
  lines.push('', t('ÚLTIMO CHEQUEO DE BIENESTAR'), checkin ? t('- Puntaje {score}/100 ({label})', { score: checkin.score, label: WELLBEING_BANDS.find((b) => b.level === checkin.level).label }) : t('- Sin chequeos.'));
  lines.push('', t('Datos simulados con fines de demostración. No sustituye la evaluación médica.'));
  return lines.join('\n');
}
