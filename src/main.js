import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createBook } from './book.js';
import { createEnvironment } from './environment.js';
import { createHands } from './hands.js';
import { createReader } from './reader.js';
import { createAmbience } from './audio.js';
import './style.css';

const $ = selector => document.querySelector(selector);
const canvas = $('#world');
const primary = $('#primary-action');
const secondary = $('#secondary-action');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow = () => window.innerWidth < 760;
const sound = createAmbience();
let state = 'loading';
let sceneAvailability = 'loading';
let pendingViewportSync = false;
let reader;
let scene, camera, renderer, composer, book, hands, environment, timeline;
let frameId = 0, lastTime = 0, elapsed = 0, disposed = false;
let isHovering = false;
const pointer = new THREE.Vector2();
const gaze = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const lookTarget = new THREE.Vector3(0, .86, 0);
const baseCamera = new THREE.Vector3(0, 1.45, 4.6);
const heldPosition = new THREE.Vector3(0, 1.29, 3.02);
const restPosition = new THREE.Vector3(1.25, .644, 2.3);
const restRotation = new THREE.Euler(-Math.PI / 2, 0, -.18);
const pose = { reach: 0, open: 0 };
const duration = seconds => reducedMotion.matches ? 0 : seconds;

function announce(message) { $('#scene-status').textContent = message; }
function setState(next) {
  state = next;
  if (pendingViewportSync && ['idle', 'held'].includes(next) && book && camera) {
    updateResponsivePositions();
    camera.position.copy(baseCamera);
    if (next === 'held') {
      book.group.position.copy(heldPosition);
      lookTarget.set(heldPosition.x, heldPosition.y, 0);
    } else {
      book.group.position.copy(restPosition);
      lookTarget.set(narrow() ? .3 : 0, .86, 0);
    }
    pendingViewportSync = false;
  }
  document.body.dataset.state = next;
  primary.disabled = !['idle', 'held'].includes(next);
  $('#actions').hidden = !['idle', 'held', 'reaching', 'returning'].includes(next);
  $('#intro').classList.toggle('is-away', next !== 'idle');
  $('#held-caption').hidden = next !== 'held';
  secondary.hidden = next !== 'held';
  $('#book-hotspot').style.opacity = next === 'idle' ? '.8' : '0';
  $('#action-label').textContent = next === 'held' ? 'Abrir el códice' : next === 'reaching' ? 'Un instante…' : next === 'returning' ? 'Junto a la lumbre…' : 'Tomar el libro';
  $('#action-kicker').textContent = next === 'held' ? 'LA HISTORIA ESTÁ EN TUS MANOS' : 'UN OBJETO. MUCHAS HISTORIAS.';
  $('#movement-hint span').textContent = next === 'held' ? 'Mueve el ratón para observar el cuero' : narrow() ? 'Desliza para mirar alrededor' : 'Mueve el ratón para explorar';
  if (next !== 'idle') canvas.style.cursor = 'default';
}

function updateResponsivePositions() {
  if (narrow()) {
    baseCamera.set(.55, 1.55, 5.2);
    heldPosition.set(.55, 1.33, 3.13);
  } else {
    baseCamera.set(0, 1.45, 4.6);
    heldPosition.set(0, 1.29, 3.02);
  }
}

function grabBook() {
  if (state !== 'idle' || !book) return;
  setState('reaching');
  announce('Extiendes las manos y recoges el libro.');
  hands.group.visible = true;
  const d = duration(1);
  timeline = gsap.timeline({ onComplete() { setState('held'); announce('Sostienes el libro cerrado. Puedes abrirlo o dejarlo junto al fuego.'); } });
  timeline.to(gaze, { x: 0, y: 0, duration: .7 * d, ease: 'power2.inOut' }, 0)
    .to(lookTarget, { x: heldPosition.x, y: heldPosition.y, z: 0, duration: .9 * d, ease: 'power2.inOut' }, 0)
    .to(pose, { reach: 1, duration: .8 * d, ease: 'power2.inOut', onUpdate: () => hands.setReach(pose.reach) }, .05 * d)
    .call(() => sound.grab(), [], .7 * d)
    .to(book.group.position, { x: restPosition.x - .12, y: restPosition.y + .19, z: restPosition.z + .07, duration: .55 * d, ease: 'power2.in' }, .72 * d)
    .to(book.group.position, { x: heldPosition.x, y: heldPosition.y + .035, z: heldPosition.z, duration: 1.3 * d, ease: 'power3.inOut' }, 1.1 * d)
    .to(book.group.rotation, { x: .025, y: -.11, z: -.035, duration: 1.6 * d, ease: 'power3.inOut' }, .82 * d)
    .to(book.group.scale, { x: .46, y: .46, z: .46, duration: 1.1 * d, ease: 'power2.inOut' }, 1.1 * d)
    .to(book.group.position, { y: heldPosition.y, duration: .35 * d, ease: 'sine.out' }, 2.4 * d);
}

