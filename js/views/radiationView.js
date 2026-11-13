import { store } from '../core/store.js';
import { ENVIRONMENTS } from '../config/environments.js';
import { RESOURCES } from '../data/resources.js';
import { LEVELS } from '../core/status.js';
import { INDICATOR_MAP } from '../config/indicators.js';
import { levelOf } from '../core/health.js';
import { CAREER_DOSE_LIMIT_MSV, SOLAR_EVENT_LIMIT_MSV, daysToLimit } from '../core/insights.js';
import { badge, colorBar, list, stat, section, firstName } from '../ui/components.js';
import { drawLineChart, SERIES_COLORS } from '../ui/chart.js';

const STORM_STEPS = [
  'Ir de inmediato al refugio blindado de la nave.',
  'Permanecer ahí hasta que tierra indique que el evento terminó.',
  'Suspender las actividades extravehiculares y cerrar las compuertas.',
  'Leer el dosímetro personal al salir y registrar la dosis.'
];

const RADIATION_LINK = RESOURCES.find((r) => r.source === 'CSA' && r.title.startsWith('Monitoreo'));

/** Monitoreo de radiación: dosis acumulada frente a los límites de la NASA, tasa diaria y qué hacer ante una tormenta solar. */
export class RadiationView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <p class="page__intro">La radiación espacial es el peligro que más crece en misiones largas fuera de la órbita terrestre. Aquí se sigue la dosis diaria y la acumulada de cada astronauta.</p>
      <div class="grid grid--4" data-ref="stats"></div>
      <div class="grid grid--2">
        <div data-ref="doses"></div>
        <div data-ref="chart"></div>
      </div>
      <div class="grid grid--2">
        <div data-ref="environments"></div>
        <div data-ref="storm"></div>
      </div>`;
    page.onclick = (e) => {
      if (e.target.closest('[data-event]')) store.triggerEvent(e.target.closest('[data-event]').dataset.event);
    };
    this.update();
  }

  unmount() {
    this.page.onclick = null;
    this.page.innerHTML = '';
  }

  update() {
    const $ = (name) => this.page.querySelector(`[data-ref="${name}"]`);
    $('stats').innerHTML = this.#stats();
    $('doses').innerHTML = section('Dosis acumulada de carrera', this.#doses());
    $('chart').innerHTML = section('Tasa de dosis diaria', `
      <canvas class="chart" aria-label="Tasa de dosis diaria por astronauta"></canvas>
      <div class="legend">${store.crew.map((c, i) => `<span><i style="background:${SERIES_COLORS[i]}"></i>${firstName(c.name)}</span>`).join('')}</div>`);
    $('environments').innerHTML = section('Dosis diaria típica por entorno', this.#environments());
    $('storm').innerHTML = section('Tormenta solar', this.#storm());

    drawLineChart(
      this.page.querySelector('canvas'),
      store.crew.map((c, i) => ({ name: c.name, color: SERIES_COLORS[i], values: c.history.radiation })),
      {
        min: 0,
        bands: [{ from: 0, to: 1.3, color: 'rgba(63,178,127,0.10)' }],
        lines: [{ value: 1.3, color: '#3fb27f', label: 'Referencia NASA en espacio libre: 1,3 mSv/día' }, { value: 2.5, color: '#e0b341', label: 'Precaución' }]
      }
    );
  }

  #stats() {
    const avg = store.crew.reduce((sum, c) => sum + c.vitals.radiation, 0) / store.crew.length;
    const shield = Math.round(65 - 35 * store.shipDamage.shield);
    const storm = store.stormTicks > 0;
    return [
      stat('Tasa media actual', `${avg.toFixed(2)} mSv/día`, store.environment.name),
      stat('Clima espacial', storm ? 'Tormenta solar' : 'Sin eventos', storm ? 'Refugiarse en el blindaje' : 'Condiciones habituales'),
      stat('Atenuación del blindaje', `${shield} %`, 'Refugio de la nave'),
      stat('Límite por evento solar', `${SOLAR_EVENT_LIMIT_MSV} mSv`, 'NASA-STD-3001')
    ].join('');
  }

  #doses() {
    const rows = store.crew.map((c) => {
      const fraction = c.dose / CAREER_DOSE_LIMIT_MSV;
      const days = daysToLimit(c);
      const level = levelOf(INDICATOR_MAP.radiation, c.vitals.radiation);
      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td class="dose">${colorBar(fraction, fraction > 0.75 ? 'var(--critical)' : fraction > 0.5 ? 'var(--watch)' : 'var(--accent)')}<span class="cell-sub">${c.dose.toFixed(1)} mSv · ${Math.round(fraction * 100)} %</span></td>
          <td class="num">${c.vitals.radiation.toFixed(2)}</td>
          <td class="num">${Number.isFinite(days) ? Math.round(days) : '—'}</td>
          <td>${badge(level)}</td>
        </tr>`;
    }).join('');
    return `
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Astronauta</th><th>Dosis de ${CAREER_DOSE_LIMIT_MSV} mSv</th><th>mSv/día</th><th>Días al límite</th><th>Tasa</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <p class="muted">Límite de carrera de la NASA: ${CAREER_DOSE_LIMIT_MSV} mSv, igual para todos los astronautas. Los días al límite se calculan con la tasa actual. Valores simulados.</p>`;
  }

  #environments() {
    const max = Math.max(...ENVIRONMENTS.map((e) => e.radiation));
    return `
      <ul class="meter-list">${ENVIRONMENTS.map((e) => `
        <li><div class="meter-list__head"><span>${e.name}${e.id === store.environmentId ? ' (actual)' : ''}</span><span>${e.radiation.toFixed(1)} mSv/día</span></div>${colorBar(e.radiation / max)}</li>`).join('')}</ul>
      <p class="muted">Valores de referencia para la demostración. La atmósfera, el suelo y el campo magnético cambian la exposición en cada lugar.</p>`;
  }

  #storm() {
    const active = store.stormTicks > 0;
    return `
      ${active ? `<div class="callout">${badge(3, 'Tormenta solar activa')} Refugiarse en el blindaje de la nave.</div>` : '<p class="muted">Sin eventos activos. En una tormenta solar la dosis puede subir varias veces en pocas horas.</p>'}
      <h3>Qué hacer</h3>${list(STORM_STEPS)}
      <div class="button-row">
        <button class="btn" data-event="solar-storm">Simular tormenta solar</button>
        ${RADIATION_LINK ? `<a class="btn" href="${RADIATION_LINK.url}" target="_blank" rel="noopener">Recurso de la CSA</a>` : ''}
      </div>
      <p class="muted">Estado: ${LEVELS[active ? 3 : 0].label}.</p>`;
  }
}
