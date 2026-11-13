import { localized } from '../i18n/i18n.js';

/**
 * Síntomas para la autoevaluación guiada.
 * severity: 1 = autocuidado y vigilancia, 2 = contactar a tierra hoy, 3 = contactar de inmediato.
 * Orientación general: no sustituye el protocolo médico de a bordo ni al cirujano de vuelo.
 */
export const SEVERITY_LABELS = localized({
  0: 'Sin síntomas seleccionados',
  1: 'Autocuidado y vigilancia',
  2: 'Contactar a tierra hoy',
  3: 'Contactar de inmediato'
});

export const SYMPTOMS = localized([
  {
    id: 'chestPain', label: 'Dolor u opresión en el pecho', group: 'Corazón y respiración', severity: 3, part: 'heart',
    causes: ['Problema cardíaco o arritmia', 'Esfuerzo excesivo', 'Falla en el soporte vital'],
    actions: ['Suspender cualquier actividad y sentarse o fijarse en posición cómoda.', 'Avisar de inmediato a otro tripulante y al cirujano de vuelo.', 'Medir pulso, presión y saturación de oxígeno.']
  },
  {
    id: 'breathless', label: 'Falta de aire', group: 'Corazón y respiración', severity: 3, part: 'lungs',
    causes: ['CO₂ elevado u oxígeno bajo en la cabina', 'Infección o irritación respiratoria', 'Problema cardíaco'],
    actions: ['Revisar de inmediato los niveles de O₂ y CO₂ del hábitat.', 'Usar la fuente de oxígeno suplementario según el protocolo.', 'Avisar a la tripulación y a tierra.']
  },
  {
    id: 'palpitations', label: 'Palpitaciones o latido irregular', group: 'Corazón y respiración', severity: 2, part: 'heart',
    causes: ['Arritmia asociada a la microgravedad', 'Deshidratación o falta de sueño', 'Estrés'],
    actions: ['Reposar y respirar con calma durante unos minutos.', 'Medir y registrar pulso y presión.', 'Notificar a tierra hoy, aunque pase.']
  },
  {
    id: 'cough', label: 'Tos o irritación de garganta', group: 'Corazón y respiración', severity: 1, part: 'lungs',
    causes: ['Polvo del suelo lunar o marciano en el hábitat', 'Aire seco', 'Infección respiratoria leve'],
    actions: ['Revisar y limpiar los filtros de aire.', 'Evitar entrar con polvo en la ropa o el traje.', 'Si dura más de 48 h o aparece fiebre, avisar a tierra.']
  },
  {
    id: 'headache', label: 'Dolor de cabeza', group: 'Cabeza y sentidos', severity: 1, part: 'brain',
    causes: ['Fluidos desplazados hacia la cabeza (común en microgravedad)', 'CO₂ elevado en la cabina', 'Deshidratación o poco sueño'],
    actions: ['Comprobar el nivel de CO₂ de la cabina.', 'Hidratarse y descansar.', 'Si empeora o dura más de 24 h, avisar a tierra.']
  },
  {
    id: 'vision', label: 'Visión borrosa o cambios en la vista', group: 'Cabeza y sentidos', severity: 2, part: 'eyes',
    causes: ['Síndrome neuro-ocular asociado a vuelos espaciales', 'Presión intracraneal elevada por fluidos', 'Fatiga visual'],
    actions: ['Anotar cuándo empezó y si afecta a uno o a ambos ojos.', 'Hacer la prueba de agudeza visual del botiquín.', 'Notificar a tierra hoy.']
  },
  {
    id: 'dizzy', label: 'Mareo o náuseas', group: 'Cabeza y sentidos', severity: 1, part: 'brain',
    causes: ['Adaptación del oído interno (mal del espacio)', 'Presión arterial baja', 'Deshidratación'],
    actions: ['Evitar movimientos bruscos de cabeza.', 'Beber agua y comer algo ligero.', 'Si hay vómitos persistentes o desmayo, avisar a tierra.']
  },
  {
    id: 'focus', label: 'Dificultad para concentrarme', group: 'Cabeza y sentidos', severity: 1, part: 'brain',
    causes: ['Falta de sueño', 'Estrés o carga de trabajo', 'CO₂ ligeramente elevado'],
    actions: ['Revisar horas de sueño de los últimos días.', 'Hacer pausas cortas entre tareas críticas.', 'Verificar la calidad del aire de la cabina.']
  },
  {
    id: 'fever', label: 'Fiebre o escalofríos', group: 'General', severity: 2, part: 'immune',
    causes: ['Infección o reactivación de virus latentes', 'Sobrecalentamiento por fallos térmicos', 'Sistema inmune alterado'],
    actions: ['Medir y registrar la temperatura cada pocas horas.', 'Aislarse de la tripulación si es posible y usar mascarilla.', 'Notificar a tierra hoy.']
  },
  {
    id: 'fatigue', label: 'Cansancio extremo', group: 'General', severity: 1, part: 'muscle',
    causes: ['Sueño insuficiente', 'Carga de trabajo o ejercicio excesivo', 'Nutrición insuficiente'],
    actions: ['Priorizar el descanso esta noche.', 'Revisar la ingesta de calorías y proteína.', 'Si persiste varios días, informar a tierra.']
  },
  {
    id: 'rash', label: 'Erupción o irritación en la piel', group: 'General', severity: 1, part: 'immune',
    causes: ['Roce con el traje o el equipo', 'Reacción alérgica o inmune', 'Piel seca por ambiente cerrado'],
    actions: ['Limpiar la zona e hidratarla.', 'Revisar el ajuste del traje y los puntos de roce.', 'Si se extiende, pica mucho o hay fiebre, avisar a tierra.']
  },
  {
    id: 'thirst', label: 'Sed excesiva o necesidad de orinar con frecuencia', group: 'Metabolismo', severity: 2, part: 'digestive',
    causes: ['Glucosa elevada', 'Deshidratación', 'Cambios metabólicos por microgravedad'],
    actions: ['Medir la glucosa en sangre.', 'Registrar lo que has comido y bebido.', 'Notificar a tierra hoy si la glucosa está fuera de rango.']
  },
  {
    id: 'flank', label: 'Dolor intenso en el costado o al orinar', group: 'Metabolismo', severity: 3, part: 'digestive',
    causes: ['Cálculo renal por deshidratación y pérdida de calcio óseo', 'Infección urinaria'],
    actions: ['Hidratarse y avisar de inmediato a tierra.', 'Anotar la intensidad y si hay sangre en la orina.', 'Seguir el protocolo médico de a bordo.']
  },
  {
    id: 'backPain', label: 'Dolor lumbar o de espalda', group: 'Huesos y músculos', severity: 1, part: 'bones',
    causes: ['Elongación de la columna en microgravedad', 'Postura de trabajo', 'Esfuerzo durante el ejercicio'],
    actions: ['Hacer estiramientos suaves.', 'Revisar la postura y el sistema de sujeción al trabajar.', 'Si es intenso o con adormecimiento, avisar a tierra.']
  },
  {
    id: 'boneMuscle', label: 'Dolor óseo o debilidad muscular', group: 'Huesos y músculos', severity: 2, part: 'muscle',
    causes: ['Pérdida de masa muscular u ósea', 'Ejercicio insuficiente', 'Lesión por sobreuso'],
    actions: ['Revisar el tiempo diario de ejercicio.', 'No forzar la zona dolorida.', 'Notificar a tierra para ajustar el plan de ejercicio.']
  },
  {
    id: 'insomnia', label: 'No logro dormir', group: 'Ánimo y conducta', severity: 1, part: 'brain',
    causes: ['Ritmo circadiano alterado', 'Ruido o luz en el área de descanso', 'Estrés'],
    actions: ['Mantener horario fijo y luz tenue antes de dormir.', 'Evitar pantallas y cafeína al final del día.', 'Si pasan 3 noches seguidas, avisar a tierra.']
  },
  {
    id: 'lowMood', label: 'Tristeza, ansiedad o irritabilidad persistente', group: 'Ánimo y conducta', severity: 2, part: 'brain',
    causes: ['Aislamiento y confinamiento', 'Distancia a la Tierra', 'Conflictos o sobrecarga en la tripulación'],
    actions: ['Hablar con un compañero de confianza.', 'Programar una videollamada con tu familia o con apoyo psicológico.', 'Notificar a tierra hoy.']
  },
  {
    id: 'selfHarm', label: 'Pensamientos de hacerme daño', group: 'Ánimo y conducta', severity: 3, part: 'brain',
    causes: ['Crisis de salud mental que requiere apoyo inmediato'],
    actions: ['No te quedes a solas: avisa ahora mismo a un compañero.', 'Contacta de inmediato al cirujano de vuelo y al apoyo psicológico.', 'Pedir ayuda es parte del protocolo y se atiende como prioridad.']
  }
]);