function putBookDown() {
  if (state !== 'held') return;
  setState('returning');
  const d = duration(1);
  timeline = gsap.timeline({ onComplete() { hands.group.visible = false; setState('idle'); announce('El libro descansa de nuevo junto al fuego.'); } });
  timeline.to(book.group.position, { x: restPosition.x, y: restPosition.y + .15, z: restPosition.z, duration: 1.35 * d, ease: 'power2.inOut' }, 0)
    .to(book.group.rotation, { x: restRotation.x, y: restRotation.y, z: restRotation.z, duration: 1.35 * d, ease: 'power2.inOut' }, 0)
    .to(book.group.scale, { x: .4, y: .4, z: .4, duration: 1.2 * d, ease: 'power2.inOut' }, 0)
    .to(book.group.position, { y: restPosition.y, duration: .45 * d, ease: 'sine.out' }, 1.25 * d)
    .call(() => sound.putDown(), [], 1.65 * d)
    .to(pose, { reach: 0, duration: .65 * d, onUpdate: () => hands.setReach(pose.reach), ease: 'power2.inOut' }, 1.7 * d)
    .to(lookTarget, { x: narrow() ? .3 : 0, y: .86, z: 0, duration: 1.1 * d, ease: 'power2.inOut' }, 1.25 * d);
}

function openBook() {
  if (state !== 'held') return;
  setState('opening');
  announce('Abres el libro. La mirada se acerca al pergamino.');
  sound.open();
  const d = duration(1);
  timeline = gsap.timeline({ onComplete() { enterReader(); } });
  timeline.to(book.group.rotation, { x: 0, y: 0, z: 0, duration: .8 * d, ease: 'sine.inOut' }, 0)
    .to(book.group.position, { x: heldPosition.x, y: heldPosition.y, z: heldPosition.z, duration: .8 * d, ease: 'sine.inOut' }, 0)
    .to(pose, { open: 1, duration: 2.1 * d, ease: 'power2.inOut', onUpdate() { book.setOpen(pose.open); hands.setOpen(pose.open); } }, .3 * d)
    .to(lookTarget, { x: heldPosition.x + .008, y: heldPosition.y, z: heldPosition.z, duration: 1.4 * d, ease: 'power2.inOut' }, 1.7 * d)
    .to(camera.position, { x: heldPosition.x + .008, y: heldPosition.y, z: heldPosition.z + .24, duration: 1.9 * d, ease: 'power3.inOut' }, 1.75 * d);
}

function prepareReadingPose() {
  if (!book || !hands || !camera) return;
  updateResponsivePositions();
  book.group.position.copy(heldPosition);
  book.group.rotation.set(0, 0, 0);
  book.group.scale.setScalar(.46);
  book.setOpen(1);
  pose.open = pose.reach = 1;
  hands.setReach(1); hands.setOpen(1); hands.group.visible = true;
  camera.position.set(heldPosition.x, heldPosition.y, heldPosition.z + .24);
  lookTarget.copy(heldPosition);
  pendingViewportSync = false;
}

function enterReader(direct = false) {
  if (state === 'reading') return;
  timeline?.kill();
  if (direct && sceneAvailability === 'ready') prepareReadingPose();
  setState('reading');
  sound.setReading(true);
  reader.show();
  announce('Modo lectura. Una página ocupa toda la pantalla.');
}

