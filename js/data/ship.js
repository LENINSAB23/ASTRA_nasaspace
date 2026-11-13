import { metric as m } from './metric.js';
import { localized } from '../i18n/i18n.js';

/**
 * Subsistemas de la nave. `initial` es el daño inicial (0 a 1).
 * Cada métrica se calcula como: nominal + delta × daño.
 */
export const SHIP_PARTS = localized([
  {
    id: 'habitat', name: 'Módulo habitable', initial: 0.12,
    desc: 'Cabina presurizada donde la tripulación vive y trabaja.',
    metrics: [m('Presión de cabina', 'kPa', 101.3, -18, 1), m('Fuga de aire', 'kPa/h', 0.01, 0.9, 2), m('Temperatura interior', '°C', 22, 6, 1)],
    faults: ['Microfugas en las uniones del casco', 'Condensación y moho en los paneles', 'Despresurización lenta'],
    repair: 'Localizar la fuga con un sensor ultrasónico y sellar con parche. Aislar el módulo si la presión sigue bajando.'
  },
  {
    id: 'ring', name: 'Anillo de gravedad artificial', initial: 0.28,
    desc: 'Anillo giratorio que genera gravedad parcial para frenar la pérdida ósea y muscular.',
    metrics: [m('Gravedad en el anillo', 'g', 0.5, -0.2, 2), m('Rotación', 'rpm', 4, -1.5, 1), m('Vibración', 'mm/s', 0.2, 2.5, 2)],
    faults: ['Desequilibrio del rotor', 'Desgaste de rodamientos', 'Pérdida de sellado del acople'],
    repair: 'Reducir la rotación, rebalancear la carga y revisar los rodamientos. Ejercitar en el gimnasio mientras tanto.'
  },
  {
    id: 'engines', name: 'Propulsión', initial: 0.06,
    desc: 'Motores principales para maniobras y corrección de trayectoria.',
    metrics: [m('Empuje', 'kN', 120, -45, 0), m('Temperatura de tobera', '°C', 850, 300, 0), m('Presión de cámara', 'bar', 60, -20, 0)],
    faults: ['Erosión de la tobera', 'Fallo en la válvula de inyección', 'Pérdida de empuje'],
    repair: 'Apagar el motor afectado, inspeccionar la tobera y recalibrar la inyección antes de la próxima maniobra.'
  },
  {
    id: 'tanks', name: 'Tanques de combustible', initial: 0.18,
    desc: 'Almacenan el propelente presurizado.',
    metrics: [m('Presión de tanque', 'bar', 18, -6, 1), m('Fuga estimada', 'L/día', 0, 25, 1), m('Temperatura del propelente', '°C', -5, 20, 1)],
    faults: ['Microfuga en válvula', 'Pérdida de presurización', 'Sobrecalentamiento del propelente'],
    repair: 'Aislar el tanque, equilibrar la presión con el sistema de helio y revisar las válvulas.'
  },
  {
    id: 'solar', name: 'Paneles solares', initial: 0.34,
    desc: 'Generan la electricidad de la nave.',
    metrics: [m('Potencia generada', 'kW', 42, -24, 1), m('Eficiencia de celdas', '%', 32, -14, 1), m('Error de alineación', '°', 0.5, 6, 1)],
    faults: ['Celdas dañadas por micrometeoritos', 'Error del mecanismo de orientación', 'Degradación por radiación'],
    repair: 'Reorientar los paneles, redistribuir la carga eléctrica y planificar una reparación en actividad extravehicular.'
  },
  {
    id: 'radiators', name: 'Radiadores térmicos', initial: 0.15,
    desc: 'Expulsan al espacio el calor que genera la nave.',
    metrics: [m('Rechazo de calor', 'kW', 30, -16, 1), m('Temperatura del refrigerante', '°C', 4, 22, 1), m('Flujo de la bomba', 'L/min', 12, -6, 1)],
    faults: ['Fuga de refrigerante', 'Bomba con bajo caudal', 'Panel dañado por impacto'],
    repair: 'Cambiar al circuito redundante y reducir la carga térmica de los equipos no críticos.'
  },
  {
    id: 'shield', name: 'Refugio y blindaje de radiación', initial: 0.4,
    desc: 'Zona blindada donde la tripulación se protege de las tormentas solares.',
    metrics: [m('Atenuación de radiación', '%', 65, -35, 0), m('Dosis dentro del refugio', 'mSv/día', 0.3, 1.6, 2), m('Densidad del blindaje', 'g/cm²', 20, -8, 1)],
    faults: ['Pérdida de masa de blindaje', 'Fallo del monitor de partículas', 'Grietas en el revestimiento'],
    repair: 'Reubicar cargas de agua y alimentos alrededor del refugio para reforzar el blindaje y revisar los monitores.'
  },
  {
    id: 'dock', name: 'Puerto de acoplamiento', initial: 0.1,
    desc: 'Permite el acople con módulos y naves de transporte.',
    metrics: [m('Presión del sello', 'kPa', 101.3, -30, 1), m('Desalineación', 'mm', 0.5, 12, 1), m('Seguros engranados', '/4', 4, -2, 0)],
    faults: ['Desgaste del sello', 'Desalineación del anillo', 'Atasco de los seguros'],
    repair: 'Verificar la estanqueidad con una prueba de presión antes de cualquier acople.'
  },
  {
    id: 'comms', name: 'Comunicaciones', initial: 0.22,
    desc: 'Antena de alta ganancia para el enlace con la Tierra. El retardo hacia Marte llega a unos 22 minutos.',
    metrics: [m('Velocidad del enlace', 'Mbps', 20, -16, 1), m('Potencia de señal', 'dBm', -90, -12, 0), m('Tasa de error', '%', 0.01, 4, 2)],
    faults: ['Desapuntamiento de la antena', 'Interferencia solar', 'Fallo del amplificador'],
    repair: 'Reapuntar la antena, cambiar a la antena de baja ganancia y enviar mensajes críticos con prioridad.'
  },
  {
    id: 'lifesupport', name: 'Soporte vital (ECLSS)', initial: 0.2,
    desc: 'Controla el oxígeno, el CO₂, la humedad y el agua de la cabina.',
    metrics: [m('Oxígeno', '%', 21, -4, 1), m('CO₂', 'ppm', 2500, 4500, 0), m('Reciclaje de agua', '%', 93, -30, 0)],
    faults: ['Saturación del filtro de CO₂', 'Fallo del generador de oxígeno', 'Contaminación del agua reciclada'],
    repair: 'Cambiar los lechos de absorción de CO₂ y activar el generador de oxígeno de respaldo.'
  }
]);
