import { INDICATORS, INDICATOR_MAP } from '../config/indicators.js';
import { ENVIRONMENTS, ENVIRONMENT_MAP } from '../config/environments.js';
import { CREW, TASKS, RANKS } from '../data/crew.js';
import { SHIP_PARTS } from '../data/ship.js';
import { SUIT_PARTS } from '../data/suit.js';
import { SCHEDULE } from '../data/schedule.js';
import { clamp, noise, pad2 } from './utils.js';
import { LEVELS, levelFromRisk } from './status.js';
import { levelOf } from './health.js';
import { t } from '../i18n/i18n.js';

const TICK_MS = 3000;
export const TICK_SECONDS = TICK_MS / 1000;
const HISTORY_SIZE = 40;
const MISSION_START_DAY = 187;
const MAX_ALERTS = 30;
const MAX_PROMPTS = 6;
const MAX_RECORDS = 20;
const SNOOZE_TICKS = 8;
const HOURS_PER_TICK = 24; // cada ciclo equivale a 1 hora de misión para la dosis acumulada

/** Amplitud del ruido de la telemetría simulada, por indicador. */
const NOISE = { heartRate: 1.5, systolic: 2, diastolic: 1.5, glucose: 2, temperature: 0.06, sleep: 0.12, mood: 0.08, spo2: 0.4, radiation: 0.04, exercise: 4 };

/**
 * Estado global de la aplicación y simulación de telemetría.
 * Los datos son simulados para fines de demostración.
 */
class Store {
  constructor() {
    this.listeners = new Set();
    this.environmentId = ENVIRONMENTS[0].id;
    this.selectedCrewId = CREW[0].id;
    this.startedAt = Date.now();
    this.stormTicks = 0;
    this.alerts = [];
    this.levels = new Map();
    this.timer = null;
    this.focus = null;
    this.prompts = [];
    this.reports = [];
    this.scheduleState = Object.fromEntries(SCHEDULE.map((s) => [s.id, s.first]));

    this.shipDamage = Object.fromEntries(SHIP_PARTS.map((p) => [p.id, p.initial]));
    this.crew = CREW.map((c) => this.#createAstronaut(c));
    for (let i = 0; i < HISTORY_SIZE; i++) this.crew.forEach((c) => this.#stepVitals(c));
    this.#checkLevels(true);
  }

  #createAstronaut(def) {
    const vitals = { ...def.baseline, radiation: this.environment.radiation * def.radiationFactor };
    return {
      id: def.id, name: def.name,
      get role() { return def.role; },
      radiationFactor: def.radiationFactor,
      baseline: { ...def.baseline },
      vitals,
      history: Object.fromEntries(INDICATORS.map((i) => [i.id, []])),
      suitDamage: Object.fromEntries(SUIT_PARTS.map((p) => [p.id, clamp(p.initial * 0.6 + def.suitWear, 0, 1)])),
      tasks: new Set(),
      points: 0,
      dose: def.initialDose,
      checkins: []
    };
  }

  /* ---------- Suscripción ---------- */

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  #emit() {
    this.listeners.forEach((fn) => fn());
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.#tick(), TICK_MS);
  }

  /* ---------- Consultas ---------- */

  get environment() { return ENVIRONMENT_MAP[this.environmentId]; }
  get selectedCrew() { return this.crew.find((c) => c.id === this.selectedCrewId); }

  damageMap(kind) {
    return kind === 'ship' ? this.shipDamage : this.selectedCrew.suitDamage;
  }

