import { store } from '../core/store.js';
import { metricValue } from '../data/metric.js';
import { LEVELS, levelFromRisk } from '../core/status.js';
import { badge, riskBar, list } from '../ui/components.js';

/**
 * Vista genérica para sistemas con partes dañables: nave espacial y traje.
 * Se configura con el tipo ('ship' | 'suit'), las partes y el constructor del modelo 3D.
 */
export class SystemView {
  constructor({ kind, title, subtitle, parts, buildModel }) {
    this.mode = '3d';
    this.kind = kind;
    this.title = title;
    this.subtitle = subtitle;
    this.parts = parts;
    this.partMap = Object.fromEntries(parts.map((p) => [p.id, p]));
    this.buildModel = buildModel;
    this.model = null;
    this.selected = null;
    this.hovered = null;
  }

  mount({ stage, left, right }) {
    this.stage = stage;
    this.left = left;
    this.right = right;
    this.model ??= this.buildModel();
    this.selected ??= this.#mostDamaged();

    stage.setModel(this.model);
    stage.on({ hover: (id, x, y) => this.#onHover(id, x, y), select: (id) => this.#select(id) });
    left.innerHTML = this.#leftShell();
    this.#bindLeft();
    right.onclick = (e) => {
      if (e.target.closest('[data-action="repair"]')) store.repair(this.kind, this.selected);
    };
    this.update();
  }

  unmount() {
    [this.left, this.right].forEach((panel) => {
      panel.onclick = panel.onmouseover = panel.onmouseleave = null;
      panel.innerHTML = '';
    });
  }

  update() {
    const damage = store.damageMap(this.kind);
    this.parts.forEach((p) => this.model.setRisk(p.id, damage[p.id]));
    this.model.setSelected(this.selected);
    this.left.querySelector('[data-ref="summary"]').innerHTML = this.#summary(damage);
    this.left.querySelector('[data-ref="list"]').innerHTML = this.#partList(damage);
    this.right.innerHTML = this.#detail(damage);
  }

  /* ---------- Interacción ---------- */

  #bindLeft() {
    this.left.onclick = (e) => {
      const part = e.target.closest('[data-part]');
      if (part) this.#select(part.dataset.part);
      const event = e.target.closest('[data-event]');
      if (event) store.triggerEvent(event.dataset.event);
    };
    this.left.onmouseover = (e) => {
      const part = e.target.closest('[data-part]');
      if (part) this.model.setHover(part.dataset.part);
    };
    this.left.onmouseleave = () => this.model.setHover(null);
  }

  #select(id) {
    this.selected = id;
    this.update();
  }

  #onHover(id, x, y) {
    this.hovered = id;
    this.left.querySelectorAll('[data-part]').forEach((li) => li.classList.toggle('is-hover', li.dataset.part === id));
    if (!id) return;
    const part = this.partMap[id];
    const damage = store.damageMap(this.kind)[id];
    this.stage.showTooltip(
      `<strong>${part.name}</strong><span>Integridad ${Math.round((1 - damage) * 100)} % · ${LEVELS[levelFromRisk(damage)].label}</span>`, x, y
    );
  }

  #mostDamaged() {
    const damage = store.damageMap(this.kind);
    return this.parts.reduce((a, b) => (damage[b.id] > damage[a.id] ? b : a)).id;
  }

  /* ---------- Plantillas ---------- */

  #leftShell() {
    const events = this.kind === 'ship'
      ? `<div class="panel-block">
           <h2>Simular eventos</h2>
           <div class="button-row">
             <button class="btn" data-event="solar-storm">Tormenta solar</button>
             <button class="btn" data-event="micrometeorite">Micrometeorito</button>
           </div>
         </div>`
      : '';
    return `
      <div class="panel-block">
        <h2>${this.title}</h2>
        <p class="muted">${this.subtitle}</p>
        <div data-ref="summary"></div>
      </div>
      <ul class="part-list" data-ref="list"></ul>
      ${events}`;
  }

  #summary(damage) {
    const values = this.parts.map((p) => damage[p.id]);
    const integrity = Math.round((1 - values.reduce((a, b) => a + b, 0) / values.length) * 100);
    const critical = values.filter((d) => levelFromRisk(d) >= 2).length;
    return `
      <div class="summary">
        <div><span class="summary__value">${integrity}%</span><span class="muted">Integridad global</span></div>
        <div><span class="summary__value">${critical}</span><span class="muted">En alerta o crítico</span></div>
      </div>`;
  }

  #partList(damage) {
    return this.parts.map((p) => `
      <li class="part-item ${p.id === this.selected ? 'is-selected' : ''} ${p.id === this.hovered ? 'is-hover' : ''}" data-part="${p.id}">
        <div class="part-item__head"><span>${p.name}</span><span>${Math.round((1 - damage[p.id]) * 100)}%</span></div>
        ${riskBar(damage[p.id])}
      </li>`).join('');
  }

  #detail(damage) {
    const part = this.partMap[this.selected];
    const d = damage[part.id];
    const level = levelFromRisk(d);
    const faultCount = d < 0.1 ? 0 : Math.ceil(d * part.faults.length);
    const faults = faultCount ? list(part.faults.slice(0, faultCount)) : '<p class="muted">Sin fallos detectados.</p>';
    const action = d >= 0.25 ? part.repair : 'Mantenimiento rutinario: no se requieren acciones urgentes.';
    return `
      <div class="panel-block">
        <div class="detail-head"><h2>${part.name}</h2>${badge(level)}</div>
        <p>${part.desc}</p>
        <div class="gauge"><span>Daño</span><strong>${Math.round(d * 100)}%</strong></div>
        ${riskBar(d)}
      </div>
      <div class="panel-block">
        <h3>Telemetría</h3>
        <table class="table">
          ${part.metrics.map((m) => `<tr><td>${m.label}</td><td><strong>${metricValue(m, d)}</strong> ${m.unit}</td></tr>`).join('')}
        </table>
      </div>
      <div class="panel-block">
        <h3>Posibles fallos</h3>${faults}
        <h3>Acción recomendada</h3><p>${action}</p>
        <button class="btn btn--primary" data-action="repair" ${d < 0.05 ? 'disabled' : ''}>Iniciar reparación</button>
      </div>`;
  }
}
