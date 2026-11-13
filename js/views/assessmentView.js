import { store } from '../core/store.js';
import { SYMPTOMS, SEVERITY_LABELS } from '../data/symptoms.js';
import { WELLBEING_QUESTIONS, WELLBEING_TIPS, WELLBEING_BANDS } from '../data/wellbeing.js';
import { BODY_PART_MAP } from '../data/body.js';
import { INDICATORS } from '../config/indicators.js';
import { crewLevel, levelOf, formatValue } from '../core/health.js';
import { badge, list, section, handleGoto, firstName } from '../ui/components.js';
import { escapeHtml, pad2 } from '../core/utils.js';
import { t } from '../i18n/i18n.js';

const unique = (items) => [...new Set(items)];
const groupBy = (items, key) => items.reduce((acc, item) => ((acc[item[key]] ??= []).push(item), acc), {});

/** Autoevaluación guiada: síntomas, chequeo de bienestar y contexto del astronauta seleccionado. */
export class AssessmentView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <p class="page__intro">${t('Herramientas para que el astronauta evalúe cómo se siente y sepa qué hacer. Es una guía de apoyo: no reemplaza el protocolo médico de a bordo.')}</p>
      <div class="grid grid--2">
        ${section('Evaluación de síntomas', `
          <p class="muted">${t('Marca lo que sientes ahora. ASTRA indica la urgencia y los pasos a seguir.')}</p>
          <form data-ref="symptomForm">${this.#symptomFields()}<button class="btn btn--primary" type="submit">${t('Evaluar síntomas')}</button></form>
          <div data-ref="symptomResult"></div>`)}
        <div class="stack">
          ${section('Chequeo de bienestar', `
            <p class="muted">${t('Responde de 1 (nada) a 5 (totalmente) pensando en los últimos días.')}</p>
            <form data-ref="wellbeingForm">${this.#wellbeingFields()}<button class="btn btn--primary" type="submit">${t('Calcular bienestar')}</button></form>
            <div data-ref="wellbeingResult"></div>`)}
          <div data-ref="context"></div>
        </div>
      </div>`;
    page.onclick = handleGoto;
    page.onsubmit = (e) => {
      e.preventDefault();
      if (e.target.matches('[data-ref="symptomForm"]')) this.#evaluateSymptoms(e.target);
      else this.#evaluateWellbeing(e.target);
    };
    this.update();
  }

  unmount() {
    this.page.onclick = this.page.onsubmit = null;
    this.page.innerHTML = '';
  }

  update() {
    this.page.querySelector('[data-ref="context"]').innerHTML = section(t('Contexto de {name}', { name: firstName(store.selectedCrew.name) }), this.#context());
  }

  /* ---------- Formularios ---------- */

  #symptomFields() {
    return Object.entries(groupBy(SYMPTOMS, 'group')).map(([group, items]) => `
      <fieldset class="fieldset"><legend>${group}</legend>
        ${items.map((s) => `<label class="check"><input type="checkbox" name="symptom" value="${s.id}"><span>${s.label}</span></label>`).join('')}
      </fieldset>`).join('');
  }

  #wellbeingFields() {
    return WELLBEING_QUESTIONS.map((q) => `
      <fieldset class="scale"><legend>${q.text}</legend>
        <div class="scale__options">${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="${q.id}" value="${n}"><span>${n}</span></label>`).join('')}</div>
      </fieldset>`).join('');
  }

  /* ---------- Evaluación de síntomas ---------- */

  #evaluateSymptoms(form) {
    const target = this.page.querySelector('[data-ref="symptomResult"]');
    const ids = new Set(new FormData(form).getAll('symptom'));
    const selected = SYMPTOMS.filter((s) => ids.has(s.id));
    if (!selected.length) {
      target.innerHTML = `<p class="form-status form-status--error">${t('Selecciona al menos un síntoma.')}</p>`;
      return;
    }

    const astronaut = store.selectedCrew;
    const vitalLevel = crewLevel(astronaut.vitals);
    let severity = Math.max(...selected.map((s) => s.severity));
    if (vitalLevel >= 3) severity = Math.max(severity, 2);
    else if (vitalLevel >= 2) severity = Math.max(severity, 1);

    const causes = unique(selected.flatMap((s) => s.causes.slice(0, 2)));
    const actions = unique(selected.flatMap((s) => s.actions)).slice(0, 8);
    const parts = unique(selected.map((s) => s.part));

    store.addReport(astronaut.id, { symptoms: selected.map((s) => s.id), severity });

    target.innerHTML = `
      <div class="result result--${severity}">
        <div class="result__head">${badge(severity, SEVERITY_LABELS[severity])}<span class="muted">${t('{n} síntoma(s) · {name}', { n: selected.length, name: astronaut.name })}</span></div>
        <h3>${t('Causas posibles')}</h3>${list(causes)}
        <h3>${t('Qué hacer ahora')}</h3>${list(actions)}
        <h3>${t('Sistemas relacionados')}</h3>
        <div class="chips">${parts.map((id) => `<button type="button" class="chip" data-goto="crew" data-part="${id}">${BODY_PART_MAP[id].name}</button>`).join('')}</div>
        ${vitalLevel >= 2 ? `<p class="note">${t('Además, hay indicadores vitales fuera de rango que elevaron la prioridad.')}</p>` : ''}
      </div>`;
  }

  /* ---------- Chequeo de bienestar ---------- */

  #evaluateWellbeing(form) {
    const target = this.page.querySelector('[data-ref="wellbeingResult"]');
    const data = new FormData(form);
    const answers = WELLBEING_QUESTIONS.map((q) => ({ id: q.id, value: Number(data.get(q.id)) }));
    if (answers.some((a) => !a.value)) {
      target.innerHTML = `<p class="form-status form-status--error">${t('Responde las seis preguntas.')}</p>`;
      return;
    }

    const mean = answers.reduce((sum, a) => sum + a.value, 0) / answers.length;
    const score = Math.round(((mean - 1) / 4) * 100);
    const band = WELLBEING_BANDS.find((b) => score >= b.min);
    const lowest = [...answers].sort((a, b) => a.value - b.value).slice(0, 2).filter((a) => a.value <= 3);
    const tips = lowest.flatMap((a) => WELLBEING_TIPS[a.id]);

    store.addCheckin(store.selectedCrewId, { mean: Number(mean.toFixed(1)), score, level: band.level });
    form.reset();

    target.innerHTML = `
      <div class="result result--${band.level}">
        <div class="result__head">${badge(band.level, band.label)}<strong class="result__score">${score}<small>/100</small></strong></div>
        <p>${band.advice}</p>
        ${tips.length ? `<h3>${t('Recomendaciones')}</h3>${list(tips)}` : ''}
        <p class="muted">${t('El estado de ánimo registrado se actualizó a {value} de 5.', { value: mean.toFixed(1) })}</p>
      </div>`;
  }

  /* ---------- Contexto ---------- */

  #context() {
    const astronaut = store.selectedCrew;
    const flagged = INDICATORS
      .map((i) => ({ i, level: levelOf(i, astronaut.vitals[i.id]) }))
      .filter((x) => x.level >= 1);
    const vitals = flagged.length
      ? `<ul class="plain-list">${flagged.map(({ i, level }) => `<li>${i.name}: <strong>${formatValue(i, astronaut.vitals[i.id])} ${i.unit}</strong> ${badge(level)}</li>`).join('')}</ul>`
      : `<p class="empty">${t('Todos los indicadores están en rango normal.')}</p>`;

    const reports = store.reports.filter((r) => r.crewId === astronaut.id).slice(0, 3);
    const time = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    const history = reports.length
      ? `<ul class="plain-list">${reports.map((r) => `<li><time>${time(r.time)}</time> ${escapeHtml(r.symptoms.map((id) => SYMPTOMS.find((s) => s.id === id).label).join(', '))}</li>`).join('')}</ul>`
      : `<p class="empty">${t('Aún no hay evaluaciones de síntomas.')}</p>`;
    const checkin = astronaut.checkins[0];
    return `
      <h3>${t('Indicadores a vigilar')}</h3>${vitals}
      <h3>${t('Últimas evaluaciones')}</h3>${history}
      <h3>${t('Último chequeo de bienestar')}</h3>
      ${checkin ? `<p>${checkin.score}/100 · ${WELLBEING_BANDS.find((b) => b.level === checkin.level).label}</p>` : `<p class="empty">${t('Aún no hay chequeos.')}</p>`}`;
  }
}
