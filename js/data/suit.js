import { metric as m } from './metric.js';

/** Componentes del traje espacial. El daño inicial se combina con el desgaste de cada astronauta. */
export const SUIT_PARTS = [
  {
    id: 'helmet', name: 'Casco', initial: 0.05,
    desc: 'Mantiene la presión y la atmósfera respirable alrededor de la cabeza.',
    metrics: [m('Presión interna', 'psi', 4.3, -1.8, 2), m('Resistencia al impacto', '%', 100, -40, 0), m('Humedad', '%', 45, 30, 0)],
    faults: ['Microfisura en el sello del cuello', 'Humedad excesiva', 'Pérdida de presión'],
    repair: 'Revisar el anillo del cuello y comprobar la presión con la prueba de fugas.'
  },
  {
    id: 'visor', name: 'Visor dorado', initial: 0.1,
    desc: 'Filtra la radiación ultravioleta y el brillo solar.',
    metrics: [m('Filtro UV', '%', 99.9, -35, 1), m('Empañamiento', '%', 0, 70, 0), m('Rayones', '%', 0, 60, 0)],
    faults: ['Rayones por polvo', 'Empañamiento', 'Pérdida del recubrimiento dorado'],
    repair: 'Limpiar con paño sin abrasivos y activar la desempañante interna.'
  },
  {
    id: 'torso', name: 'Torso rígido (HUT)', initial: 0.08,
    desc: 'Estructura central que soporta la presión y conecta todos los componentes.',
    metrics: [m('Presión del traje', 'psi', 4.3, -1.5, 2), m('Temperatura interna', '°C', 22, 8, 1), m('Integridad del tejido', '%', 100, -45, 0)],
    faults: ['Desgaste de capas externas', 'Fuga en conectores', 'Sobrecalentamiento'],
    repair: 'Inspeccionar los conectores y regular la temperatura del traje de enfriamiento líquido.'
  },
  {
    id: 'plss', name: 'Mochila de soporte vital (PLSS)', initial: 0.15,
    desc: 'Entrega oxígeno, retira CO₂, enfría el traje y alimenta los equipos.',
    metrics: [m('Oxígeno restante', 'h', 8, -5, 1), m('CO₂ en el filtro', '%', 10, 60, 0), m('Autonomía eléctrica', '%', 100, -55, 0)],
    faults: ['Filtro de CO₂ saturado', 'Bajo caudal de oxígeno', 'Batería degradada'],
    repair: 'Regresar al hábitat, cambiar el filtro y recargar o sustituir la batería.'
  },
  {
    id: 'arms', name: 'Brazos y articulaciones', initial: 0.1,
    desc: 'Permiten mover los brazos con el traje presurizado.',
    metrics: [m('Movilidad', '%', 100, -45, 0), m('Fuga en juntas', 'psi/h', 0, 0.4, 2), m('Fricción', '%', 5, 45, 0)],
    faults: ['Rigidez en articulaciones', 'Fuga en sello de hombro', 'Desgaste de cojinetes'],
    repair: 'Lubricar las articulaciones y comprobar los sellos antes de la actividad extravehicular.'
  },
  {
    id: 'gloves', name: 'Guantes', initial: 0.25,
    desc: 'Protegen las manos y permiten manipular herramientas.',
    metrics: [m('Sensibilidad táctil', '%', 100, -50, 0), m('Temperatura de los dedos', '°C', 32, -14, 1), m('Desgaste de la palma', '%', 0, 70, 0)],
    faults: ['Cortes por polvo abrasivo', 'Pérdida de calor en los dedos', 'Desgaste de las uniones'],
    repair: 'Cambiar el guante dañado y revisar con inspección visual y táctil tras cada salida.'
  },
  {
    id: 'legs', name: 'Piernas', initial: 0.1,
    desc: 'Permiten caminar y aguantar la presión en las extremidades inferiores.',
    metrics: [m('Movilidad', '%', 100, -40, 0), m('Refrigeración líquida', 'L/min', 1.8, -0.9, 1), m('Presión', 'psi', 4.3, -1.3, 2)],
    faults: ['Obstrucción del enfriamiento', 'Rigidez en rodillas', 'Pérdida de presión'],
    repair: 'Purgar el circuito de enfriamiento y revisar las costuras de las rodillas.'
  },
  {
    id: 'boots', name: 'Botas', initial: 0.2,
    desc: 'Aíslan del suelo frío y dan agarre en superficies irregulares.',
    metrics: [m('Agarre de la suela', '%', 100, -55, 0), m('Aislamiento térmico', '%', 100, -45, 0), m('Polvo en las juntas', '%', 0, 70, 0)],
    faults: ['Desgaste de suela', 'Pérdida de aislamiento', 'Polvo atrapado en juntas'],
    repair: 'Limpiar el polvo con aspiradora electrostática y sustituir la suela si el desgaste es alto.'
  }
];
