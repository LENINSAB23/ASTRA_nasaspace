import { store } from '../core/store.js';
import { INDICATORS, INDICATOR_MAP } from '../config/indicators.js';
import { CREW, TASKS } from '../data/crew.js';
import { BODY_PARTS, BODY_PART_MAP } from '../data/body.js';
import { HAZARDS, HAZARD_MAP, HAZARD_SOURCE_URL } from '../data/hazards.js';
import { LEVELS } from '../core/status.js';
import { levelOf, partRisk, crewLevel, formatValue, rangeText } from '../core/health.js';
import { badge, list } from '../ui/components.js';
import { drawSparkline } from '../ui/chart.js';
import { buildBodyModel } from '../three/bodyModel.js';

const MAX_POINTS = TASKS.reduce((sum, t) => sum + t.points, 0);

/** Vista de la tripulación: cuerpo 3D interactivo, indicadores vitales, mediciones y rutina de salud. */
export class CrewView {
  constructor() {
    this.mode = '3d';
    this.model = null;
    this.selection = null;
    this.formCrewId = null;
  }

  mount({ stage, left, right }) {
    this.stage = stage;
    this.left = left;
    this.right = right;
    this.model ??= buildBodyModel();
    this.selection = store.takeFocus() ?? this.selection ?? this.#defaultSelection();

    stage.setModel(this.model);
    stage.on({
      hover: (id, x, y) => this.#onHover(id, x, y),
      select: (id) => this.#select({ type: 'part', id })
    });

    left.innerHTML = this.#leftShell();
    right.innerHTML = this.#rightShell();
    this.#bind();
    this.formCrewId = null;
    this.update();
  }

  unmount() {
    [this.left, this.right].forEach((panel) => {
      panel.onclick = panel.onmouseover = panel.onmouseleave = panel.onsubmit = null;
      panel.innerHTML = '';
    });
  }

  update() {
    const crew = store.selectedCrew;
    BODY_PARTS.forEach((p) => this.model.setRisk(p.id, partRisk(p, crew.vitals)));
    this.model.setSelected(this.selection.type === 'part' ? this.selection.id : null);

    this.#ref(this.left, 'crew').innerHTML = this.#crewCards();
    this.#ref(this.left, 'envNote').textContent = `${store.environment.name} · gravedad ${store.environment.gravity}. ${store.environment.note}`;
    this.#ref(this.left, 'vitals').innerHTML = this.#vitalCards(crew);
    this.#ref(this.right, 'detail').innerHTML = this.#detail(crew);
    this.#ref(this.right, 'routine').innerHTML = this.#routine(crew);
    if (this.formCrewId !== crew.id) this.#renderForm(crew);

    const canvas = this.right.querySelector('canvas');
    if (canvas) drawSparkline(canvas, crew.history[this.selection.id], INDICATOR_MAP[this.selection.id]);
  }

  /* ---------- Interacción ---------- */

