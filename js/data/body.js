/** Regiones del cuerpo: función, peligros asociados, indicadores que las evalúan y posibles condiciones. */
export const BODY_PARTS = [
  {
    id: 'brain', name: 'Cerebro y conducta', system: 'Sistema nervioso',
    role: 'Regula el sueño, el ánimo, la cognición y la toma de decisiones, claves para el desempeño de la tripulación.',
    hazards: ['isolation', 'distance', 'radiation'], indicators: ['sleep', 'mood'],
    conditions: ['Insomnio y alteración del ritmo circadiano', 'Depresión y ansiedad por aislamiento', 'Fatiga cognitiva y errores de desempeño', 'Conflictos dentro de la tripulación'],
    prevention: ['Mantener un horario fijo de sueño', 'Videollamadas regulares y apoyo psicológico desde tierra', 'Actividades de grupo y tiempo recreativo', 'Registrar el ánimo todos los días'],
    escalate: 'Si duerme menos de 5 h durante 3 noches, el ánimo es 2/5 o menos, o hay pensamientos de hacerse daño: contactar de inmediato al cirujano de vuelo.'
  },
  {
    id: 'eyes', name: 'Ojos', system: 'Sistema visual',
    role: 'El desplazamiento de fluidos hacia la cabeza puede aplanar el globo ocular y alterar la visión (síndrome neuro-ocular asociado a vuelos espaciales). La presión arterial se usa aquí como indicador indirecto.',
    hazards: ['gravity', 'radiation', 'environment'], indicators: ['systolic', 'diastolic'],
    conditions: ['Edema del disco óptico', 'Aplanamiento del globo ocular', 'Visión borrosa o hipermetropía', 'Cataratas por radiación (largo plazo)'],
    prevention: ['Prueba de agudeza visual semanal', 'Controlar la presión arterial', 'Mantener bajo el CO₂ de la cabina'],
    escalate: 'Cualquier cambio brusco de visión, manchas o dolor ocular: avisar a tierra el mismo día.'
  },
  {
    id: 'heart', name: 'Corazón y circulación', system: 'Sistema cardiovascular',
    role: 'Bombea la sangre. En microgravedad los fluidos se redistribuyen y el corazón puede cambiar de forma y perder masa.',
    hazards: ['gravity', 'radiation', 'isolation'], indicators: ['heartRate', 'systolic', 'diastolic'],
    conditions: ['Arritmias', 'Atrofia del músculo cardíaco', 'Hipotensión ortostática al volver a la gravedad', 'Enfermedad cardiovascular por radiación (largo plazo)'],
    prevention: ['Ejercicio aeróbico diario', 'Hidratación y control de sal', 'Medir pulso y presión cada mañana'],
    escalate: 'Frecuencia en reposo mayor de 110 o menor de 45 lpm, dolor de pecho, mareo intenso o presión de 160/100 o más.'
  },
  {
    id: 'lungs', name: 'Pulmones', system: 'Sistema respiratorio',
    role: 'Intercambian oxígeno y CO₂. Dependen del soporte vital y de la calidad del aire del hábitat.',
    hazards: ['environment', 'radiation'], indicators: ['spo2', 'temperature'],
    conditions: ['Hipoxia por falla del soporte vital', 'Irritación por polvo lunar o marciano', 'Infecciones respiratorias', 'Intoxicación por CO₂'],
    prevention: ['Revisar a diario O₂ y CO₂ de la cabina', 'Usar mascarilla o filtros en tareas con polvo', 'Limpiar los filtros HEPA'],
    escalate: 'Saturación menor de 92 % sostenida, falta de aire o tos persistente: usar oxígeno y avisar a tierra.'
  },
  {
    id: 'digestive', name: 'Metabolismo y digestión', system: 'Sistema digestivo y endocrino',
    role: 'Procesa los nutrientes y regula la glucosa. Una nutrición inadecuada afecta a todo el cuerpo.',
    hazards: ['gravity', 'environment', 'distance'], indicators: ['glucose'],
    conditions: ['Resistencia a la insulina e hiperglucemia', 'Náuseas y mal del espacio', 'Pérdida de peso por nutrición inadecuada', 'Cálculos renales por deshidratación'],
    prevention: ['Dieta equilibrada con suplemento de vitamina D', 'Beber al menos 2,5 L al día', 'Medir la glucosa en ayunas'],
    escalate: 'Glucosa en ayunas mayor de 180 o menor de 54 mg/dL, vómitos persistentes o dolor intenso de flanco.'
  },
  {
    id: 'bones', name: 'Huesos y columna', system: 'Sistema óseo',
    role: 'Sin carga gravitatoria el hueso se debilita: se puede perder hasta 1–1,5 % de densidad por mes en la cadera.',
    hazards: ['gravity', 'radiation'], indicators: ['exercise'],
    conditions: ['Pérdida de densidad ósea', 'Dolor lumbar por elongación de la columna', 'Fracturas por fragilidad al regresar a la gravedad', 'Exceso de calcio en sangre'],
    prevention: ['Ejercicio resistivo de unas 2 h al día', 'Calcio y vitamina D supervisados', 'Aprovechar la gravedad artificial si existe'],
    escalate: 'Dolor óseo persistente o ejercicio menor de 45 min/día durante una semana: consultar a tierra.'
  },
  {
    id: 'muscle', name: 'Músculos', system: 'Sistema muscular',
    role: 'Los músculos antigravitatorios (piernas, espalda) se atrofian si no se ejercitan.',
    hazards: ['gravity', 'isolation'], indicators: ['exercise'],
    conditions: ['Atrofia muscular', 'Pérdida de fuerza y resistencia', 'Lesiones por sobreuso', 'Debilidad al volver a la gravedad'],
    prevention: ['Ejercicio resistivo y aeróbico', 'Proteína suficiente en la dieta', 'Estiramientos y calentamiento'],
    escalate: 'Dolor muscular intenso o pérdida de fuerza notable: consultar al cirujano de vuelo.'
  },
  {
    id: 'immune', name: 'Sistema inmune', system: 'Defensas',
    role: 'Defiende al cuerpo. El estrés, la radiación y el poco sueño lo desregulan y pueden reactivar virus latentes.',
    hazards: ['radiation', 'isolation', 'environment'], indicators: ['sleep', 'radiation', 'temperature'],
    conditions: ['Reactivación de virus latentes (herpes, varicela)', 'Infecciones y alergias', 'Inflamación desregulada', 'Fiebre por infección'],
    prevention: ['Dormir entre 7 y 9 h', 'Limpiar superficies e higiene personal', 'Ejercicio moderado', 'Vigilar la dosis de radiación'],
    escalate: 'Temperatura de 38 °C o más por más de 24 h, erupciones o infecciones que no mejoran.'
  }
];

export const BODY_PART_MAP = Object.fromEntries(BODY_PARTS.map((p) => [p.id, p]));
