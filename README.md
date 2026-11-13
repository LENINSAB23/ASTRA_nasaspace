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

## Fuentes

- [5 peligros de los vuelos espaciales tripulados · NASA HRP](https://www.nasa.gov/hrp/hazards/)
- [Riesgos de los vuelos espaciales tripulados · NASA HRP](https://www.nasa.gov/hrp/risks/)
- [Investigación en curso del HRP](https://www.nasa.gov/hrp/ongoing-hrp-research/)
- [Radiation Protection Technical Brief · NASA OCHMO (NASA-STD-3001)](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf)
- [Monitoreo de la radiación para la salud de los astronautas · CSA](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)
- [¿Por qué realizamos experimentos científicos en el espacio? · CSA](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)
