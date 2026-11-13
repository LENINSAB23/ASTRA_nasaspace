/** Cuestionario breve de bienestar: todas las respuestas van de 1 (nada) a 5 (totalmente). */
export const WELLBEING_QUESTIONS = [
  { id: 'mood', text: 'Me he sentido de buen ánimo' },
  { id: 'calm', text: 'Me he sentido tranquilo/a, sin ansiedad' },
  { id: 'focus', text: 'He podido concentrarme en mis tareas' },
  { id: 'crew', text: 'Me he sentido a gusto con la tripulación' },
  { id: 'drive', text: 'Tengo motivación para las tareas de la misión' },
  { id: 'rest', text: 'Siento que descanso bien' }
];

export const WELLBEING_TIPS = {
  mood: ['Planifica una actividad que disfrutes, aunque sea breve.', 'Mira por la ventana o escucha tu música favorita.'],
  calm: ['Prueba respiración lenta: 4 segundos al inhalar y 6 al exhalar, durante 5 minutos.', 'Habla de lo que te preocupa con alguien de confianza.'],
  focus: ['Divide las tareas en bloques de 25 minutos con pausas.', 'Revisa si has dormido lo suficiente y si el CO₂ de la cabina es normal.'],
  crew: ['Comparte una comida con la tripulación y habla de temas ajenos al trabajo.', 'Si hay un conflicto, plantéalo con calma o pide mediación a tierra.'],
  drive: ['Divide la misión en objetivos pequeños y celebra cada uno.', 'Pide a tierra mensajes o novedades que te motiven.'],
  rest: ['Mantén un horario fijo y luz tenue antes de dormir.', 'Reduce el ruido y las pantallas en la hora previa al descanso.']
};

export const WELLBEING_BANDS = [
  { min: 70, level: 0, label: 'Bienestar adecuado', advice: 'Sigue con tu rutina y repite el chequeo cada semana.' },
  { min: 50, level: 1, label: 'Conviene vigilar', advice: 'Aplica las recomendaciones de abajo y repite el chequeo en unos días.' },
  { min: 30, level: 2, label: 'Hablar con apoyo psicológico', advice: 'Programa una sesión con el equipo de apoyo psicológico en tierra.' },
  { min: 0, level: 3, label: 'Contactar a tierra hoy', advice: 'Informa hoy al cirujano de vuelo o al apoyo psicológico y habla con un compañero.' }
];
