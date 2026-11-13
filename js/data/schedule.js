/**
 * Recordatorios periódicos de salud.
 * `every` y `first` están en ciclos de simulación (1 ciclo ≈ 3 s): en la demostración los intervalos van acelerados.
 * `task` enlaza con la rutina diaria (js/data/crew.js) para sumar puntos al completarlo.
 */
export const SCHEDULE = [
  { id: 'bp', label: 'Medir presión arterial y pulso', detail: 'Sentado y tras 5 minutos de reposo.', every: 60, first: 9, task: 'vitals' },
  { id: 'water', label: 'Beber 500 mL de agua', detail: 'La sed se percibe menos en microgravedad.', every: 45, first: 18, task: 'water' },
  { id: 'mood', label: 'Hacer el chequeo de bienestar', detail: 'Dos minutos en la sección Autoevaluación.', every: 90, first: 30, task: 'mood' },
  { id: 'dosimeter', label: 'Leer el dosímetro personal', detail: 'Anota la dosis del día.', every: 80, first: 42, task: 'dosimeter' },
  { id: 'exercise', label: 'Sesión de ejercicio resistivo', detail: 'Mínimo 90 minutos al día en total.', every: 120, first: 55, task: 'exercise' },
  { id: 'glucose', label: 'Medir glucosa en ayunas', detail: 'Antes de la primera comida.', every: 150, first: 70, task: null },
  { id: 'suit', label: 'Inspeccionar el traje espacial', detail: 'Antes de cada actividad extravehicular.', every: 180, first: 85, task: 'suit' },
  { id: 'sleep', label: 'Preparar el descanso', detail: 'Luz tenue y sin pantallas durante la última hora.', every: 200, first: 100, task: null }
];
