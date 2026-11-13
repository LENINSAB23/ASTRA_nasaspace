import { store } from '../core/store.js';
import { CREW } from '../data/crew.js';
import { ENVIRONMENTS } from '../config/environments.js';
import { LEVELS } from '../core/status.js';
import { $, escapeHtml, pad2 } from '../core/utils.js';
import { onLangChange } from '../i18n/i18n.js';

const VISIBLE_ALERTS = 4;

/** Barra superior (astronauta, entorno, reloj de misión, alertas) y registro de alertas sobre el visor 3D. */
export function initHud() {
  const clock = $('#mission-clock');
  const crewSelect = $('#crew-select');
  const envSelect = $('#env-select');
  const counter = $('#alert-count');
  const log = $('#alert-log');

  const fillSelects = () => {
    crewSelect.innerHTML = CREW.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
    envSelect.innerHTML = ENVIRONMENTS.map((e) => `<option value="${e.id}">${e.name} · ${e.gravity}</option>`).join('');
  };
  fillSelects();
  crewSelect.addEventListener('change', () => store.selectCrew(crewSelect.value));
  envSelect.addEventListener('change', () => store.setEnvironment(envSelect.value));

  const render = () => {
    crewSelect.value = store.selectedCrewId;
    envSelect.value = store.environmentId;
    const active = store.alerts.filter((a) => a.level >= 2).length;
    counter.textContent = String(active);
    counter.classList.toggle('is-active', active > 0);
    log.innerHTML = store.alerts.slice(0, VISIBLE_ALERTS).map((a) => {
      const t = a.time;
      return `<li class="log__item log__item--${LEVELS[a.level].id}"><time>${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}</time>${escapeHtml(a.text())}</li>`;
    }).join('');
  };

  setInterval(() => { clock.textContent = store.missionClock(); }, 1000);
  clock.textContent = store.missionClock();
  store.subscribe(render);
  onLangChange(() => { fillSelects(); render(); clock.textContent = store.missionClock(); });
  render();
}
