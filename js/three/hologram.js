import * as THREE from 'three';
import { riskColor } from '../core/status.js';

const WHITE = new THREE.Color('#ffffff');

/**
 * Modelo 3D holográfico: cada pieza pertenece a una "parte" identificada por `partId`.
 * El color pasa de azul translúcido a rojo según el riesgo de la parte.
 */
export class HoloModel {
  /**
   * @param {{ floorY?: number, camera?: { distance: number, height: number, targetY: number } }} options
   */
  constructor({ floorY = -3, camera = { distance: 14, height: 4, targetY: 0 } } = {}) {
    this.group = new THREE.Group();
    this.floorY = floorY;
    this.camera = camera;
    this.pickables = [];
    this.parts = new Map();
  }

  /** Agrega una pieza interactiva a una parte. */
  addPart(partId, geometry, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], wire = false } = {}) {
    const mesh = this.#createMesh(geometry, { pos, rot, scale, wire, opacity: 0.34, edgeOpacity: 0.45 });
    mesh.userData.partId = partId;
    this.pickables.push(mesh);
    if (!this.parts.has(partId)) this.parts.set(partId, { risk: 0, hover: false, selected: false, meshes: [] });
    this.parts.get(partId).meshes.push(mesh);
    this.#apply(partId);
    return mesh;
  }

  /** Agrega una pieza decorativa, no interactiva y casi transparente. */
  addGhost(geometry, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] } = {}) {
    const mesh = this.#createMesh(geometry, { pos, rot, scale, wire: false, opacity: 0.08, edgeOpacity: 0.12 });
    mesh.material.color.set('#7fb8ff');
    mesh.userData.ghost = true;
    mesh.children[0].material.color.set('#7fb8ff');
    return mesh;
  }

  #createMesh(geometry, { pos, rot, scale, wire, opacity, edgeOpacity }) {
    const material = new THREE.MeshPhongMaterial({
      transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, shininess: 60, specular: 0x335577
    });
    const mesh = new THREE.Mesh(geometry, material);
    const edgeGeometry = wire ? new THREE.WireframeGeometry(geometry) : new THREE.EdgesGeometry(geometry, 30);
    const edges = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ transparent: true, opacity: edgeOpacity }));
    mesh.add(edges);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    this.group.add(mesh);
    return mesh;
  }

  setRisk(partId, risk) {
    const part = this.parts.get(partId);
    if (!part || part.risk === risk) return;
    part.risk = risk;
    this.#apply(partId);
  }

  setHover(partId) {
    this.#toggle('hover', partId);
  }

  setSelected(partId) {
    this.#toggle('selected', partId);
  }

  #toggle(flag, partId) {
    this.parts.forEach((part, id) => {
      const value = id === partId;
      if (part[flag] !== value) {
        part[flag] = value;
        this.#apply(id);
      }
    });
  }

  #apply(partId) {
    const part = this.parts.get(partId);
    const color = riskColor(part.risk);
    const boost = (part.hover ? 0.4 : 0) + (part.selected ? 0.25 : 0);
    part.meshes.forEach((mesh) => {
      mesh.material.color.copy(color);
      mesh.material.emissive.copy(color).multiplyScalar(0.3 + boost);
      mesh.material.opacity = 0.3 + part.risk * 0.18 + boost * 0.5;
      const edges = mesh.children[0].material;
      edges.color.copy(color).lerp(WHITE, 0.35);
      edges.opacity = 0.4 + boost;
    });
  }

  /** Animación: las partes críticas parpadean. */
  tick(time) {
    this.parts.forEach((part) => {
      if (part.risk < 0.75) return;
      const pulse = 0.7 + 0.5 * Math.sin(time * 5);
      part.meshes.forEach((mesh) => { mesh.material.emissiveIntensity = pulse; });
    });
  }
}
