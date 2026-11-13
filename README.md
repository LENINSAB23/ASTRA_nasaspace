# ASTRA · Astronaut Status & Risk Assistant

Software de monitoreo de salud para astronautas, desarrollado para el **NASA Space Apps Challenge 2026**
(desafío «Crear software de monitoreo de salud para astronautas en misiones espaciales»).

## Secciones

| Sección | Contenido |
|---|---|
| **Resumen** | Estado de la misión: tripulación, nave, radiación, acciones prioritarias y alertas. |
| **Nave** | Nave 3D interactiva. Cada subsistema pasa de azul translúcido a rojo según su daño; telemetría, fallos probables y reparación. Simula tormenta solar y micrometeorito. |
| **Traje** | Traje espacial 3D con la misma lógica, por astronauta. |
| **Tripulación** | Cuerpo humano 3D con ocho sistemas coloreados por riesgo, diez indicadores vitales, condiciones posibles, prevención y cuándo avisar al cirujano de vuelo. |
| **Autoevaluación** | Evaluación de síntomas con nivel de urgencia y pasos a seguir, y chequeo de bienestar psicológico. |
| **Radiación** | Dosis acumulada frente al límite de carrera de la NASA (600 mSv), tasa diaria, entornos y protocolo ante tormentas solares. |
| **Tendencias** | Evolución de todos los indicadores, descarga en CSV e informe para el cirujano de vuelo. |
| **Agenda** | Recordatorios periódicos, rutina diaria con puntos y clasificación de la tripulación. |
| **Guía** | Los cinco peligros de los vuelos espaciales, glosario de indicadores, fuentes y alcance. |

**Idioma:** el botón **ES | EN** de la barra superior cambia toda la interfaz entre español e inglés (incluidos los informes descargables). La elección se guarda en el navegador.

Los datos son **simulados**. Los rangos de referencia son generales y no sustituyen el criterio médico.

## Estructura

```
ASTRA/
├── index.html
├── staticwebapp.config.json   # Configuración para Azure Static Web Apps
├── css/styles.css
└── js/
    ├── main.js                # Arranque, secciones y navegación
    ├── config/                # Indicadores y entornos
    ├── i18n/                  # Idiomas: motor (i18n.js) y diccionario en inglés (en.js)
    ├── data/                  # Nave, traje, cuerpo, tripulación, síntomas, agenda, peligros y fuentes
    ├── core/                  # Estado, simulación, evaluación de salud y utilidades
    ├── three/                 # Escenario 3D y modelos holográficos
    ├── views/                 # Una vista por sección
    └── ui/                    # Componentes, gráficos, informes, avisos y encabezado
```

## Ejecutar en local

Requiere un servidor HTTP (los módulos ES no cargan con `file://`):

```bash
npx serve .
# o
python -m http.server 8080
```

## Despliegue en Azure

**Azure Static Web Apps** (recomendado): crea el recurso, apunta al repositorio y usa `app_location: "/"` sin
`api_location` ni paso de compilación.

**Máquina virtual:** copia el contenido de la carpeta al directorio web del servidor
(`/var/www/html` en Nginx/Apache, `C:\inetpub\wwwroot` en IIS) y abre el puerto 80 o 443 en el grupo de seguridad de red.

Three.js se carga desde jsDelivr y las fuentes desde Google Fonts, por lo que el navegador del usuario necesita Internet.

## Recursos utilizados

Fuentes consultadas para el diseño y el contenido de ASTRA (también se listan dentro de la app, en **Guía**).

| Recurso | Enlace | Cómo se usó |
|---|---|---|
| NASA HRP · 5 peligros de los vuelos espaciales | https://www.nasa.gov/hrp/hazards/ | Base de la sección Guía y de los peligros asociados a cada región del cuerpo, con sus contramedidas. |
| NASA HRP · Riesgos de los vuelos espaciales | https://www.nasa.gov/hrp/risks/ | Riesgos de salud por peligro (condiciones posibles de cada sistema). |
| NASA HRP · Investigación en curso | https://www.nasa.gov/hrp/ongoing-hrp-research/ | Contexto de las contramedidas y de la investigación actual. |
| NASA Human Research Roadmap | https://humanresearchroadmap.nasa.gov/ | Referencia de riesgos, brechas y evidencia. |
| NASA OCHMO · Radiation Protection Technical Brief | https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf | Límites de 600 mSv de carrera y 250 mSv por evento solar (sección Radiación). |
| NASA · Human Health and Performance (Moon to Mars) | https://ntrs.nasa.gov/citations/20230015521 | Resumen de NASA-STD-3001 y de los cinco peligros para Marte. |
| NASA · Contrarrestar la pérdida ósea y muscular | https://www.nasa.gov/missions/station/iss-research/counteracting-bone-and-muscle-loss-in-microgravity/ | Rutina de ejercicio de unas 2 h al día y pérdida ósea cercana al 1 % mensual. |
| NASA · Síndrome neuro-ocular (SANS) | https://ntrs.nasa.gov/citations/20220008786 | Apartado de ojos y sus contramedidas en estudio. |
| npj Microgravity · Red risks for a journey to the red planet | https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687 | Verificación de los cinco peligros y de los riesgos de mayor prioridad para Marte. |
| CSA · Monitoreo de la radiación para la salud de los astronautas | https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp | Enfoque de la sección Radiación (monitoreo continuo de la exposición). |
| CSA · Tecnología canadiense de radiación (CANS) | https://www.canada.ca/en/space-agency/news/2026/02/canadian-space-radiation-technology-to-support-health-and-safety.html | Dato de que los neutrones son cerca del 30 % de la radiación dentro de los vehículos. |
| CSA · ¿Por qué hacemos experimentos en el espacio? | https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp | Marco general: la investigación a bordo mejora la salud humana. |
| NASA OSDR · Open Science Data Repository | https://science.data.nasa.gov/blog/osdr-spotlight | Solo referencia: posible fuente de datos reales para un siguiente paso (no se usa en el código actual). |
| NASA Space Apps Challenge 2026 | https://www.spaceappschallenge.org/2026/ | Sitio oficial del desafío. |
