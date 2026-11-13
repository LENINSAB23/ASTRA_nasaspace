import { store } from '../core/store.js';
import { INDICATORS } from '../config/indicators.js';
import { levelOf, formatValue } from '../core/health.js';
import { badge, firstName } from '../ui/components.js';
import { drawSparkline } from '../ui/chart.js';
import { buildCsv, buildReport, download } from '../ui/report.js';

/** Evolución de todos los indicadores del astronauta seleccionado, con exportación de datos e informe. */
export class TrendsView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <div class="toolbar">
        <p class="page__intro">Evolución de los indicadores en las últimas lecturas. La franja verde marca el rango normal y la amarilla, el de precaución.</p>
        <div class="button-row">
          <button class="btn" data-action="csv">Descargar CSV</button>
          <button class="btn btn--primary" data-action="report">Informe para tierra</button>
        </div>
      </div>
      <div class="grid grid--trends" data-ref="body"></div>`;
    page.onclick = (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const astronaut = store.selectedCrew;
      const slug = firstName(astronaut.name).toLowerCase();
      if (action === 'csv') download(`astra-${slug}-indicadores.csv`, buildCsv(astronaut), 'text/csv');
      if (action === 'report') download(`astra-${slug}-informe.txt`, buildReport(astronaut));
    };
    this.update();
  }

  unmount() {
    this.page.onclick = null;
    this.page.innerHTML = '';
  }

  update() {
    const astronaut = store.selectedCrew;
    this.page.querySelector('[data-ref="body"]').innerHTML = INDICATORS.map((ind) => {
      const values = astronaut.history[ind.id];
      const current = astronaut.vitals[ind.id];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return `
        <article class="card trend">
          <header class="trend__head"><h3>${ind.name}</h3>${badge(levelOf(ind, current))}</header>
          <p class="trend__value">${formatValue(ind, current)} <small>${ind.unit}</small></p>
          <canvas class="spark" data-ind="${ind.id}" aria-label="Evolución de ${ind.name}"></canvas>
          <p class="trend__range">Mín ${formatValue(ind, min)} · Prom ${formatValue(ind, avg)} · Máx ${formatValue(ind, max)}</p>
        </article>`;
    }).join('');

    this.page.querySelectorAll('canvas[data-ind]').forEach((canvas) => {
      const ind = INDICATORS.find((i) => i.id === canvas.dataset.ind);
      drawSparkline(canvas, astronaut.history[ind.id], ind);
    });
  }
}
