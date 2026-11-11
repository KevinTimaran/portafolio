import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createBook, type Book } from './book.js';
import { createEnvironment, type Environment } from './environment.js';
import { createHands, type Hands } from './hands.js';
import { getAmbience } from './ambience';

type State = 'loading' | 'idle' | 'reaching' | 'opening' | 'reading' | 'closing' | 'fallback';
type Target = 'book' | 'radio' | 'phone';
export type AnnounceKey = 'ready' | 'grabBook' | 'grabPhone' | 'openPhone' | 'openBook' | 'backToFire' | 'bookRests' | 'radioOn' | 'radioOff';

export interface ExperienceOptions {
  canvas: HTMLCanvasElement;
  /** Contenedor del canvas: define el tamaño del render. */
  root: HTMLElement;
  hotspots: Record<Target, HTMLElement>;
  onStatus(status: 'loading' | 'ready' | 'fallback'): void;
  /** Clave del mensaje para lectores de pantalla; el texto se traduce en la interfaz. */
  onAnnounce(message: AnnounceKey): void;
  /** El libro (o el móvil) quedó abierto: hay que mostrar el portafolio. */
  onOpen(mode: 'book' | 'phone'): void;
}

export interface ExperienceHandle {
  /** Toma el libro y lo abre. */
  openBook(): void;
  /** Toma el móvil y abre el portafolio en su pantalla. */
  openPhone(): void;
  /** Cierra el libro y vuelve al paisaje. */
  close(): void;
  dispose(): void;
}