  missionClock() {
    const s = Math.floor((Date.now() - this.startedAt) / 1000);
    const day = MISSION_START_DAY + Math.floor(s / 86400);
    return `${t('DÍA')} ${day} · ${pad2(Math.floor((s % 86400) / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
  }

  rankOf(astronaut) {
    return [...RANKS].reverse().find((r) => astronaut.points >= r.min).label;
  }

  /* ---------- Acciones ---------- */

  selectCrew(id) {
    this.selectedCrewId = id;
    this.#emit();
  }

  setEnvironment(id) {
    this.environmentId = id;
    this.#emit();
  }

  repair(kind, partId) {
    this.damageMap(kind)[partId] = 0.03;
    this.#pushAlert(0, () => t(kind === 'ship' ? 'Nave · reparación completada' : 'Traje · reparación completada'));
    this.#checkLevels(true);
    this.#emit();
  }

  triggerEvent(type) {
    if (type === 'solar-storm') {
      this.stormTicks = 12;
      this.#raise(this.shipDamage, ['shield', 'solar', 'comms'], 0.15, 0.25);
      this.#pushAlert(3, () => t('Tormenta solar detectada: refugiarse en el blindaje'));
    } else if (type === 'micrometeorite') {
      const ids = SHIP_PARTS.map((p) => p.id).sort(() => Math.random() - 0.5).slice(0, 2);
      this.#raise(this.shipDamage, ids, 0.2, 0.35);
      this.#pushAlert(3, () => t('Impacto de micrometeorito en la estructura'));
    }
    this.#checkLevels();
    this.#emit();
  }

  /** Registra una medición manual del astronauta (valores por id de indicador). */
  record(crewId, values) {
    const astronaut = this.crew.find((c) => c.id === crewId);
    Object.entries(values).forEach(([id, value]) => {
      const ind = INDICATOR_MAP[id];
      const v = clamp(value, ind.limits[0], ind.limits[1]);
      astronaut.vitals[id] = v;
      this.#pushHistory(astronaut, id, v);
      if (id !== 'radiation') astronaut.baseline[id] = v;
    });
    this.#checkLevels();
    this.#emit();
  }

  toggleTask(crewId, taskId) {
    const astronaut = this.crew.find((c) => c.id === crewId);
    const task = TASKS.find((t) => t.id === taskId);
    if (astronaut.tasks.has(taskId)) {
      astronaut.tasks.delete(taskId);
      astronaut.points -= task.points;
    } else {
      astronaut.tasks.add(taskId);
      astronaut.points += task.points;
    }
    this.#emit();
  }

  /** Guarda la sección de destino (p. ej. una región del cuerpo) para que la vista la tome al abrirse. */
  setFocus(selection) {
    this.focus = selection;
  }

  takeFocus() {
    const focus = this.focus;
    this.focus = null;
    return focus;
  }

  addReport(crewId, report) {
    const astronaut = this.crew.find((c) => c.id === crewId);
    this.reports.unshift({ crewId, crewName: astronaut.name, time: new Date(), ...report });
    this.reports.length = Math.min(this.reports.length, MAX_RECORDS);
    this.#emit();
  }

  /** Registra un chequeo de bienestar y actualiza el estado de ánimo (1 a 5). */
  addCheckin(crewId, checkin) {
    const astronaut = this.crew.find((c) => c.id === crewId);
    astronaut.checkins.unshift({ time: new Date(), ...checkin });
    astronaut.checkins.length = Math.min(astronaut.checkins.length, MAX_RECORDS);
    this.record(crewId, { mood: checkin.mean });
  }

  completePrompt(id) {
    const prompt = this.prompts.find((p) => p.id === id);
    this.prompts = this.prompts.filter((p) => p.id !== id);
    const astronaut = this.selectedCrew;
    if (prompt?.task && !astronaut.tasks.has(prompt.task)) this.toggleTask(astronaut.id, prompt.task);
    else this.#emit();
  }

  snoozePrompt(id) {
    this.prompts = this.prompts.filter((p) => p.id !== id);
    this.scheduleState[id] = SNOOZE_TICKS;
    this.#emit();
  }

  /* ---------- Simulación ---------- */

  #tick() {
    if (this.stormTicks > 0) this.stormTicks--;
    this.crew.forEach((c) => {
      this.#stepVitals(c);
      c.dose += c.vitals.radiation / HOURS_PER_TICK;
    });
    this.#advanceSchedule();
    this.#drift(this.shipDamage, 1);
    this.crew.forEach((c) => this.#drift(c.suitDamage, 0.5));
    this.#checkLevels();
    this.#emit();
  }

  /** Descuenta tiempo a cada recordatorio y lanza uno cuando vence. */
  #advanceSchedule() {
    SCHEDULE.forEach((item) => {
      this.scheduleState[item.id]--;
      if (this.scheduleState[item.id] > 0) return;
      this.scheduleState[item.id] = item.every;
      if (this.prompts.some((p) => p.id === item.id)) return;
      this.prompts.push({ id: item.id, task: item.task, time: new Date(), get label() { return item.label; }, get detail() { return item.detail; } });
      if (this.prompts.length > MAX_PROMPTS) this.prompts.shift();
    });
  }

  #targetOf(astronaut, id) {
    if (id !== 'radiation') return astronaut.baseline[id];
    const base = this.environment.radiation * astronaut.radiationFactor;
    return this.stormTicks > 0 ? base * 3 : base;
  }

  #stepVitals(astronaut) {
    INDICATORS.forEach((ind) => {
      const current = astronaut.vitals[ind.id];
      const next = current + (this.#targetOf(astronaut, ind.id) - current) * 0.2 + noise() * NOISE[ind.id];
      const value = clamp(next, ind.limits[0], ind.limits[1]);
      astronaut.vitals[ind.id] = value;
      this.#pushHistory(astronaut, ind.id, value);
    });
  }

  #pushHistory(astronaut, id, value) {
    const list = astronaut.history[id];
    list.push(value);
    if (list.length > HISTORY_SIZE) list.shift();
  }

  #drift(map, rate) {
    Object.keys(map).forEach((id) => {
      let d = map[id] + Math.random() * 0.0015 * rate;
      if (Math.random() < 0.006 * rate) d += 0.04 + Math.random() * 0.06;
      map[id] = clamp(d, 0, 1);
    });
  }

  #raise(map, ids, min, max) {
    ids.forEach((id) => { map[id] = clamp(map[id] + min + Math.random() * (max - min), 0, 1); });
  }

  /* ---------- Alertas ---------- */

  /** `text` es una función para que la alerta se muestre en el idioma activo al leerla. */
  #pushAlert(level, text) {
    this.alerts.unshift({ time: new Date(), level, text });
    if (this.alerts.length > MAX_ALERTS) this.alerts.pop();
  }

  /** Genera alertas cuando un elemento sube a nivel Alerta o Crítico. `silent` solo actualiza la caché. */
  #checkLevels(silent = false) {
    const check = (key, level, text) => {
      const previous = this.levels.get(key) ?? 0;
      this.levels.set(key, level);
      if (!silent && level >= 2 && level > previous) this.#pushAlert(level, () => `${text()}: ${LEVELS[level].label}`);
    };
    SHIP_PARTS.forEach((p) => check(`ship:${p.id}`, levelFromRisk(this.shipDamage[p.id]), () => t('Nave · {part}', { part: p.name })));
    this.crew.forEach((c) => {
      SUIT_PARTS.forEach((p) => check(`suit:${c.id}:${p.id}`, levelFromRisk(c.suitDamage[p.id]), () => t('Traje de {name} · {part}', { name: c.name.split(' ')[0], part: p.name })));
      INDICATORS.forEach((i) => check(`vital:${c.id}:${i.id}`, levelOf(i, c.vitals[i.id]), () => `${c.name.split(' ')[0]} · ${i.name}`));
    });
  }
}

export const store = new Store();
