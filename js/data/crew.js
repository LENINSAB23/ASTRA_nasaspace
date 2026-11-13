/**
 * Tripulación de demostración. `baseline` es el valor alrededor del cual oscila la telemetría simulada.
 * `initialDose` es la dosis acumulada de carrera en mSv (simulada). La radiación base la define el entorno; aquí se indica un factor individual.
 */
export const CREW = [
  {
    id: 'vargas', initialDose: 205, name: 'Elena Vargas', role: 'Comandante',
    baseline: { heartRate: 62, systolic: 116, diastolic: 74, glucose: 88, temperature: 36.6, sleep: 7.4, mood: 4.2, spo2: 98, exercise: 130 },
    radiationFactor: 1.0, suitWear: 0.08
  },
  {
    id: 'mori', initialDose: 232, name: 'Kenji Mori', role: 'Ingeniero de vuelo',
    baseline: { heartRate: 70, systolic: 124, diastolic: 80, glucose: 104, temperature: 36.8, sleep: 6.4, mood: 3.6, spo2: 97, exercise: 80 },
    radiationFactor: 1.05, suitWear: 0.2
  },
  {
    id: 'okafor', initialDose: 190, name: 'Amara Okafor', role: 'Médica de a bordo',
    baseline: { heartRate: 66, systolic: 112, diastolic: 70, glucose: 84, temperature: 36.5, sleep: 7.8, mood: 4.5, spo2: 99, exercise: 150 },
    radiationFactor: 0.95, suitWear: 0.05
  },
  {
    id: 'ferreira', initialDose: 248, name: 'Lucas Ferreira', role: 'Especialista de misión',
    baseline: { heartRate: 84, systolic: 138, diastolic: 88, glucose: 118, temperature: 37.0, sleep: 5.2, mood: 2.9, spo2: 95, exercise: 50 },
    radiationFactor: 1.1, suitWear: 0.3
  }
];

/** Rutina diaria de salud (gamificación). */
export const TASKS = [
  { id: 'vitals', label: 'Medir presión y pulso en reposo', points: 10 },
  { id: 'exercise', label: 'Ejercicio resistivo (mín. 90 min)', points: 20 },
  { id: 'mood', label: 'Registrar estado de ánimo', points: 10 },
  { id: 'water', label: 'Hidratación: 2,5 L de agua', points: 10 },
  { id: 'dosimeter', label: 'Leer el dosímetro personal', points: 10 },
  { id: 'suit', label: 'Inspeccionar el traje espacial', points: 15 }
];

export const RANKS = [
  { min: 0, label: 'Cadete' },
  { min: 30, label: 'Astronauta' },
  { min: 60, label: 'Especialista' },
  { min: 75, label: 'Comandante' }
];
