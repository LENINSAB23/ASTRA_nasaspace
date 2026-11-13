import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DRAG_THRESHOLD_PX = 5;

/**
 * Escenario 3D compartido: renderizador, cámara, luces, estrellas, interacción (hover/clic) y tooltip.
 * Las vistas le asignan un modelo con `setModel`.
 */
export class Stage {
  constructor(container) {
    this.container = container;
    this.model = null;
    this.hoveredId = null;
    this.handlers = { hover: null, select: null };
    this.down = null;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvas = this.renderer.domElement;
    container.prepend(this.canvas);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 40;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clock = new THREE.Clock();

    this.#createLights();
    this.#createStars();
    this.#createFloor();
    this.#createTooltip();
    this.#bindEvents();

    new ResizeObserver(() => this.#resize()).observe(container);
    this.#resize();
    this.renderer.setAnimationLoop(() => this.#frame());
  }

  /** Reemplaza el modelo mostrado y reposiciona la cámara. */
  setModel(model) {
    if (this.model) this.scene.remove(this.model.group);
    this.model = model;
    this.scene.add(model.group);
    const { distance, height, targetY } = model.camera;
    this.camera.position.set(distance * 0.75, height, distance * 0.65);
    this.controls.target.set(0, targetY, 0);
    this.floor.position.y = model.floorY;
    this.hoveredId = null;
    this.hideTooltip();
  }

  /** Registra los callbacks `hover(partId, x, y)` y `select(partId)`. */
  on(handlers) {
    this.handlers = { hover: null, select: null, ...handlers };
  }

  showTooltip(html, x, y) {
    this.tooltip.innerHTML = html;
    this.tooltip.hidden = false;
    const maxX = this.container.clientWidth - this.tooltip.offsetWidth - 8;
    const maxY = this.container.clientHeight - this.tooltip.offsetHeight - 8;
    this.tooltip.style.transform = `translate(${Math.min(x + 16, maxX)}px, ${Math.min(y + 16, maxY)}px)`;
  }

  hideTooltip() {
    this.tooltip.hidden = true;
  }

  /* ---------- Construcción ---------- */

  #createLights() {
    this.scene.add(new THREE.AmbientLight(0x88aaff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(6, 9, 7);
    const rim = new THREE.PointLight(0x9bb7ff, 0.9, 60);
    rim.position.set(-8, -3, -6);
    this.scene.add(key, rim);
  }

  #createStars() {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3().randomDirection().multiplyScalar(80 + Math.random() * 60);
      positions.set([dir.x, dir.y, dir.z], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xaab8cc, size: 1.2, sizeAttenuation: false, transparent: true, opacity: 0.45 })));
  }

  #createFloor() {
    this.floor = new THREE.GridHelper(40, 40, 0x2b3a4d, 0x1c2735);
    this.floor.material.transparent = true;
    this.floor.material.opacity = 0.5;
    this.scene.add(this.floor);
  }

  #createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.hidden = true;
    this.container.append(this.tooltip);
  }

  /* ---------- Eventos ---------- */

  #bindEvents() {
    this.canvas.addEventListener('pointermove', (e) => this.#onMove(e));
    this.canvas.addEventListener('pointerleave', () => this.#setHover(null, 0, 0));
    this.canvas.addEventListener('pointerdown', (e) => { this.down = { x: e.clientX, y: e.clientY }; });
    this.canvas.addEventListener('pointerup', (e) => this.#onUp(e));
  }

  #pick(e) {
    if (!this.model) return null;
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.model.pickables, false)[0];
    return hit ? hit.object.userData.partId : null;
  }

  #onMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.#setHover(this.#pick(e), e.clientX - rect.left, e.clientY - rect.top);
  }

  #setHover(partId, x, y) {
    this.hoveredId = partId;
    this.controls.autoRotate = partId === null;
    this.canvas.style.cursor = partId ? 'pointer' : 'grab';
    this.model?.setHover(partId);
    this.handlers.hover?.(partId, x, y);
    if (!partId) this.hideTooltip();
  }

  #onUp(e) {
    if (!this.down) return;
    const moved = Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y);
    this.down = null;
    if (moved > DRAG_THRESHOLD_PX) return;
    const partId = this.#pick(e);
    if (partId) this.handlers.select?.(partId);
  }

  /* ---------- Render ---------- */

  #resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  #frame() {
    this.controls.update();
    this.model?.tick(this.clock.getElapsedTime());
    this.renderer.render(this.scene, this.camera);
  }
}
