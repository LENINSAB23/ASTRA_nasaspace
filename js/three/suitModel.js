import * as THREE from 'three';
import { HoloModel } from './hologram.js';

const { PI } = Math;

/** Traje espacial construido con primitivas; cada pieza pertenece a un componente de `data/suit.js`. */
export function buildSuitModel() {
  const model = new HoloModel({ floorY: -0.02, camera: { distance: 8.5, height: 2.8, targetY: 2.1 } });
  const cylinder = (rTop, rBottom, h, seg = 16) => new THREE.CylinderGeometry(rTop, rBottom, h, seg);

  // Botas y piernas (simétricas)
  [-0.38, 0.38].forEach((x) => {
    model.addPart('boots', new THREE.BoxGeometry(0.62, 0.35, 0.95), { pos: [x, 0.18, 0.12] });
    model.addPart('legs', cylinder(0.3, 0.26, 1.3, 14), { pos: [x, 1, 0] });
  });

  // Torso rígido y mochila de soporte vital
  model.addPart('torso', cylinder(0.78, 0.7, 1.5, 18), { pos: [0, 2.4, 0] });
  model.addPart('plss', new THREE.BoxGeometry(1.1, 1.5, 0.55), { pos: [0, 2.45, -0.85] });

  // Brazos y guantes
  [-1, 1].forEach((side) => {
    model.addPart('arms', cylinder(0.22, 0.2, 1.3, 12), { pos: [side * 1.05, 2.55, 0], rot: [0, 0, side * 0.12] });
    model.addPart('gloves', new THREE.SphereGeometry(0.3, 12, 10), { pos: [side * 1.18, 1.7, 0.05] });
  });

  // Casco y visor frontal
  model.addPart('helmet', new THREE.SphereGeometry(0.62, 18, 14), { pos: [0, 3.75, 0] });
  model.addPart('visor', new THREE.SphereGeometry(0.66, 18, 12, PI / 2 - 0.9, 1.8, PI * 0.25, PI * 0.45), { pos: [0, 3.75, 0] });

  return model;
}
