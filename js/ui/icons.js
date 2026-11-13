const PATHS = {
  overview: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  ship: '<path d="M3 12h4l3-5h6l3 5-3 5h-6l-3-5"/><path d="M16 7V4M16 17v3"/>',
  suit: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-6a6 6 0 0 1 12 0v6M9 21v-4M15 21v-4"/>',
  crew: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.500-7 10-7 10z"/>',
  assessment: '<path d="M9 4h6l1 2h3v15H5V6h3z"/><path d="M9 13l2 2 4-4"/>',
  radiation: '<circle cx="12" cy="12" r="2"/><path d="M12 10V3a9 9 0 0 1 7.800 4.500L13.700 11M10.300 13l-6.100 3.500A9 9 0 0 1 3 12M13.700 13l6.100 3.500A9 9 0 0 1 12 21"/>',
  trends: '<path d="M3 20h18"/><path d="M5 16l4-5 4 3 6-8"/>',
  schedule: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 11h16"/>',
  guide: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'
};

/** Icono de línea de 20 px. */
export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] ?? ''}</svg>`;
}
