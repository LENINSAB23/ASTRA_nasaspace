import { localized } from '../i18n/i18n.js';

/**
 * Indicadores de salud monitoreados.
 * Rangos: [mín, máx] inclusivos. Un valor fuera de `alert` se considera crítico.
 * Valores de referencia generales para adultos; el prototipo no sustituye criterio médico.
 */
export const INDICATORS = localized([
  {
    id: 'heartRate', name: 'Frecuencia cardíaca', short: 'FC', unit: 'lpm', decimals: 0,
    normal: [50, 90], watch: [40, 110], alert: [35, 130], limits: [25, 200],
    measure: 'Con el pulsómetro del traje o el reloj de salud, en reposo y por la mañana, durante 1 minuto.',
    why: 'Refleja la carga cardiovascular. En microgravedad el corazón trabaja distinto y puede perder masa muscular.',
    hazards: 'Gravedad alterada (redistribución de fluidos), radiación y estrés por aislamiento.',
    actions: ['Medir siempre en las mismas condiciones.', 'Respirar profundo y descansar si está elevada.', 'Mantener el ejercicio aeróbico diario.'],
    escalate: 'Más de 110 o menos de 45 lpm en reposo, mareo intenso o dolor de pecho.'
  },
  {
    id: 'systolic', name: 'Presión sistólica', short: 'PAS', unit: 'mmHg', decimals: 0,
    normal: [90, 130], watch: [85, 140], alert: [75, 160], limits: [50, 240],
    measure: 'Tensiómetro de brazalete, sentado y tras 5 minutos de reposo.',
    why: 'Indica la fuerza con que la sangre empuja las arterias. El desplazamiento de fluidos hacia la cabeza influye en ella y en la salud ocular.',
    hazards: 'Gravedad alterada, ambiente cerrado con CO₂ elevado y estrés.',
    actions: ['Hidratarse bien.', 'Reducir la sal en la dieta.', 'Controlar el CO₂ de la cabina.'],
    escalate: '160 mmHg o más, o menos de 85 con mareo o desmayo.'
  },
  {
    id: 'diastolic', name: 'Presión diastólica', short: 'PAD', unit: 'mmHg', decimals: 0,
    normal: [60, 85], watch: [55, 90], alert: [45, 100], limits: [30, 160],
    measure: 'Igual que la sistólica: es el segundo valor del tensiómetro.',
    why: 'Muestra la presión de las arterias entre latidos; se evalúa junto con la sistólica.',
    hazards: 'Gravedad alterada y estrés prolongado.',
    actions: ['Repetir la medición tras descansar.', 'Mantener ejercicio y buen descanso.'],
    escalate: '100 mmHg o más sostenida en dos mediciones.'
  },
  {
    id: 'glucose', name: 'Glucosa en sangre', short: 'GLU', unit: 'mg/dL', decimals: 0,
    normal: [70, 100], watch: [60, 125], alert: [50, 180], limits: [30, 400],
    measure: 'Glucómetro con muestra capilar, en ayunas.',
    why: 'El espacio puede generar resistencia a la insulina y cambios en la nutrición.',
    hazards: 'Gravedad alterada, dieta limitada, estrés y sedentarismo.',
    actions: ['Equilibrar hidratos de carbono y proteína.', 'Medir siempre en ayunas.', 'Hacer ejercicio con regularidad.'],
    escalate: 'Más de 180 o menos de 54 mg/dL, sed intensa o confusión.'
  },
  {
    id: 'temperature', name: 'Temperatura corporal', short: 'TEMP', unit: '°C', decimals: 1,
    normal: [36.1, 37.2], watch: [35.5, 37.8], alert: [35, 39], limits: [33, 42],
    measure: 'Termómetro de frente o auricular, lejos de salidas de ventilación.',
    why: 'En microgravedad no hay convección natural, así que el calor se acumula alrededor del cuerpo. La fiebre también delata infecciones.',
    hazards: 'Entorno cerrado, fallos térmicos del traje o la nave, e inmunidad alterada.',
    actions: ['Ajustar el enfriamiento del traje o la cabina.', 'Hidratarse.', 'Aislar si hay fiebre.'],
    escalate: '38 °C o más por más de 24 horas, o menos de 35,5 °C.'
  },
  {
    id: 'sleep', name: 'Horas de sueño', short: 'SUEÑO', unit: 'h', decimals: 1,
    normal: [7, 9], watch: [6, 10], alert: [4, 12], limits: [0, 16],
    measure: 'Registro automático de la banda de sueño o anotación manual al despertar.',
    why: 'Sin ciclo día-noche el ritmo circadiano se desajusta. Dormir poco reduce el rendimiento y debilita el sistema inmune.',
    hazards: 'Aislamiento, ruido, luz artificial y horarios de misión.',
    actions: ['Mantener horario fijo.', 'Evitar pantallas antes de dormir.', 'Usar la luz ajustada de la cabina.'],
    escalate: 'Menos de 5 horas durante 3 noches seguidas.'
  },
  {
    id: 'mood', name: 'Estado de ánimo', short: 'ÁNIMO', unit: '/5', decimals: 1,
    normal: [3.5, 5], watch: [2.5, 5], alert: [1.5, 5], limits: [1, 5],
    measure: 'Autoevaluación diaria de 1 (muy mal) a 5 (muy bien).',
    why: 'La salud conductual se afecta por el aislamiento, el confinamiento y la distancia a la Tierra.',
    hazards: 'Aislamiento, confinamiento y retardo en las comunicaciones.',
    actions: ['Hablar con la tripulación y con la familia.', 'Programar actividades recreativas.', 'Pedir apoyo psicológico a tierra.'],
    escalate: 'Ánimo de 2 o menos varios días seguidos, o cualquier pensamiento de hacerse daño.'
  },
  {
    id: 'spo2', name: 'Saturación de oxígeno', short: 'SpO₂', unit: '%', decimals: 0,
    normal: [95, 100], watch: [92, 100], alert: [88, 100], limits: [60, 100],
    measure: 'Oxímetro de pulso en el dedo, con la mano en reposo.',
    why: 'Confirma que el soporte vital entrega oxígeno suficiente y que los pulmones lo absorben bien.',
    hazards: 'Entorno cerrado, polvo extraterrestre y fallos del soporte vital.',
    actions: ['Revisar O₂ y CO₂ de la cabina.', 'Respirar con calma.', 'Usar filtros en tareas con polvo.'],
    escalate: 'Menos de 92 % sostenido o dificultad para respirar.'
  },
  {
    id: 'radiation', name: 'Dosis de radiación', short: 'RAD', unit: 'mSv/día', decimals: 2,
    normal: [0, 1.3], watch: [0, 2.5], alert: [0, 5], limits: [0, 12],
    measure: 'Dosímetro personal leído a diario. En una tormenta solar, ir al refugio.',
    why: 'La radiación espacial aumenta el riesgo de cáncer, daño al sistema nervioso, cataratas y problemas cardiovasculares.',
    hazards: 'Radiación espacial, sobre todo fuera de la protección de la magnetosfera terrestre.',
    actions: ['Pasar el tiempo posible en zonas blindadas.', 'Refugiarse durante tormentas solares.', 'Seguir la dosis acumulada.'],
    escalate: 'Dosis diaria superior a 2,5 mSv o alerta de tormenta solar. La NASA limita la dosis de carrera a 600 mSv y a 250 mSv por evento solar.'
  },
  {
    id: 'exercise', name: 'Ejercicio', short: 'EJER', unit: 'min/día', decimals: 0,
    normal: [90, 240], watch: [45, 300], alert: [0, 400], limits: [0, 480],
    measure: 'Registro del equipo de ejercicio resistivo y aeróbico.',
    why: 'Es la mejor contramedida contra la pérdida ósea y muscular en microgravedad.',
    hazards: 'Gravedad alterada.',
    actions: ['Combinar ejercicio resistivo y aeróbico.', 'Reservar horario fijo en la agenda.', 'Usar el anillo de gravedad si está disponible.'],
    escalate: 'Menos de 45 minutos al día durante una semana, o dolor óseo persistente.'
  }
]);

export const INDICATOR_MAP = Object.fromEntries(INDICATORS.map((i) => [i.id, i]));
