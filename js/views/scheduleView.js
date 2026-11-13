import { store, TICK_SECONDS } from '../core/store.js';
import { SCHEDULE } from '../data/schedule.js';
import { TASKS } from '../data/crew.js';
import { colorBar, section, firstName } from '../ui/components.js';
import { pad2 } from '../core/utils.js';

const MAX_POINTS = TASKS.reduce((sum, t) => sum + t.points, 0);

const countdown = (ticks) => {
  const s = Math.max(0, ticks) * TICK_SECONDS;
  return s >= 60 ? `${Math.floor(s / 60)} min ${pad2(s % 60)} s` : `${s} s`;
};

/** Agenda de salud: recordatorios periódicos, rutina diaria con puntos y clasificación de la tripulación. */
export class ScheduleView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <p class="page__intro">La agenda recuerda al astronauta las acciones de salud a lo largo de la misión. En esta demostración el tiempo va acelerado.</p>
      <div class="grid grid--2">
        <div class="stack">
          <div data-ref="pending"></div>
          <div data-ref="upcoming"></div>
        </div>
        <div class="stack">
          <div data-ref="routine"></div>
          <div data-ref="ranking"></div>
        </div>
      </div>`;
    page.onclick = (e) => {
      const done = e.target.closest('[data-done]');
      const snooze = e.target.closest('[data-snooze]');
      const task = e.target.closest('[data-task]');
      if (done) store.completePrompt(done.dataset.done);
      if (snooze) store.snoozePrompt(snooze.dataset.snooze);
      if (task) store.toggleTask(store.selectedCrewId, task.dataset.task);
    };
    this.update();
  }

  unmount() {
    this.page.onclick = null;
    this.page.innerHTML = '';
  }

  update() {
    const $ = (name) => this.page.querySelector(`[data-ref="${name}"]`);
    const astronaut = store.selectedCrew;
    $('pending').innerHTML = section('Pendientes ahora', this.#pending());
    $('upcoming').innerHTML = section('Próximos recordatorios', this.#upcoming());
    $('routine').innerHTML = section(`Rutina diaria de ${firstName(astronaut.name)}`, this.#routine(astronaut));
    $('ranking').innerHTML = section('Clasificación de la tripulación', this.#ranking());
  }

  #pending() {
    if (!store.prompts.length) return '<p class="empty">No hay recordatorios pendientes.</p>';
    return `<ul class="task-list">${store.prompts.map((p) => `
      <li class="task-list__item task-list__item--action">
        <div><strong>${p.label}</strong><span class="cell-sub">${p.detail}</span></div>
        <div class="button-row">
          <button class="btn btn--primary btn--small" data-done="${p.id}">Hecho</button>
          <button class="btn btn--small" data-snooze="${p.id}">Más tarde</button>
        </div>
      </li>`).join('')}</ul>`;
  }

  #upcoming() {
    const items = [...SCHEDULE].sort((a, b) => store.scheduleState[a.id] - store.scheduleState[b.id]);
    return `<ul class="event-list">${items.map((s) => `
      <li class="event-list__item"><time>${countdown(store.scheduleState[s.id])}</time>${s.label}</li>`).join('')}</ul>`;
  }

  #routine(astronaut) {
    return `
      <div class="meter-list__head"><span>${store.rankOf(astronaut)}</span><span>${astronaut.points} de ${MAX_POINTS} puntos</span></div>
      ${colorBar(astronaut.points / MAX_POINTS)}
      <ul class="tasks">${TASKS.map((t) => `
        <li><button class="task ${astronaut.tasks.has(t.id) ? 'is-done' : ''}" data-task="${t.id}">
          <span class="task__check"></span><span>${t.label}</span><small>+${t.points}</small>
        </button></li>`).join('')}</ul>`;
  }

  #ranking() {
    const ordered = [...store.crew].sort((a, b) => b.points - a.points);
    return `<ol class="ranking">${ordered.map((c) => `
      <li><span class="ranking__name">${c.name}<small>${store.rankOf(c)}</small></span>${colorBar(c.points / MAX_POINTS)}<span class="ranking__pts">${c.points}</span></li>`).join('')}</ol>`;
  }
}