function closeReader() {
  if (state !== 'reading') return;
  if (sceneAvailability !== 'ready') {
    reader.hide();
    sound.setReading(false);
    const stillLoading = sceneAvailability === 'loading';
    setState(stillLoading ? 'loading' : 'fallback');
    $('#loading').hidden = !stillLoading;
    $('#fallback').hidden = stillLoading;
    $(stillLoading ? '#skip-intro' : '#fallback-read').focus({ preventScroll: true });
    announce(stillLoading ? 'La escena continúa preparándose. Puedes volver a las páginas mientras esperas.' : 'Puedes seguir leyendo el portafolio sin la escena tridimensional.');
    return;
  }
  setState('closing');
  reader.hide(); sound.setReading(false); sound.open();
  const d = duration(1);
  timeline = gsap.timeline({ onComplete() { setState('held'); primary.focus({ preventScroll: true }); announce('Vuelves a sostener el libro cerrado.'); } });
  timeline.to(camera.position, { x: baseCamera.x, y: baseCamera.y, z: baseCamera.z, duration: 1.45 * d, ease: 'power3.inOut' }, 0)
    .to(lookTarget, { x: heldPosition.x, y: heldPosition.y, z: 0, duration: 1.45 * d, ease: 'power3.inOut' }, 0)
    .to(pose, { open: 0, duration: 1.65 * d, ease: 'power2.inOut', onUpdate() { book.setOpen(pose.open); hands.setOpen(pose.open); } }, .8 * d)
    .to(book.group.rotation, { x: .025, y: -.11, z: -.035, duration: .55 * d, ease: 'sine.inOut' }, 2 * d);
}

function resize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = narrow() ? 51 : 43;
  if (window.innerWidth > window.innerHeight * 2) camera.fov = 49;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer?.setSize(window.innerWidth, window.innerHeight);
  updateResponsivePositions();
  if (state === 'idle' || state === 'loading') { camera.position.copy(baseCamera); lookTarget.set(narrow() ? .3 : 0, .86, 0); }
  if (state === 'held') { camera.position.copy(baseCamera); book.group.position.copy(heldPosition); lookTarget.set(heldPosition.x, heldPosition.y, 0); }
  if (state === 'reading') prepareReadingPose();
  if (['reaching', 'returning', 'opening', 'closing'].includes(state)) pendingViewportSync = true;
}

let pointerDown = null;
function onPointerMove(event) {
  if (event.pointerType === 'touch') {
    if (!pointerDown) return;
    pointer.set(THREE.MathUtils.clamp((event.clientX - pointerDown.x) / 160, -1, 1), THREE.MathUtils.clamp((event.clientY - pointerDown.y) / 200, -1, 1));
  } else {
    pointer.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
  }
  if (state === 'idle' && book) {
    raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, 1 - event.clientY / window.innerHeight * 2), camera);
    isHovering = raycaster.intersectObject(book.group, true).length > 0;
    canvas.style.cursor = isHovering ? 'pointer' : 'grab';
  }
}
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerdown', event => { pointerDown = { x: event.clientX, y: event.clientY }; });
canvas.addEventListener('pointerup', event => {
  const moved = pointerDown && Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 12;
  pointerDown = null;
  if (moved || !book) return;
  raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, 1 - event.clientY / window.innerHeight * 2), camera);
  if (state === 'idle' && raycaster.intersectObject(book.group, true).length) grabBook();
});
canvas.addEventListener('pointercancel', () => { pointerDown = null; });
canvas.addEventListener('pointerleave', () => { pointer.set(0, 0); });
primary.addEventListener('click', () => state === 'idle' ? grabBook() : openBook());
secondary.addEventListener('click', putBookDown);
$('#skip-intro').addEventListener('click', () => enterReader(true));
$('#fallback-read').addEventListener('click', () => enterReader(true));
$('.author-mark').addEventListener('click', event => { event.preventDefault(); if (state === 'held') putBookDown(); });
$('#sound-toggle').addEventListener('click', async () => {
  const enabled = await sound.toggle();
  $('#sound-toggle').setAttribute('aria-pressed', String(enabled));
  $('#sound-toggle').setAttribute('aria-label', `${enabled ? 'Silenciar' : 'Activar'} sonido de la fogata`);
  $('#sound-toggle').title = enabled ? 'Silenciar sonido' : 'Activar sonido';
});
document.addEventListener('keydown', event => {
  if (state === 'reading' || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName)) return;
  if (event.code === 'Space' || event.code === 'Enter') { if (['idle', 'held'].includes(state)) { event.preventDefault(); state === 'idle' ? grabBook() : openBook(); } }
  if (event.code === 'Escape' && state === 'held') putBookDown();
});
window.addEventListener('resize', resize);

