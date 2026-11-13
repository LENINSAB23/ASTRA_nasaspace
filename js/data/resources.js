import { localized } from '../i18n/i18n.js';

/**
 * Fuentes usadas para el diseño del software (se muestran en la Guía y en el README).
 * `use` indica en qué parte del proyecto se apoya cada una.
 */
export const RESOURCES = localized([
  { id: 'hrp-hazards', source: 'NASA', title: '5 peligros de los vuelos espaciales tripulados', url: 'https://www.nasa.gov/hrp/hazards/', note: 'Base de los peligros y las contramedidas.' },
  { id: 'hrp-risks', source: 'NASA', title: 'Riesgos de los vuelos espaciales tripulados', url: 'https://www.nasa.gov/hrp/risks/', note: 'Riesgos de salud asociados a cada peligro.' },
  { id: 'hrp-research', source: 'NASA', title: 'Investigación en curso del Human Research Program', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', note: 'Estudios actuales sobre salud humana en el espacio.' },
  { id: 'hrp-roadmap', source: 'NASA', title: 'Human Research Roadmap', url: 'https://humanresearchroadmap.nasa.gov/', note: 'Riesgos, brechas y evidencia; clasifica cada riesgo por probabilidad y consecuencia.' },
  { id: 'ochmo-radiation', source: 'NASA', title: 'Radiation Protection Technical Brief (OCHMO)', url: 'https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf', note: 'Límites de 600 mSv de carrera y 250 mSv por evento solar (NASA-STD-3001).' },
  { id: 'health-performance', source: 'NASA', title: 'Human Health and Performance: Keeping Astronauts Safe & Productive on a Mission to Mars', url: 'https://ntrs.nasa.gov/citations/20230015521', note: 'Resumen de NASA-STD-3001 y de los cinco peligros para una misión a Marte.' },
  { id: 'bone-muscle', source: 'NASA', title: 'Contrarrestar la pérdida ósea y muscular en microgravedad', url: 'https://www.nasa.gov/missions/station/iss-research/counteracting-bone-and-muscle-loss-in-microgravity/', note: 'Ejercicio de unas 2 horas diarias en la estación; base de la rutina de ejercicio de ASTRA.' },
  { id: 'sans', source: 'NASA', title: 'Síndrome neuro-ocular asociado a vuelos espaciales (SANS)', url: 'https://ntrs.nasa.gov/citations/20220008786', note: 'Cambios en la visión y contramedidas en estudio; respalda el apartado de ojos.' },
  { id: 'red-risks', source: 'npj Microgravity', title: 'Red risks for a journey to the red planet', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687', note: 'Riesgos de mayor prioridad de la NASA para Marte: radiación, SANS y salud conductual, entre otros.' },
  { id: 'osdr', source: 'NASA', title: 'Open Science Data Repository (OSDR)', url: 'https://science.data.nasa.gov/blog/osdr-spotlight', note: 'Datos abiertos de biología y salud espacial. Posible fuente de datos reales a futuro.' },
  { id: 'csa-radiation', source: 'CSA', title: 'Monitoreo de la radiación para la salud de los astronautas', url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp', note: 'Tecnologías canadienses para medir la exposición a radiación.' },
  { id: 'csa-cans', source: 'CSA', title: 'Tecnología canadiense de radiación para la salud y la seguridad', url: 'https://www.canada.ca/en/space-agency/news/2026/02/canadian-space-radiation-technology-to-support-health-and-safety.html', note: 'Espectrómetro de neutrones CANS; los neutrones son cerca del 30 % de la radiación dentro de los vehículos.' },
  { id: 'csa-experiments', source: 'CSA', title: '¿Por qué realizamos experimentos científicos en el espacio?', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', note: 'Cómo la investigación a bordo mejora la salud humana.' },
  { id: 'space-apps', source: 'NASA Space Apps', title: 'NASA Space Apps Challenge 2026', url: 'https://www.spaceappschallenge.org/2026/', note: 'Sitio oficial del desafío y de sus reglas.' }
]);
