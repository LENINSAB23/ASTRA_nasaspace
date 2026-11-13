import * as THREE from 'three';
import { HoloModel } from './hologram.js';

const { PI } = Math;
const TAU = PI * 2;

/** Nave tipo estación rotatoria: eje largo sobre X. Cada pieza pertenece a un subsistema de `data/ship.js`. */
export function buildShipModel() {
  const model = new HoloModel({ floorY: -5, camera: { distance: 16, height: 5, targetY: 0 } });
  const cylinder = (rTop, rBottom, h, seg = 20, open = false) => new THREE.CylinderGeometry(rTop, rBottom, h, seg, 1, open);
  const alongX = [0, 0, PI / 2];

  // Módulo habitable: casco y casquetes
  model.addPart('habitat', cylinder(1.1, 1.1, 5), { rot: alongX });
  model.addPart('habitat', new THREE.SphereGeometry(1.1, 20, 10, 0, TAU, 0, PI / 2), { pos: [2.5, 0, 0], rot: [0, 0, -PI / 2] });
  model.addPart('habitat', new THREE.SphereGeometry(1.1, 20, 10, 0, TAU, 0, PI / 2), { pos: [-2.5, 0, 0], rot: [0, 0, PI / 2] });

  // Anillo de gravedad artificial con radios
  model.addPart('ring', new THREE.TorusGeometry(2.7, 0.3, 8, 48), { pos: [1, 0, 0], rot: [0, PI / 2, 0] });
  for (let i = 0; i < 4; i++) {
    const a = (i * PI) / 2;
    model.addPart('ring', cylinder(0.06, 0.06, 1.5, 8), { pos: [1, Math.cos(a) * 1.8, Math.sin(a) * 1.8], rot: [a, 0, 0] });
  }

  // Propulsión
  model.addPart('engines', cylinder(0.5, 0.5, 0.6, 14), { pos: [-3.9, 0, 0], rot: alongX });
  model.addPart('engines', new THREE.ConeGeometry(0.9, 1.6, 16, 1, true), { pos: [-4.6, 0, 0], rot: [0, 0, -PI / 2] });

  // Tanques de combustible
  [1.7, -1.7].forEach((y) => model.addPart('tanks', new THREE.CapsuleGeometry(0.45, 1.6, 4, 12), { pos: [-1.8, y, 0], rot: alongX }));

  // Paneles solares: brazo y dos alas
  model.addPart('solar', cylinder(0.05, 0.05, 8, 8), { pos: [-0.9, 0, 0], rot: [PI / 2, 0, 0] });
  [4.7, -4.7].forEach((z) => model.addPart('solar', new THREE.BoxGeometry(1.8, 0.05, 2.8, 4, 1, 5), { pos: [-0.9, 0, z], wire: true }));

  // Radiadores térmicos
  [1.5, -1.5].forEach((y) => model.addPart('radiators', new THREE.BoxGeometry(1, 0.04, 2.4, 3, 1, 5), { pos: [-0.4, y, 0], wire: true }));

  // Refugio y blindaje contra radiación
  model.addPart('shield', cylinder(1.45, 1.45, 1.2, 24, true), { pos: [1.9, 0, 0], rot: alongX });

  // Puerto de acoplamiento
  model.addPart('dock', cylinder(0.55, 0.75, 1, 16), { pos: [4.1, 0, 0], rot: alongX });
  model.addPart('dock', new THREE.TorusGeometry(0.55, 0.08, 8, 20), { pos: [4.6, 0, 0], rot: [0, PI / 2, 0] });

  // Comunicaciones: mástil y antena parabólica
  model.addPart('comms', cylinder(0.05, 0.05, 1.3, 8), { pos: [3, 1.5, 0] });
  model.addPart('comms', new THREE.SphereGeometry(0.7, 16, 8, 0, TAU, 0, PI / 2.5), { pos: [3, 2.2, 0], rot: [0, 0, -PI / 4] });

  // Soporte vital (dentro del casco, visible por la transparencia)
  model.addPart('lifesupport', new THREE.SphereGeometry(0.5, 14, 10), { pos: [-1, 0, 0] });
  model.addPart('lifesupport', new THREE.BoxGeometry(0.6, 0.6, 0.6), { pos: [0.1, -0.2, 0] });

  return model;
}
