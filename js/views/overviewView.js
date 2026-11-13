import { store, TICK_SECONDS } from '../core/store.js';
import { SHIP_PARTS } from '../data/ship.js';
import { SCHEDULE } from '../data/schedule.js';
import { LEVELS, levelFromRisk } from '../core/status.js';
import { crewLevel, levelOf, formatValue } from '../core/health.js';
import { INDICATOR_MAP } from '../config/indicators.js';
import { CAREER_DOSE_LIMIT_MSV, priorities, shipIntegrity } from '../core/insights.js';
import { badge, riskBar, colorBar, stat, section, handleGoto } from '../ui/components.js';
import { pad2, escapeHtml } from '../core/utils.js';

const countdown = (ticks) => {
  const s = Math.max(0, ticks) * TICK_SECONDS;
  return s >= 60 ? `${Math.floor(s / 60)} min ${pad2(s % 60)} s` : `${s} s`;
};

/** Resumen de misión: estado de la tripulación, nave, prioridades y alertas. */
export class OverviewView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <p class="page__intro">Estado general de la misión. Selecciona un astronauta o un sistema para ver el detalle.</p>
      <div class="grid grid--4" data-ref="stats"></div>
      <div class="grid grid--wide">
        <div data-ref="crew"></div>
        <div data-ref="priorities"></div>
      </div>
      <div class="grid grid--3">
        <div data-ref="ship"></div>
        <div data-ref="alerts"></div>
        <div data-ref="next"></div>
      </div>`;
    page.onclick = handleGoto;
    this.update();
  }

  unmount() {
    this.page.onclick = null;
    this.page.innerHTML = '';
  }

  update() {
    const $ = (name) => this.page.querySelector(`[data-ref="${name}"]`);
    $('stats').innerHTML = this.#stats();
    $('crew').innerHTML = section('Tripulación', this.#crewTable());
    $('priorities').innerHTML = section('Acciones prioritarias', this.#priorities());
    $('ship').innerHTML = section('Subsistemas de la nave', this.#ship(), '<a class="link" href="#ship">Ver nave</a>');
    $('alerts').innerHTML = section('Alertas recientes', this.#alerts());
    $('next').innerHTML = section('Próximos recordatorios', this.#next(), '<a class="link" href="#schedule">Ver agenda</a>');
  }

  #stats() {
    const crew = store.crew;
    const stable = crew.filter((c) => crewLevel(c.vitals) <= 1).length;
    const avgDose = crew.reduce((sum, c) => sum + c.vitals.radiation, 0) / crew.length;
    const active = store.alerts.filter((a) => a.level >= 2).length;
    const integrity = shipIntegrity();
    const ringLevel = levelFromRisk(1 - integrity / 100);
    return [
      stat('Integridad de la nave', `${integrity} %`, LEVELS[ringLevel].label),
      stat('Tripulación estable', `${stable} de ${crew.length}`, stable === crew.length ? 'Sin indicadores en alerta' : 'Hay indicadores por revisar'),
      stat('Radiación media', `${avgDose.toFixed(2)} mSv/día`, store.stormTicks > 0 ? 'Tormenta solar activa' : store.environment.name),
      stat('Alertas activas', String(active), 'Nivel alerta o crítico')
    ].join('');
  }

  #crewTable() {
    const rows = store.crew.map((c) => {
      const v = c.vitals;
      const cell = (id) => `<td class="num lv-${LEVELS[levelOf(INDICATOR_MAP[id], v[id])].id}">${formatValue(INDICATOR_MAP[id], v[id])}</td>`;
      const level = crewLevel(v);
      return `
        <tr class="row-link" data-goto="crew" data-crew="${c.id}">
          <td><strong>${c.name}</strong><span class="cell-sub">${c.role}</span></td>
          <td>${badge(level)}</td>
          ${cell('heartRate')}${cell('systolic')}${cell('glucose')}${cell('spo2')}${cell('sleep')}${cell('mood')}
          <td class="dose">${colorBar(c.dose / CAREER_DOSE_LIMIT_MSV)}<span class="cell-sub">${c.dose.toFixed(0)} / ${CAREER_DOSE_LIMIT_MSV} mSv</span></td>
        </tr>`;
    }).join('');
    return `
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Astronauta</th><th>Estado</th><th>FC</th><th>PAS</th><th>Glucosa</th><th>SpO₂</th><th>Sueño</th><th>Ánimo</th><th>Dosis de carrera</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }

  #priorities() {
    const items = priorities();
    if (!items.length) return '<p class="empty">Sin acciones prioritarias. Todos los sistemas están dentro de los rangos esperados.</p>';
    return `<ul class="task-list">${items.map((i) => `
      <li class="task-list__item" data-goto="${i.section}"${i.crewId ? ` data-crew="${i.crewId}"` : ''}>
        <div>${badge(i.level)}</div>
        <div><strong>${escapeHtml(i.title)}</strong><span class="cell-sub">${escapeHtml(i.action)}</span></div>
      </li>`).join('')}</ul>`;
  }

  #ship() {
    const worst = [...SHIP_PARTS].sort((a, b) => store.shipDamage[b.id] - store.shipDamage[a.id]).slice(0, 5);
    return `<ul class="meter-list">${worst.map((p) => `
      <li data-goto="ship"><div class="meter-list__head"><span>${p.name}</span><span>${Math.round((1 - store.shipDamage[p.id]) * 100)} %</span></div>${riskBar(store.shipDamage[p.id])}</li>`).join('')}</ul>`;
  }

  #alerts() {
    if (!store.alerts.length) return '<p class="empty">Sin alertas registradas.</p>';
    return `<ul class="event-list">${store.alerts.slice(0, 6).map((a) => `
      <li class="event-list__item event-list__item--${LEVELS[a.level].id}"><time>${pad2(a.time.getHours())}:${pad2(a.time.getMinutes())}:${pad2(a.time.getSeconds())}</time>${escapeHtml(a.text)}</li>`).join('')}</ul>`;
  }

  #next() {
    const upcoming = [...SCHEDULE].sort((a, b) => store.scheduleState[a.id] - store.scheduleState[b.id]).slice(0, 4);
    return `<ul class="event-list">${upcoming.map((s) => `
      <li class="event-list__item"><time>${countdown(store.scheduleState[s.id])}</time>${s.label}</li>`).join('')}</ul>`;
  }
}
