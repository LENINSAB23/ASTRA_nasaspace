/** Los 5 peligros de los vuelos espaciales tripulados (NASA Human Research Program). */
export const HAZARDS = [
  {
    id: 'radiation', name: 'Radiación espacial',
    summary: 'Partículas de alta energía que dañan células y ADN.',
    effects: ['Mayor riesgo de cáncer', 'Daño al sistema nervioso y cataratas', 'Efectos cardiovasculares e inmunes'],
    countermeasures: ['Blindaje y refugio para tormentas solares', 'Dosímetros personales y alertas de clima espacial', 'Limitar el tiempo en zonas de mayor exposición']
  },
  {
    id: 'isolation', name: 'Aislamiento y confinamiento',
    summary: 'Espacio reducido y convivencia prolongada con el mismo grupo.',
    effects: ['Alteraciones del sueño y del ánimo', 'Ansiedad y depresión', 'Tensión entre tripulantes'],
    countermeasures: ['Horarios fijos y tiempo privado', 'Comunicación regular con familia y apoyo psicológico', 'Actividades recreativas en grupo']
  },
  {
    id: 'distance', name: 'Distancia a la Tierra',
    summary: 'Sin evacuación rápida y con comunicaciones retardadas.',
    effects: ['Mayor autonomía médica necesaria', 'Retardo en la asesoría de tierra', 'Menor capacidad de reabastecimiento'],
    countermeasures: ['Botiquín y capacitación médica a bordo', 'Herramientas de autoevaluación como ASTRA', 'Protocolos claros de cuándo avisar a tierra']
  },
  {
    id: 'gravity', name: 'Campos de gravedad',
    summary: 'Microgravedad y gravedad parcial alteran huesos, músculos y fluidos.',
    effects: ['Pérdida ósea y muscular', 'Cambios cardiovasculares y de visión', 'Mareo y desorientación'],
    countermeasures: ['Ejercicio resistivo y aeróbico diario', 'Nutrición con calcio y vitamina D', 'Gravedad artificial cuando es posible']
  },
  {
    id: 'environment', name: 'Entornos cerrados hostiles',
    summary: 'Aire, agua, temperatura, ruido y microbios en un hábitat sellado.',
    effects: ['Infecciones y alergias', 'Problemas respiratorios', 'Fatiga por ruido o temperatura'],
    countermeasures: ['Monitoreo de aire, agua y temperatura', 'Limpieza y filtros HEPA', 'Control del ruido y de la iluminación']
  }
];

export const HAZARD_MAP = Object.fromEntries(HAZARDS.map((h) => [h.id, h]));

export const HAZARD_SOURCE_URL = 'https://www.nasa.gov/hrp/hazards/';