export function createExperience(options: ExperienceOptions): ExperienceHandle {
  const { canvas, root, hotspots, onStatus, onAnnounce, onOpen } = options;
  const sound = getAmbience();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const width = () => root.clientWidth || window.innerWidth;
  const height = () => root.clientHeight || window.innerHeight;
  const narrow = () => width() < 760;
  const duration = (seconds: number) => (reducedMotion.matches ? 0 : seconds);
  gsap.ticker.lagSmoothing(0);

  let state: State = 'loading';
  let disposed = false;
  let frameId = 0;
  let lastTime = 0;
  let elapsed = 0;
  let lastFrameStamp = 0;
  let hoverTarget: Target | null = null;
  let timeline: gsap.core.Timeline | null = null;
  let readingMode: 'book' | 'phone' = 'book';
  let renderer: THREE.WebGLRenderer | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let composer: EffectComposer | null = null;
  let bloomPass: UnrealBloomPass | null = null;
  let book: Book | null = null;
  let hands: Hands | null = null;
  let environment: Environment | null = null;
  let pointerDown: { x: number; y: number; px: number; py: number } | null = null;

  const perf = { time: 0, frames: 0, phase: 'warmup' as 'warmup' | 'trial' | 'done' };
  const pointer = new THREE.Vector2();
  const gaze = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const WORLD_UP = new THREE.Vector3(0, 1, 0);
  const sightDirection = new THREE.Vector3();
  const sightRight = new THREE.Vector3();
  const sightTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3(0, 0.86, 0);
  const baseCamera = new THREE.Vector3(0, 1.35, 3.5);
  const heldPosition = new THREE.Vector3(-0.5, 1.29, 2.0);
  const restPosition = new THREE.Vector3(-1.15, 0.644, 2.3);
  const restRotation = new THREE.Euler(-Math.PI / 2, 0, 0.18);
  const pose = { reach: 0, open: 0 };

  function setState(next: State) {
    state = next;
    root.dataset.sceneState = next;
    const showHotspots = next === 'idle';
    for (const el of Object.values(hotspots)) if (!showHotspots) el.style.opacity = '0';
    if (next !== 'idle') canvas.style.cursor = 'default';
  }

  function updateResponsivePositions() {
    if (narrow()) {
      baseCamera.set(0, 1.5, 4.3);
      heldPosition.set(-0.35, 1.4, 2.9);
    } else {
      baseCamera.set(0, 1.35, 3.5);
      heldPosition.set(-0.5, 1.29, 2.0);
    }
  }

  const idleLook = () => lookTarget.set(narrow() ? -0.1 : 0, 0.86, 0);

  function enterReading(mode: 'book' | 'phone') {
    readingMode = mode;
    setState('reading');
    sound.setReading(true);
    onOpen(mode);
    onAnnounce(mode === 'phone' ? 'openPhone' : 'openBook');
  }

  /** Cierra el portafolio: la cámara regresa al fuego y el libro vuelve al tocón. */
  function close() {
    if (state !== 'reading' || !book || !hands || !camera) return;
    setState('closing');
    sound.setReading(false);
    if (readingMode === 'phone') {
      const d = duration(1);
      timeline = gsap.timeline({ onComplete() { setState('idle'); onAnnounce('backToFire'); } });
      timeline
        .to(camera.position, { x: baseCamera.x, y: baseCamera.y, z: baseCamera.z, duration: 1.3 * d, ease: 'power3.inOut' }, 0)
        .to(lookTarget, { x: narrow() ? -0.1 : 0, y: 0.86, z: 0, duration: 1.3 * d, ease: 'power3.inOut' }, 0);
      return;
    }
    sound.open();
    const d = duration(1);
    const b = book;
    const h = hands;
    timeline = gsap.timeline({ onComplete() { h.group.visible = false; setState('idle'); onAnnounce('bookRests'); } });
    timeline
      .to(camera.position, { x: baseCamera.x, y: baseCamera.y, z: baseCamera.z, duration: 1.3 * d, ease: 'power3.inOut' }, 0)
      .to(lookTarget, { x: heldPosition.x, y: heldPosition.y, z: 0, duration: 1.3 * d, ease: 'power3.inOut' }, 0)
      .to(pose, { open: 0, duration: 1.3 * d, ease: 'power2.inOut', onUpdate() { b.setOpen(pose.open); h.setOpen(pose.open); } }, 0.4 * d)
      .to(b.group.position, { x: restPosition.x, y: restPosition.y + 0.15, z: restPosition.z, duration: 1.3 * d, ease: 'power2.inOut' }, 1.6 * d)
      .to(b.group.rotation, { x: restRotation.x, y: restRotation.y, z: restRotation.z, duration: 1.3 * d, ease: 'power2.inOut' }, 1.6 * d)
      .to(b.group.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1.2 * d, ease: 'power2.inOut' }, 1.6 * d)
      .to(b.group.position, { y: restPosition.y, duration: 0.45 * d, ease: 'sine.out' }, 2.85 * d)
      .call(() => sound.putDown(), [], 3.2 * d)
      .to(pose, { reach: 0, duration: 0.65 * d, onUpdate: () => h.setReach(pose.reach), ease: 'power2.inOut' }, 3.2 * d)
      .to(lookTarget, { x: narrow() ? -0.1 : 0, y: 0.86, z: 0, duration: 1.1 * d, ease: 'power2.inOut' }, 2.8 * d);
  }

  function grabBook() {
    if (state !== 'idle' || !book || !hands || !camera) return;
    const b = book;
    const h = hands;
    const cam = camera;
    setState('reaching');
    onAnnounce('grabBook');
    h.group.visible = true;
    const d = duration(0.62);
    const o = duration(1);
    timeline = gsap.timeline();
    timeline
      .to(gaze, { x: 0, y: 0, duration: 0.7 * d, ease: 'power2.inOut' }, 0)
      .to(lookTarget, { x: heldPosition.x, y: heldPosition.y, z: 0, duration: 0.9 * d, ease: 'power2.inOut' }, 0)
      .to(pose, { reach: 1, duration: 0.8 * d, ease: 'power2.inOut', onUpdate: () => h.setReach(pose.reach) }, 0.05 * d)
      .call(() => sound.grab(), [], 0.7 * d)
      .to(b.group.position, { x: restPosition.x - 0.12, y: restPosition.y + 0.19, z: restPosition.z + 0.07, duration: 0.55 * d, ease: 'power2.in' }, 0.72 * d)
      .to(b.group.position, { x: heldPosition.x, y: heldPosition.y + 0.035, z: heldPosition.z, duration: 1.3 * d, ease: 'power3.inOut' }, 1.1 * d)
      .to(b.group.rotation, { x: 0.025, y: -0.11, z: -0.035, duration: 1.6 * d, ease: 'power3.inOut' }, 0.82 * d)
      .to(b.group.scale, { x: 0.46, y: 0.46, z: 0.46, duration: 1.1 * d, ease: 'power2.inOut' }, 1.1 * d)
      .to(b.group.position, { y: heldPosition.y, duration: 0.35 * d, ease: 'sine.out' }, 2.4 * d)
      // Abrir el libro
      .call(() => { setState('opening'); sound.open(); }, [], 2.45 * d)
      .to(b.group.rotation, { x: 0, y: 0, z: 0, duration: 0.8 * o, ease: 'sine.inOut' }, 2.45 * d)
      .to(pose, { open: 1, duration: 2.1 * o, ease: 'power2.inOut', onUpdate() { b.setOpen(pose.open); h.setOpen(pose.open); } }, 2.45 * d + 0.3 * o)
      .to(lookTarget, { x: heldPosition.x + 0.008, y: heldPosition.y, z: heldPosition.z, duration: 1.4 * o, ease: 'power2.inOut' }, 2.45 * d + 1.7 * o)
      .to(cam.position, { x: heldPosition.x + 0.008, y: heldPosition.y, z: heldPosition.z + 0.24, duration: 1.9 * o, ease: 'power3.inOut' }, 2.45 * d + 1.75 * o)
      .call(() => enterReading('book'), [], 2.45 * d + 3.3 * o);
  }

  function openPhone() {
    if (state !== 'idle' || !environment || !camera) return;
    setState('opening');
    onAnnounce('grabPhone');
    const target = environment.props.phonePoint();
    const d = duration(1);
    timeline = gsap.timeline({ onComplete() { enterReading('phone'); } });
    timeline
      .to(gaze, { x: 0, y: 0, duration: 0.5 * d, ease: 'power2.inOut' }, 0)
      .to(lookTarget, { x: target.x, y: target.y, z: target.z, duration: 1.2 * d, ease: 'power2.inOut' }, 0)
      .to(camera.position, { x: target.x - 0.14, y: target.y + 0.08, z: target.z + 1.05, duration: 1.4 * d, ease: 'power3.inOut' }, 0);
  }

  async function toggleRadio() {
    if (!environment) return;
    const on = await sound.toggleJazz();
    environment.props.setRadioOn(on);
    onAnnounce(on ? 'radioOn' : 'radioOff');
  }

  function resize() {
    if (!renderer || !camera) return;
    const w = width();
    const h = height();
    camera.aspect = w / h;
    camera.fov = narrow() ? 54 : 43;
    if (w > h * 2) camera.fov = 49;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    updateResponsivePositions();
    if (state === 'idle' || state === 'loading') {
      camera.position.copy(baseCamera);
      idleLook();
    }
  }

  function ndc(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    return new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, 1 - ((event.clientY - rect.top) / rect.height) * 2);
  }

  function pickTarget(event: PointerEvent): Target | null {
    if (!camera || !book || !environment) return null;
    raycaster.setFromCamera(ndc(event), camera);
    const candidates: [Target, THREE.Object3D][] = [
      ['book', book.group],
      ['radio', environment.props.radio],
      ['phone', environment.props.phone],
    ];
    let best: Target | null = null;
    let bestDistance = Infinity;
    for (const [name, object] of candidates) {
      const hit = raycaster.intersectObject(object, true)[0];
      if (hit && hit.distance < bestDistance) {
        best = name;
        bestDistance = hit.distance;
      }
    }
    return best;
  }

  function activate(target: Target | null) {
    if (target === 'book') grabBook();
    else if (target === 'radio') void toggleRadio();
    else if (target === 'phone') openPhone();
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      if (!pointerDown) return;
      pointer.set(
        // En táctil la mirada se queda donde la dejaste, para poder tocar el libro o el móvil.
        // Deslizar hacia la izquierda gira hacia la derecha, como al arrastrar el paisaje.
        THREE.MathUtils.clamp(pointerDown.px - (event.clientX - pointerDown.x) / (width() * 1.3), -1, 1),
        THREE.MathUtils.clamp(pointerDown.py - (event.clientY - pointerDown.y) / (height() * 0.5), -1, 1),
      );
    } else {
      const p = ndc(event);
      pointer.set(p.x, -p.y);
    }
    if (state === 'idle' && book) {
      hoverTarget = pickTarget(event);
      canvas.style.cursor = hoverTarget ? 'pointer' : 'grab';
    }
  };
  const onPointerDown = (event: PointerEvent) => { pointerDown = { x: event.clientX, y: event.clientY, px: pointer.x, py: pointer.y }; };
  const onPointerUp = (event: PointerEvent) => {
    const moved = pointerDown && Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 12;
    pointerDown = null;
    if (moved || state !== 'idle') return;
    activate(pickTarget(event));
  };
  const onPointerCancel = () => { pointerDown = null; };
  const onPointerLeave = (event: PointerEvent) => { if (event.pointerType !== 'touch') pointer.set(0, 0); };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      grabBook();
    }
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    timeline?.kill();
    cancelAnimationFrame(frameId);
    setState('fallback');
    onStatus('fallback');
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('webglcontextlost', onContextLost);
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(root);

  const projected = new THREE.Vector3();
  function placeHotspot(target: Target, point: THREE.Vector3, skyView: boolean) {
    if (!camera) return;
    point.project(camera);
    const el = hotspots[target];
    el.style.transform = `translate(${(point.x * 0.5 + 0.5) * width() - 25}px,${(-point.y * 0.5 + 0.5) * height() - 22}px)`;
    el.style.opacity = skyView || Math.abs(point.x) > 0.94 || Math.abs(point.y) > 0.94 ? '0' : hoverTarget === target ? '1' : '.7';
  }

  function animate(now: number) {
    if (disposed) return;
    frameId = requestAnimationFrame(animate);
    const delta = Math.min((now - lastTime) / 1000 || 0.016, 0.05);
    lastTime = now;
    if (document.hidden || state === 'reading' || state === 'fallback' || !camera || !book || !hands || !environment || !composer) {
      lastFrameStamp = 0;
      return;
    }
    elapsed += delta;
    // El bloom empieza apagado (algunas GPU integradas sufren). Tras ~20 cuadros sanos se enciende;
    // si después los cuadros se atascan, se apaga para siempre.
    if (bloomPass && perf.phase !== 'done') {
      const gap = lastFrameStamp ? (now - lastFrameStamp) / 1000 : 0;
      if (gap) perf.frames++;
      if (perf.phase === 'warmup' && perf.frames >= 20) {
        if (perf.time / perf.frames < 0.03) {
          bloomPass.enabled = true;
          perf.phase = 'trial';
          perf.frames = 0;
          perf.time = 0;
        } else perf.phase = 'done';
      } else if (perf.phase === 'warmup') perf.time += gap;
      else if (perf.phase === 'trial') {
        if (gap > 0.12) {
          bloomPass.enabled = false;
          perf.phase = 'done';
        } else if (perf.frames >= 12) perf.phase = 'done';
      }
    }
    lastFrameStamp = now;
    environment.update(elapsed, delta);
    book.update(elapsed, delta);
    hands.update(elapsed);
    if (state === 'idle') {
      gaze.lerp(pointer, 1 - Math.exp(-delta * 2.2));
      // Mover el ratón (o arrastrar) hacia arriba inclina la mirada hacia el cielo y la aurora.
      const still = reducedMotion.matches;
      const lookUp = still ? 0 : Math.pow(Math.max(0, -gaze.y), 1.4) * 1.15;
      const lookDown = still ? 0 : Math.max(0, gaze.y) * 0.2;
      // En vertical el campo de visión horizontal es estrecho: se permite girar más para alcanzar el libro y el móvil.
      const yaw = still ? 0 : -gaze.x * (narrow() ? 1.6 : 0.8);
      sightDirection.copy(lookTarget).sub(camera.position);
      sightDirection.y += still ? 0 : Math.sin(elapsed * 0.65) * 0.009;
      sightDirection.applyAxisAngle(WORLD_UP, yaw);
      sightRight.crossVectors(sightDirection, WORLD_UP).normalize();
      sightDirection.applyAxisAngle(sightRight, lookUp - lookDown);
      camera.lookAt(sightTarget.copy(camera.position).add(sightDirection));
      const skyView = lookUp > 0.38;
      if (skyView !== root.classList.contains('is-looking-up')) root.classList.toggle('is-looking-up', skyView);
      placeHotspot('book', projected.copy(book.group.position).add(new THREE.Vector3(0, 0.1, 0)), skyView);
      placeHotspot('radio', environment.props.radioPoint(), skyView);
      placeHotspot('phone', environment.props.phonePoint(), skyView);
    } else {
      root.classList.remove('is-looking-up');
      camera.lookAt(lookTarget);
    }
    composer.render();
  }

  async function init() {
    setState('loading');
    onStatus('loading');
    try {
      const r = (renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false }));
      r.setPixelRatio(Math.min(window.devicePixelRatio, narrow() ? 1.4 : 1.7));
      r.shadowMap.enabled = true;
      r.shadowMap.type = THREE.PCFSoftShadowMap;
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.15;
      r.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#0c0c08');
      scene.fog = new THREE.FogExp2('#11110c', 0.035);
      const cam = (camera = new THREE.PerspectiveCamera(43, width() / height(), 0.025, 110));
      updateResponsivePositions();
      cam.position.copy(baseCamera);
      environment = createEnvironment({ renderer: r, quality: narrow() ? 'low' : 'high' });
      scene.add(environment.group);
      // Una luz cálida y amplia resalta el cuero repujado sin brillo frío de estudio.
      const bookFill = new THREE.SpotLight('#f6d5a0', 18, 8, 0.75, 1, 1.5);
      bookFill.position.set(1.5, 3.8, 5.4);
      bookFill.target.position.set(0.3, 1.1, 2.6);
      scene.add(bookFill, bookFill.target);
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]);
      if (disposed) return;
      const b = await createBook({ renderer: r });
      if (disposed) {
        b.dispose();
        return;
      }
      book = b;
      b.group.position.copy(restPosition);
      b.group.rotation.copy(restRotation);
      b.group.scale.setScalar(0.4);
      scene.add(b.group);
      hands = createHands();
      hands.group.visible = false;
      hands.setReach(0);
      b.group.add(hands.group);
      composer = new EffectComposer(r);
      composer.addPass(new RenderPass(scene, cam));
      bloomPass = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.45, 0.65, 1.8);
      bloomPass.enabled = false;
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
      resize();
      await r.compileAsync(scene, cam);
      if (disposed) return;
      setState('idle');
      onStatus('ready');
      onAnnounce('ready');
      frameId = requestAnimationFrame(animate);
    } catch (error) {
      if (disposed) return;
      console.error('No se pudo iniciar la escena:', error);
      setState('fallback');
      onStatus('fallback');
    }
  }

  void init();

  return {
    openBook: grabBook,
    openPhone,
    close,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      timeline?.kill();
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      environment?.dispose();
      hands?.dispose();
      book?.dispose();
      composer?.dispose();
      renderer?.dispose();
    },
  };
}
