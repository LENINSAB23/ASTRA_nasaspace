import { store } from './core/store.js';
import { Stage } from './three/stage.js';
import { SystemView } from './views/systemView.js';
import { CrewView } from './views/crewView.js';
import { OverviewView } from './views/overviewView.js';
import { AssessmentView } from './views/assessmentView.js';
import { RadiationView } from './views/radiationView.js';
import { TrendsView } from './views/trendsView.js';
import { ScheduleView } from './views/scheduleView.js';
import { GuideView } from './views/guideView.js';
import { SHIP_PARTS } from './data/ship.js';
import { SUIT_PARTS } from './data/suit.js';
import { buildShipModel } from './three/shipModel.js';
import { buildSuitModel } from './three/suitModel.js';
import { initHud } from './ui/hud.js';
import { initToasts } from './ui/toasts.js';
import { icon } from './ui/icons.js';
import { $ } from './core/utils.js';

/** Secciones de la aplicación, agrupadas en la barra lateral. */
const SECTIONS = [
  { id: 'overview', label: 'Resumen', group: 'Estado', view: new OverviewView() },
  {
    id: 'ship', label: 'Nave', group: 'Estado',
    view: new SystemView({
      kind: 'ship', title: 'Estado de la nave',
      subtitle: 'Pasa el mouse sobre una pieza para ver su estado. Azul: operativa. Rojo: dañada.',
      parts: SHIP_PARTS, buildModel: buildShipModel
    })
  },
  {
    id: 'suit', label: 'Traje', group: 'Estado',
    view: new SystemView({
      kind: 'suit', title: 'Traje espacial',
      subtitle: 'Componentes del traje del astronauta seleccionado, antes de una actividad extravehicular.',
      parts: SUIT_PARTS, buildModel: buildSuitModel
    })
  },
  { id: 'crew', label: 'Tripulación', group: 'Estado', view: new CrewView() },
  { id: 'assessment', label: 'Autoevaluación', group: 'Salud', view: new AssessmentView() },
  { id: 'radiation', label: 'Radiación', group: 'Salud', view: new RadiationView() },
  { id: 'trends', label: 'Tendencias', group: 'Salud', view: new TrendsView() },
  { id: 'schedule', label: 'Agenda', group: 'Misión', view: new ScheduleView() },
  { id: 'guide', label: 'Guía', group: 'Misión', view: new GuideView() }
];

const sections = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
const DEFAULT_SECTION = 'overview';

const nav = $('#nav');
const title = $('#view-title');
const stageLayout = $('#view-3d');
const pageLayout = $('#view-page');
const stage = new Stage($('#stage'));
const panels = { stage, left: $('#panel-left'), right: $('#panel-right'), page: pageLayout };
let current = null;

function renderNav() {
  const groups = [...new Set(SECTIONS.map((s) => s.group))];
  nav.innerHTML = groups.map((group) => `
    <div class="nav__group">
      <span class="nav__label">${group}</span>
      ${SECTIONS.filter((s) => s.group === group).map((s) => `<a class="nav__item" href="#${s.id}" data-section="${s.id}">${icon(s.id)}<span>${s.label}</span></a>`).join('')}
    </div>`).join('');
}

function show(id) {
  const section = sections[id] ?? sections[DEFAULT_SECTION];
  current?.unmount();
  current = section.view;

  const is3d = current.mode === '3d';
  stageLayout.hidden = !is3d;
  pageLayout.hidden = is3d;
  title.textContent = section.label;
  nav.querySelectorAll('[data-section]').forEach((el) => el.classList.toggle('is-active', el.dataset.section === section.id));

  current.mount(panels);
  (is3d ? stageLayout : pageLayout).scrollTop = 0;
}

renderNav();
window.addEventListener('hashchange', () => show(location.hash.slice(1)));
store.subscribe(() => current?.update());
initHud();
initToasts();
store.start();
show(location.hash.slice(1));
