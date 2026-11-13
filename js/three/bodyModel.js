import * as THREE from 'three';
import { HoloModel } from './hologram.js';

const { PI } = Math;

/** Cuerpo humano: silueta translúcida (no interactiva) y órganos/sistemas que se pueden seleccionar. */
export function buildBodyModel() {
  const model = new HoloModel({ floorY: 0, camera: { distance: 10.5, height: 4, targetY: 3.6 } });
  const sphere = (r, seg = 16) => new THREE.SphereGeometry(r, seg, 12);
  const capsule = (r, len) => new THREE.CapsuleGeometry(r, len, 4, 12);
  const cylinder = (r, h) => new THREE.CylinderGeometry(r, r, h, 8);

  // Silueta
  model.addGhost(sphere(0.55, 20), { pos: [0, 6.45, 0] });
  model.addGhost(cylinder(0.2, 0.4), { pos: [0, 5.85, 0] });
  model.addGhost(capsule(0.8, 1.6), { pos: [0, 4.6, 0], scale: [1, 1, 0.6] });
  model.addGhost(sphere(0.75), { pos: [0, 3.3, 0], scale: [1, 0.7, 0.7] });
  [-1, 1].forEach((side) => {
    model.addGhost(capsule(0.18, 2.8), { pos: [side * 1.2, 4.1, 0], rot: [0, 0, side * 0.08] });
    model.addGhost(capsule(0.3, 2.6), { pos: [side * 0.42, 1.7, 0] });
  });

  // Cerebro y ojos
  model.addPart('brain', sphere(0.38), { pos: [0, 6.55, -0.02], scale: [1, 0.8, 1.05] });
  [-0.2, 0.2].forEach((x) => model.addPart('eyes', sphere(0.1, 12), { pos: [x, 6.42, 0.45] }));

  // Corazón y pulmones
  model.addPart('heart', sphere(0.28, 14), { pos: [0.2, 4.85, 0.15], scale: [1, 1.2, 0.9] });
  [-0.58, 0.58].forEach((x) => model.addPart('lungs', capsule(0.25, 0.7), { pos: [x, 5.1, 0], scale: [1, 1, 0.8] }));

  // Metabolismo y digestión
  model.addPart('digestive', sphere(0.5), { pos: [0, 3.95, 0.1], scale: [1, 0.9, 0.7] });
  model.addPart('digestive', new THREE.TorusGeometry(0.35, 0.12, 8, 20), { pos: [0, 3.55, 0.1], rot: [PI / 2, 0, 0] });

  // Huesos: columna, pelvis y fémures
  model.addPart('bones', cylinder(0.07, 3.2), { pos: [0, 4.7, -0.35] });
  model.addPart('bones', new THREE.TorusGeometry(0.6, 0.1, 8, 20), { pos: [0, 3.3, 0], rot: [PI / 2, 0, 0] });
  [-0.42, 0.42].forEach((x) => model.addPart('bones', cylinder(0.1, 2.4), { pos: [x, 1.9, 0] }));

  // Músculos: brazos y muslos
  [-1, 1].forEach((side) => {
    model.addPart('muscle', capsule(0.12, 2.2), { pos: [side * 1.2, 4.1, 0], rot: [0, 0, side * 0.08] });
    model.addPart('muscle', capsule(0.2, 1.6), { pos: [side * 0.42, 1.7, 0.05] });
  });

  // Sistema inmune: timo, bazo y ganglios
  model.addPart('immune', sphere(0.14, 12), { pos: [0, 5.55, 0.2] });
  model.addPart('immune', capsule(0.1, 0.3), { pos: [-0.55, 4.2, 0.05], rot: [0, 0, 0.4] });
  [-0.25, 0.25].forEach((x) => model.addPart('immune', sphere(0.07, 10), { pos: [x, 5.9, 0.3] }));

  return model;
}