  #bind() {
    this.left.onclick = (e) => {
      const member = e.target.closest('[data-crew]');
      if (member) {
        store.selectCrew(member.dataset.crew);
        this.#select(this.#defaultSelection());
      }
      const vital = e.target.closest('[data-indicator]');
      if (vital) this.#select({ type: 'indicator', id: vital.dataset.indicator });
    };
    this.right.onclick = (e) => {
      const task = e.target.closest('[data-task]');
      if (task) store.toggleTask(store.selectedCrewId, task.dataset.task);
      const chip = e.target.closest('[data-indicator]');
      if (chip) this.#select({ type: 'indicator', id: chip.dataset.indicator });
    };
    this.right.onsubmit = (e) => {
      e.preventDefault();
      this.#submitMeasurement(e.target);
    };
  }

  #select(selection) {
    this.selection = selection;
    this.update();
  }

  #defaultSelection() {
    const vitals = store.selectedCrew.vitals;
    const worst = BODY_PARTS.reduce((a, b) => (partRisk(b, vitals) > partRisk(a, vitals) ? b : a));
    return { type: 'part', id: worst.id };
  }

  #onHover(id, x, y) {
    if (!id) return;
    const part = BODY_PART_MAP[id];
    const vitals = store.selectedCrew.vitals;
    const level = Math.round(partRisk(part, vitals) * 3);
    const values = part.indicators.map((i) => `${INDICATOR_MAP[i].short} ${formatValue(INDICATOR_MAP[i], vitals[i])}`).join(' · ');
    this.stage.showTooltip(`<strong>${part.name}</strong><span>${LEVELS[level].label} · ${values}</span>`, x, y);
  }

  #submitMeasurement(form) {
    const status = this.#ref(this.right, 'formStatus');
    const values = {};
    for (const ind of INDICATORS) {
      const raw = form.elements[ind.id].value.trim();
      if (raw === '') continue;
      const value = Number(raw.replace(',', '.'));
      if (!Number.isFinite(value) || value < ind.limits[0] || value > ind.limits[1]) {
        status.textContent = `${ind.name}: ingresa un valor entre ${ind.limits[0]} y ${ind.limits[1]} ${ind.unit}.`;
        status.className = 'form-status form-status--error';
        return;
      }
      values[ind.id] = value;
    }
    if (!Object.keys(values).length) {
      status.textContent = 'Ingresa al menos una medición.';
      status.className = 'form-status form-status--error';
      return;
    }
    store.record(store.selectedCrewId, values);
    form.reset();
    status.textContent = 'Medición registrada.';
    status.className = 'form-status';
  }

  #ref(panel, name) {
    return panel.querySelector(`[data-ref="${name}"]`);
  }

  /* ---------- Plantillas: panel izquierdo ---------- */

  #leftShell() {
    return `
      <div class="panel-block">
        <h2>Tripulación</h2>
        <div class="crew-list" data-ref="crew"></div>
        <p class="muted" data-ref="envNote"></p>
      </div>
      <div class="panel-block">
        <h2>Indicadores vitales</h2>
        <div class="vitals" data-ref="vitals"></div>
        <p class="muted">Datos simulados. Toca un indicador para ver cómo medirlo y qué significa.</p>
      </div>`;
  }

  #crewCards() {
    return CREW.map((c) => {
      const member = store.crew.find((m) => m.id === c.id);
      const level = crewLevel(member.vitals);
      return `
        <button class="crew-card ${c.id === store.selectedCrewId ? 'is-selected' : ''}" data-crew="${c.id}">
          <span class="dot dot--${LEVELS[level].id}"></span>
          <span><strong>${c.name}</strong><small>${c.role}</small></span>
        </button>`;
    }).join('');
  }

  #vitalCards(crew) {
    return INDICATORS.map((ind) => {
      const level = levelOf(ind, crew.vitals[ind.id]);
      const selected = this.selection.type === 'indicator' && this.selection.id === ind.id;
      return `
        <button class="vital vital--${LEVELS[level].id} ${selected ? 'is-selected' : ''}" data-indicator="${ind.id}" title="${ind.name}">
          <span class="vital__name">${ind.short}</span>
          <strong>${formatValue(ind, crew.vitals[ind.id])}<small>${ind.unit}</small></strong>
        </button>`;
    }).join('');
  }

  /* ---------- Plantillas: panel derecho ---------- */

  #rightShell() {
    return `
      <div class="panel-block" data-ref="detail"></div>
      <div class="panel-block">
        <h2>Rutina de salud</h2>
        <div data-ref="routine"></div>
      </div>
      <div class="panel-block">
        <h2>Registrar medición</h2>
        <form data-ref="form"></form>
        <p class="form-status" data-ref="formStatus"></p>
      </div>
      <div class="panel-block">
        <h2>Peligros de la misión</h2>
        <ul class="bullets">${HAZARDS.map((h) => `<li><strong>${h.name}.</strong> ${h.summary}</li>`).join('')}</ul>
        <a class="link" href="${HAZARD_SOURCE_URL}" target="_blank" rel="noopener">NASA · 5 peligros de los vuelos espaciales</a>
      </div>`;
  }

  #renderForm(crew) {
    this.formCrewId = crew.id;
    this.#ref(this.right, 'form').innerHTML = `
      <div class="form-grid">
        ${INDICATORS.map((ind) => `
          <label class="field field--compact">${ind.short} <small>(${ind.unit})</small>
            <input name="${ind.id}" type="text" inputmode="decimal" autocomplete="off" placeholder="${formatValue(ind, crew.vitals[ind.id])}">
          </label>`).join('')}
      </div>
      <button class="btn btn--primary" type="submit">Registrar</button>`;
  }

  #detail(crew) {
    return this.selection.type === 'part' ? this.#partDetail(crew) : this.#indicatorDetail(crew);
  }

  #partDetail(crew) {
    const part = BODY_PART_MAP[this.selection.id];
    const level = Math.round(partRisk(part, crew.vitals) * 3);
    const related = part.indicators.map((id) => {
      const ind = INDICATOR_MAP[id];
      return `<button class="chip chip--${LEVELS[levelOf(ind, crew.vitals[id])].id}" data-indicator="${id}">${ind.name}: ${formatValue(ind, crew.vitals[id])} ${ind.unit}</button>`;
    }).join('');
    return `
      <div class="detail-head"><h2>${part.name}</h2>${badge(level)}</div>
      <p class="muted">${part.system}</p>
      <p>${part.role}</p>
      <h3>Indicadores relacionados</h3><div class="chips">${related}</div>
      <h3>Peligros asociados</h3>
      <div class="chips">${part.hazards.map((id) => `<span class="chip">${HAZARD_MAP[id].name}</span>`).join('')}</div>
      <h3>Posibles condiciones</h3>${list(part.conditions)}
      <h3>Cómo prevenir</h3>${list(part.prevention)}
      <h3>Cuándo contactar al cirujano de vuelo</h3><p class="callout">${part.escalate}</p>`;
  }

  #indicatorDetail(crew) {
    const ind = INDICATOR_MAP[this.selection.id];
    const value = crew.vitals[ind.id];
    const level = levelOf(ind, value);
    return `
      <div class="detail-head"><h2>${ind.name}</h2>${badge(level)}</div>
      <p class="big-value">${formatValue(ind, value)} <small>${ind.unit}</small></p>
      <canvas class="spark" aria-label="Evolución de ${ind.name}"></canvas>
      <table class="table">
        <tr><td><span class="dot dot--ok"></span>Normal</td><td>${rangeText(ind, ind.normal)}</td></tr>
        <tr><td><span class="dot dot--watch"></span>Precaución</td><td>${rangeText(ind, ind.watch)}</td></tr>
        <tr><td><span class="dot dot--alert"></span>Alerta</td><td>${rangeText(ind, ind.alert)}</td></tr>
      </table>
      <h3>Cómo medirlo</h3><p>${ind.measure}</p>
      <h3>Por qué importa</h3><p>${ind.why}</p>
      <h3>Peligros que lo afectan</h3><p>${ind.hazards}</p>
      <h3>Qué hacer</h3>${list(ind.actions)}
      <h3>Cuándo contactar al cirujano de vuelo</h3><p class="callout">${ind.escalate}</p>`;
  }

  #routine(crew) {
    const rank = store.rankOf(crew);
    return `
      <div class="gauge"><span>${rank}</span><strong>${crew.points} / ${MAX_POINTS} pts</strong></div>
      <div class="bar"><i style="width:${(crew.points / MAX_POINTS) * 100}%;background:var(--accent)"></i></div>
      <ul class="tasks">
        ${TASKS.map((t) => `
          <li><button class="task ${crew.tasks.has(t.id) ? 'is-done' : ''}" data-task="${t.id}">
            <span class="task__check"></span><span>${t.label}</span><small>+${t.points}</small>
          </button></li>`).join('')}
      </ul>`;
  }
}
