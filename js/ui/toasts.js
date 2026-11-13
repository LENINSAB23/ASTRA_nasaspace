import { store } from '../core/store.js';
import { $ } from '../core/utils.js';
import { t, onLangChange } from '../i18n/i18n.js';

/** Avisos emergentes con los recordatorios de salud pendientes. */
export function initToasts() {
  const host = $('#toasts');

  const render = () => {
    host.innerHTML = store.prompts.slice(-3).map((p) => `
      <div class="toast" role="status">
        <div class="toast__text"><strong>${p.label}</strong><span>${p.detail}</span></div>
        <div class="toast__actions">
          <button class="btn btn--primary btn--small" data-done="${p.id}">${t('Hecho')}</button>
          <button class="btn btn--small" data-snooze="${p.id}">${t('Más tarde')}</button>
        </div>
      </div>`).join('');
  };

  host.addEventListener('click', (e) => {
    const done = e.target.closest('[data-done]');
    const snooze = e.target.closest('[data-snooze]');
    if (done) store.completePrompt(done.dataset.done);
    if (snooze) store.snoozePrompt(snooze.dataset.snooze);
  });

  onLangChange(render);

  let last = '';
  store.subscribe(() => {
    const key = store.prompts.map((p) => p.id).join();
    if (key === last) return;
    last = key;
    render();
  });
}