function animate(now) {
  if (disposed) return;
  frameId = requestAnimationFrame(animate);
  const delta = Math.min((now - lastTime) / 1000 || .016, .05);
  lastTime = now;
  if (document.hidden || state === 'reading' || state === 'fallback') return;
  elapsed += delta;
  environment.update(elapsed, delta);
  book.update(elapsed, delta);
  hands.update(elapsed);
  if (state === 'idle') {
    const smoothing = 1 - Math.exp(-delta * 2.2);
    gaze.lerp(pointer, smoothing);
    const yaw = reducedMotion.matches ? 0 : gaze.x * .95;
    const pitch = reducedMotion.matches ? 0 : gaze.y * -.48;
    camera.lookAt(lookTarget.x + yaw, lookTarget.y + pitch + (reducedMotion.matches ? 0 : Math.sin(elapsed * .65) * .009), lookTarget.z);
    const projected = book.group.position.clone().add(new THREE.Vector3(0, .1, 0)).project(camera);
    const hotspot = $('#book-hotspot');
    hotspot.style.transform = `translate(${(projected.x * .5 + .5) * window.innerWidth - 25}px,${(-projected.y * .5 + .5) * window.innerHeight - 22}px)`;
    hotspot.style.opacity = projected.x > .94 || projected.x < -.94 ? '0' : isHovering ? '1' : '.7';
  } else {
    camera.lookAt(lookTarget);
    if (state === 'held' && !reducedMotion.matches) {
      book.group.rotation.x = THREE.MathUtils.damp(book.group.rotation.x, .025 + pointer.y * .055, 2.5, delta);
      book.group.rotation.y = THREE.MathUtils.damp(book.group.rotation.y, -.11 + pointer.x * .18, 2.5, delta);
      book.group.position.y = heldPosition.y + Math.sin(elapsed * 1.1) * .006;
    }
  }
  composer.render();
}

async function init() {
  reader = createReader({ onClose: closeReader, onPageTurn: () => sound.page() });
  setState('loading');
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow() ? 1.4 : 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c0c08');
    scene.fog = new THREE.FogExp2('#11110c', .035);
    camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, .025, 110);
    updateResponsivePositions(); camera.position.copy(baseCamera);
    environment = createEnvironment({ renderer, quality: narrow() ? 'low' : 'high' });
    scene.add(environment.group);
    // A broad, warm reflected source brings out the impressed leather without a cold studio sheen.
    const bookFill = new THREE.SpotLight('#f6d5a0', 18, 8, .75, 1, 1.5);
    bookFill.position.set(1.5, 3.8, 5.4); bookFill.target.position.set(.3, 1.1, 2.6);
    scene.add(bookFill, bookFill.target);
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]);
    if (disposed) return;
    book = await createBook({ renderer });
    if (disposed) { book.dispose(); return; }
    book.group.position.copy(restPosition); book.group.rotation.copy(restRotation); book.group.scale.setScalar(.4);
    scene.add(book.group);
    hands = createHands(); hands.group.visible = false; hands.setReach(0); book.group.add(hands.group);
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), .45, .65, 1.8);
    composer.addPass(bloom); composer.addPass(new OutputPass());
    resize();
    await renderer.compileAsync(scene, camera);
    if (disposed) return;
    if (sceneAvailability === 'unavailable') throw new Error('Se perdió el contexto gráfico durante la carga.');
    sceneAvailability = 'ready';
    $('#loading').hidden = true;
    $('#fallback').hidden = true;
    if (reader.isOpen()) {
      prepareReadingPose();
      setState('reading');
      announce('Modo lectura. Una página ocupa toda la pantalla.');
    } else {
      setState('idle');
      announce('El libro está a tu derecha. Mueve el ratón para mirar o pulsa Tomar el libro.');
    }
    frameId = requestAnimationFrame(animate);
  } catch (error) {
    if (disposed) return;
    sceneAvailability = 'unavailable';
    console.error('No se pudo iniciar la escena:', error);
    $('#loading').hidden = true;
    $('#fallback').hidden = false;
    if (!reader.isOpen()) setState('fallback');
  }
}

canvas.addEventListener('webglcontextlost', event => {
  sceneAvailability = 'unavailable';
  event.preventDefault(); timeline?.kill(); cancelAnimationFrame(frameId);
  if (state !== 'reading') { setState('fallback'); $('#fallback').hidden = false; }
});

function dispose() {
  disposed = true; cancelAnimationFrame(frameId); timeline?.kill();
  environment?.dispose(); hands?.dispose(); book?.dispose(); reader?.dispose(); sound.dispose();
  composer?.dispose(); renderer?.dispose();
}
if (import.meta.hot) import.meta.hot.dispose(dispose);
init();
