import { levelOf } from '../core/health.js';

const LEVEL_COLORS = ['#3fb27f', '#e0b341', '#e8883a', '#e5484d'];
export const SERIES_COLORS = ['#6aa5f0', '#8fd0a8', '#f0c36a', '#c9a3ec'];

/** Prepara el canvas para pantallas de alta densidad y devuelve su contexto y tamaño. */
function setup(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  return { ctx, width, height };
}

/** Evolución de un indicador con las bandas de rango normal y de precaución. */
export function drawSparkline(canvas, values, indicator) {
  const { ctx, width, height } = setup(canvas);
  const pad = 8;
  const lo = Math.min(...values, indicator.normal[0]);
  const hi = Math.max(...values, indicator.normal[1]);
  const margin = (hi - lo || 1) * 0.15;
  const min = lo - margin;
  const max = hi + margin;
  const x = (i) => pad + (i / Math.max(values.length - 1, 1)) * (width - pad * 2);
  const y = (v) => height - pad - ((v - min) / (max - min)) * (height - pad * 2);

  const band = (range, color) => {
    const top = y(Math.min(range[1], max));
    const bottom = y(Math.max(range[0], min));
    ctx.fillStyle = color;
    ctx.fillRect(0, top, width, bottom - top);
  };
  band(indicator.watch, 'rgba(224,179,65,0.10)');
  band(indicator.normal, 'rgba(63,178,127,0.16)');

  ctx.strokeStyle = SERIES_COLORS[0];
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  values.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
  ctx.stroke();

  const last = values[values.length - 1];
  ctx.fillStyle = LEVEL_COLORS[levelOf(indicator, last)];
  ctx.beginPath();
  ctx.arc(x(values.length - 1), y(last), 3.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Gráfica de líneas con varias series, ejes y bandas de referencia.
 * series: [{ name, color, values }]; bands: [{ from, to, color }]; lines: [{ value, color, label }]
 */
export function drawLineChart(canvas, series, { bands = [], lines = [], min, max } = {}) {
  const { ctx, width, height } = setup(canvas);
  const left = 40;
  const pad = 10;
  const all = series.flatMap((s) => s.values).concat(lines.map((l) => l.value));
  const lo = min ?? Math.min(...all);
  const hi = max ?? Math.max(...all);
  const margin = (hi - lo || 1) * 0.1;
  const yMin = min ?? lo - margin;
  const yMax = max ?? hi + margin;
  const count = Math.max(...series.map((s) => s.values.length));
  const x = (i) => left + (i / Math.max(count - 1, 1)) * (width - left - pad);
  const y = (v) => height - pad - ((v - yMin) / (yMax - yMin)) * (height - pad * 2);

  bands.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(left, y(Math.min(b.to, yMax)), width - left - pad, y(Math.max(b.from, yMin)) - y(Math.min(b.to, yMax)));
  });

  ctx.font = '11px "IBM Plex Sans", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const v = yMin + ((yMax - yMin) * i) / 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(left, y(v));
    ctx.lineTo(width - pad, y(v));
    ctx.stroke();
    ctx.fillStyle = '#8a97a6';
    ctx.fillText(v.toFixed(Math.abs(yMax - yMin) < 10 ? 1 : 0), left - 6, y(v));
  }

  lines.forEach((l) => {
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = l.color;
    ctx.beginPath();
    ctx.moveTo(left, y(l.value));
    ctx.lineTo(width - pad, y(l.value));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = l.color;
    ctx.textAlign = 'left';
    ctx.fillText(l.label, left + 6, y(l.value) - 7);
    ctx.textAlign = 'right';
  });

  series.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    s.values.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
    ctx.stroke();
  });
}
