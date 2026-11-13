import { HAZARDS } from '../data/hazards.js';
import { BODY_PARTS } from '../data/body.js';
import { INDICATORS } from '../config/indicators.js';
import { RESOURCES } from '../data/resources.js';
import { list, section, handleGoto } from '../ui/components.js';

/** Guía de referencia: peligros, glosario de indicadores, fuentes y alcance del software. */
export class GuideView {
  constructor() {
    this.mode = 'page';
  }

  mount({ page }) {
    this.page = page;
    page.innerHTML = `
      <p class="page__intro">Información de apoyo para entender qué se mide, por qué importa y de dónde sale cada dato.</p>
      <h2 class="page__title">Los cinco peligros de los vuelos espaciales</h2>
      <div class="grid grid--3">${HAZARDS.map((h) => this.#hazard(h)).join('')}</div>
      ${section('Glosario de indicadores', this.#glossary())}
      <div class="grid grid--2">
        ${section('Fuentes', this.#resources())}
        ${section('Alcance y límites del software', this.#scope())}
      </div>`;
    page.onclick = handleGoto;
  }

  unmount() {
    this.page.onclick = null;
    this.page.innerHTML = '';
  }

  update() {}

  #hazard(hazard) {
    const parts = BODY_PARTS.filter((p) => p.hazards.includes(hazard.id));
    return section(hazard.name, `
      <p>${hazard.summary}</p>
      <h3>Efectos</h3>${list(hazard.effects)}
      <h3>Contramedidas</h3>${list(hazard.countermeasures)}
      <h3>Sistemas afectados</h3>
      <div class="chips">${parts.map((p) => `<button class="chip" data-goto="crew" data-part="${p.id}">${p.name}</button>`).join('')}</div>`);
  }

  #glossary() {
    return `
      <div class="table-wrap"><table class="data-table data-table--text">
        <thead><tr><th>Indicador</th><th>Rango normal</th><th>Cómo medirlo</th><th>Por qué importa</th></tr></thead>
        <tbody>${INDICATORS.map((i) => `
          <tr><td><strong>${i.name}</strong></td><td class="nowrap">${i.normal[0]} – ${i.normal[1]} ${i.unit}</td><td>${i.measure}</td><td>${i.why}</td></tr>`).join('')}
        </tbody>
      </table></div>`;
  }

  #resources() {
    return `<ul class="resource-list">${RESOURCES.map((r) => `
      <li><span class="tag">${r.source}</span><div><a class="link" href="${r.url}" target="_blank" rel="noopener">${r.title}</a><span class="cell-sub">${r.note}</span></div></li>`).join('')}</ul>`;
  }

  #scope() {
    return list([
      'Los datos de salud, nave y traje son simulados para la demostración.',
      'Los rangos de referencia son generales para adultos y no reemplazan la evaluación médica.',
      'La autoevaluación orienta sobre urgencia y pasos a seguir; ante la duda, contactar al cirujano de vuelo.',
      'En una misión real los indicadores vendrían de sensores, dosímetros y registros médicos.',
      'Está pensado para que el astronauta tenga la guía a mano sin esperar a tierra, ya que el retardo de comunicaciones a Marte llega a unos 22 minutos.'
    ]);
  }
}
