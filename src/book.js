import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const WIDTH = 1.7;
const HEIGHT = 2.4;
const clamp = THREE.MathUtils.clamp;

function rng(seed = 27) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function canvas(width, height = width) {
  const element = document.createElement('canvas');
  element.width = width; element.height = height;
  return [element, element.getContext('2d', { willReadFrequently: true })];
}

function texture(element, renderer, color = true) {
  const result = new THREE.CanvasTexture(element);
  if (color) result.colorSpace = THREE.SRGBColorSpace;
  result.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() || 4);
  return result;
}

// Seeded pores and overlapping wrinkles give the leather a quiet, irregular relief.
function leatherCanvas(width, height, seed = 8) {
  const [surface, ctx] = canvas(width, height);
  const random = rng(seed);
  const pixels = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const n = random() * 13;
      const cloud = Math.sin(x * .019 + Math.sin(y * .011) * 3) * 4 + Math.sin(y * .031) * 2;
      const edge = Math.min(x, width - x, y, height - y) / Math.min(width, height);
      const wear = Math.max(0, 1 - edge * 14) * (15 + n);
      const p = (y * width + x) * 4;
      pixels.data[p] = 53 + n + cloud + wear;
      pixels.data[p + 1] = 29 + n * .7 + cloud * .6 + wear * .59;
      pixels.data[p + 2] = 17 + n * .4 + cloud * .35 + wear * .31;
      pixels.data[p + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  for (let i = 0; i < 1500; i++) {
    const x = random() * width, y = random() * height;
    ctx.strokeStyle = i % 3 ? 'rgba(13,6,2,.14)' : 'rgba(156,111,65,.1)';
    ctx.lineWidth = .4 + random() * 1.4;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 12, y - 3, x + 20, y + 12, x + 36 + random() * 60, y + random() * 25);
    ctx.stroke();
  }
  return surface;
}

function flourish(ctx, x, y, scale = 1, flipX = 1, flipY = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale * flipX, scale * flipY);
  ctx.strokeStyle = '#b99755'; ctx.lineWidth = 2.4;
  const paths = [
    [0, 0, 90, 4, 126, 25, 120, 67, 115, 105, 65, 105, 63, 75, 62, 53, 92, 51, 95, 72],
    [0, 0, 4, 90, 25, 126, 67, 120, 105, 115, 105, 65, 75, 63, 53, 62, 51, 92, 72, 95],
    [3, 3, 40, 42, 50, 41, 42, 18, 32, -8, 14, 17, 37, 37],
  ];
  paths.forEach(points => {
    ctx.beginPath(); ctx.moveTo(points[0], points[1]);
    for (let i = 2; i + 5 < points.length; i += 6) ctx.bezierCurveTo(...points.slice(i, i + 6));
    ctx.stroke();
  });
  for (let i = 0; i < 9; i++) {
    const angle = i * .24;
    const px = 21 + Math.cos(angle) * 125, py = 20 + Math.sin(angle) * 95;
    ctx.beginPath(); ctx.ellipse(px, py, 9, 3, angle + .5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(170,137,73,.7)'; ctx.fill();
  }
  ctx.restore();
}

async function createCoverMaps(portraitUrl, renderer) {
  const width = 1536, height = 2048;
  const surface = leatherCanvas(width, height);
  const ctx = surface.getContext('2d', { willReadFrequently: true });
  let portrait;
  try {
    portrait = await new Promise((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = portraitUrl;
    });
  } catch {
    // The volume remains usable even when the optional portrait is unavailable.
  }
  if (portrait) {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(171, 280, 1194, 1510, 8); ctx.clip();
    // The supplied reference is already a sepia portrait painted onto leather.
    // Crop the white photographic surround, retaining the aged painted surface.
    ctx.drawImage(portrait, portrait.width * .055, portrait.height * .041,
      portrait.width * .9, portrait.height * .916, 171, 280, 1194, 1510);
    const shade = ctx.createLinearGradient(0, 280, 0, 1790);
    shade.addColorStop(0, 'rgba(40,20,9,.12)'); shade.addColorStop(.4, 'rgba(40,20,9,0)');
    shade.addColorStop(1, 'rgba(40,20,9,.28)'); ctx.fillStyle = shade; ctx.fillRect(171, 280, 1194, 1510);
    ctx.restore();
  }
  ctx.strokeStyle = '#a38245'; ctx.lineWidth = 4;
  ctx.strokeRect(64, 64, width - 128, height - 128);
  ctx.lineWidth = 1.5; ctx.strokeRect(78, 78, width - 156, height - 156);
  ctx.strokeStyle = '#3b2413'; ctx.lineWidth = 7; ctx.strokeRect(160, 269, 1216, 1532);
  ctx.strokeStyle = '#ad8847'; ctx.lineWidth = 2; ctx.strokeRect(165, 274, 1206, 1522);
  flourish(ctx, 99, 99, .8); flourish(ctx, width - 99, 99, .8, -1, 1);
  flourish(ctx, 99, height - 99, .8, 1, -1); flourish(ctx, width - 99, height - 99, .8, -1, -1);

  ctx.textAlign = 'center'; ctx.fillStyle = '#d1ae70';
  ctx.font = '500 79px "Cinzel", Georgia, serif';
  ctx.shadowColor = '#130b04'; ctx.shadowBlur = 1; ctx.shadowOffsetY = 3;
  ctx.fillText('CODEX OPERUM', width / 2, 184);
  ctx.shadowOffsetY = 0; ctx.shadowBlur = 0;
  ctx.fillStyle = '#a98c5a'; ctx.font = 'italic 27px Georgia, serif';
  ctx.fillText('Memoria de un oficio', width / 2, 228);
  ctx.fillStyle = '#d6b882'; ctx.font = '39px "Cinzel", Georgia, serif';
  ctx.fillText('KEVIN STIVEN', width / 2, 1871);
  ctx.font = '31px "Cinzel", Georgia, serif'; ctx.fillText('BUESAQUILLO TIMARÁN', width / 2, 1922);
  ctx.fillStyle = '#a58c5e'; ctx.font = '22px Georgia, serif'; ctx.fillText('✦     MMXXVI     ✦', width / 2, 1970);

  // Maps come from the same surface, so every scratch remains registered to its relief.
  const pixels = ctx.getImageData(0, 0, width, height);
  const [heightCanvas, heightCtx] = canvas(width, height);
  const [roughCanvas, roughCtx] = canvas(width, height);
  const [metalCanvas, metalCtx] = canvas(width, height);
  const relief = heightCtx.createImageData(width, height);
  const roughness = roughCtx.createImageData(width, height);
  const metalness = metalCtx.createImageData(width, height);
  const random = rng(91);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
    const lum = r * .3 + g * .58 + b * .12;
    const h = 100 + lum * .23 + random() * 14;
    const isFoil = r > 140 && g / r > .68 && g / r < .88 && b / r < .66;
    for (let j = 0; j < 3; j++) {
      relief.data[i + j] = h;
      roughness.data[i + j] = isFoil ? 124 + random() * 50 : 205 + random() * 40;
      metalness.data[i + j] = isFoil ? 155 : 0;
    }
    relief.data[i + 3] = roughness.data[i + 3] = metalness.data[i + 3] = 255;
  }
  heightCtx.putImageData(relief, 0, 0); roughCtx.putImageData(roughness, 0, 0); metalCtx.putImageData(metalness, 0, 0);
  return {
    map: texture(surface, renderer), bumpMap: texture(heightCanvas, renderer, false),
    roughnessMap: texture(roughCanvas, renderer, false), metalnessMap: texture(metalCanvas, renderer, false),
  };
}

function createPaperMaps(renderer) {
  const [surface, ctx] = canvas(1024, 1440);
  const random = rng(17);
  const pixels = ctx.createImageData(1024, 1440);
  for (let y = 0; y < 1440; y++) {
    for (let x = 0; x < 1024; x++) {
      const p = (y * 1024 + x) * 4;
      const edge = Math.min(x, 1024 - x) / 512;
      const n = random() * 11 + Math.sin(x * .02 + Math.sin(y * .008) * 2) * 3;
      const burn = Math.pow(1 - edge, 15) * 38;
      pixels.data[p] = 222 + n - burn;
      pixels.data[p + 1] = 202 + n - burn * 1.2;
      pixels.data[p + 2] = 158 + n - burn * 1.1;
      pixels.data[p + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  for (let i = 0; i < 17000; i++) {
    const x = random() * 1024, y = random() * 1440;
    ctx.strokeStyle = `rgba(99,66,29,${random() * .10})`; ctx.lineWidth = .7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + random() * 9, y + random() * 2); ctx.stroke();
  }
  const [plainSurface, plainCtx] = canvas(1024, 1440);
  plainCtx.drawImage(surface, 0, 0);
  const plain = texture(plainSurface, renderer);
  ctx.strokeStyle = '#775e3b'; ctx.lineWidth = 1.7; ctx.strokeRect(82, 86, 860, 1268);
  ctx.lineWidth = .6; ctx.strokeRect(90, 94, 844, 1252);
  ctx.textAlign = 'center'; ctx.fillStyle = '#4a3320';
  ctx.font = '21px "Cinzel", Georgia, serif'; ctx.fillText('DEL INGENIO Y LA MEMORIA', 512, 206);
  ctx.font = '79px "Cinzel", Georgia, serif'; ctx.fillText('CODEX', 512, 420); ctx.fillText('OPERUM', 512, 518);
  ctx.font = 'italic 28px Georgia, serif'; ctx.fillText('Un libro de ideas, oficio y exploración', 512, 608);
  ctx.font = '30px Georgia, serif'; ctx.fillText('Kevin Stiven', 512, 820); ctx.fillText('Buesaquillo Timarán', 512, 865);
  ctx.font = '43px Georgia, serif'; ctx.fillText('❧', 512, 1004);
  ctx.font = '20px Georgia, serif'; ctx.fillText('PORTAFOLIO PERSONAL', 512, 1160); ctx.fillText('MMXXVI', 512, 1210);
  return { plain, title: texture(surface, renderer) };
}

function createPageEdgeMap(renderer) {
  const [surface, ctx] = canvas(512, 512);
  const random = rng(1);
  ctx.fillStyle = '#b5a078'; ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 2) {
    const lum = 132 + random() * 75;
    ctx.strokeStyle = `rgb(${lum + 26},${lum + 9},${lum - 23})`;
    ctx.lineWidth = .6 + random(); ctx.beginPath(); ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) ctx.lineTo(x, y + Math.sin(x * .03 + y) * .65);
    ctx.stroke();
  }
  return texture(surface, renderer);
}

function makeDeckleLeaf(width, height, depth, phase = 0) {
  const geometry = new THREE.PlaneGeometry(width, height, 22, 30);
  const points = geometry.attributes.position;
  for (let i = 0; i < points.count; i++) {
    let x = points.getX(i), y = points.getY(i);
    const edge = Math.pow(Math.abs(x) / (width / 2), 6);
    const wave = Math.sin(y * 36 + phase) * .0015;
    x += Math.sin(y * 112 + phase) * .002 * edge;
    y += Math.sin(x * 73 + phase) * .0018;
    points.setXYZ(i, x, y, depth + wave * edge);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export async function createBook({ renderer, portraitUrl = '/assets/kevin-portrait.jpg' } = {}) {
  const group = new THREE.Group(); group.name = 'Codex Operum — bound volume';
  const coverMaps = await createCoverMaps(portraitUrl, renderer);
  const leatherMap = texture(leatherCanvas(512, 1024, 18), renderer);
  const leather = new THREE.MeshStandardMaterial({ color: '#b9a18b', map: leatherMap, bumpMap: leatherMap, bumpScale: .012, roughness: .88 });
  const edgeLeather = new THREE.MeshStandardMaterial({ color: '#563923', map: leatherMap, bumpMap: leatherMap, bumpScale: .017, roughness: .94 });
  const front = new THREE.MeshStandardMaterial({ ...coverMaps, color: '#ffffff', bumpScale: .009, roughness: 1, metalness: .65 });
  const { plain, title } = createPaperMaps(renderer);
  const paper = new THREE.MeshStandardMaterial({ map: plain, color: '#eee0bd', roughness: .99, side: THREE.DoubleSide });
  const endPaper = new THREE.MeshStandardMaterial({ map: plain, color: '#bca377', roughness: .99 });
  const titlePaper = new THREE.MeshStandardMaterial({ map: title, roughness: .98, side: THREE.DoubleSide });
  const edgesMap = createPageEdgeMap(renderer);
  const pageEdge = new THREE.MeshStandardMaterial({ map: edgesMap, bumpMap: edgesMap, bumpScale: .008, roughness: .99 });
  const brass = new THREE.MeshStandardMaterial({ color: '#897044', metalness: .68, roughness: .61 });
  const wornGold = new THREE.MeshStandardMaterial({ color: '#ac8b50', metalness: .65, roughness: .63 });

  function addMesh(geometry, material, parent, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }

  // Separate rounded boards make the thickness readable from any grazing angle.
  const boardGeometry = new RoundedBoxGeometry(WIDTH, HEIGHT, .085, 4, .025);
  addMesh(boardGeometry, [edgeLeather, edgeLeather, edgeLeather, edgeLeather, endPaper, leather], group, 0, 0, -.193);
  const coverPivot = new THREE.Group(); coverPivot.name = 'front-cover-hinge';
  coverPivot.position.set(-WIDTH / 2, 0, .168); group.add(coverPivot);
  addMesh(boardGeometry.clone(), [edgeLeather, edgeLeather, edgeLeather, edgeLeather, front, endPaper], coverPivot, WIDTH / 2, 0, .032);

  // Sewing and compressed signatures remain visible below the oversized boards.
  const bookBlock = addMesh(new RoundedBoxGeometry(1.59, 2.29, .285, 2, .014),
    [pageEdge, pageEdge, pageEdge, pageEdge, paper, paper], group, .018, 0, -.004);
  bookBlock.name = 'aged-paper-signatures';
  for (let i = 0; i < 43; i++) {
    const z = -.139 + i * .0067;
    const w = 1.597 + Math.sin(i * 2.73) * .009;
    const h = 2.292 + Math.cos(i * 3.17) * .006;
    const outline = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-.777, h / 2, z), new THREE.Vector3(w / 2 + .018, h / 2, z),
      new THREE.Vector3(w / 2 + .018, -h / 2, z), new THREE.Vector3(-.777, -h / 2, z),
    ]);
    const line = new THREE.Line(outline, new THREE.LineBasicMaterial({ color: i % 5 ? '#b59e73' : '#7f6a48', transparent: true, opacity: .5 }));
    group.add(line);
  }

  const pageTarget = new THREE.Object3D(); pageTarget.position.set(.018, 0, .149); group.add(pageTarget);
  addMesh(makeDeckleLeaf(1.58, 2.28, 0, 2), titlePaper, group, .018, 0, .145);

  // The hollow outside curve and raised cords are physically modeled, not printed.
  const spine = addMesh(new RoundedBoxGeometry(.16, 2.4, .44, 5, .065), leather, group, -.825, 0, -.003);
  spine.name = 'rounded-leather-spine';
  for (const y of [-.88, -.46, 0, .46, .88]) {
    addMesh(new RoundedBoxGeometry(.177, .052, .454, 3, .02), edgeLeather, group, -.834, y, -.003);
    addMesh(new RoundedBoxGeometry(.18, .008, .459, 2, .003), wornGold, group, -.834, y + .019, -.003);
    addMesh(new RoundedBoxGeometry(.18, .006, .459, 2, .002), brass, group, -.834, y - .02, -.003);
  }

  // Thin chased brass corners protect the leather without turning the book into a metal prop.
  function corner(parent, x, y, flipX, flipY, z) {
    const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(.19, 0); shape.lineTo(.19, .025);
    shape.quadraticCurveTo(.067, .026, .026, .18); shape.lineTo(0, .18); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .006, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .002, bevelThickness: .002 });
    const piece = addMesh(geometry, brass, parent, x, y, z); piece.scale.set(flipX, flipY, 1);
    const rivet = addMesh(new THREE.SphereGeometry(.009, 10, 6), wornGold, parent,
      x + .032 * flipX, y + .032 * flipY, z + .009); rivet.scale.z = .35;
  }
  corner(coverPivot, .04, -1.16, 1, 1, .079);
  corner(coverPivot, 1.66, -1.16, -1, 1, .079);
  corner(coverPivot, .04, 1.16, 1, -1, .079);
  corner(coverPivot, 1.66, 1.16, -1, -1, .079);

  // A narrow oxblood ribbon hangs naturally beyond the bottom page edge.
  const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(.048, .38, 2, 10),
    new THREE.MeshStandardMaterial({ color: '#61251a', roughness: .95, side: THREE.DoubleSide }));
  const ribbonVertices = ribbon.geometry.attributes.position;
  for (let i = 0; i < ribbonVertices.count; i++) {
    const y = ribbonVertices.getY(i); ribbonVertices.setZ(i, Math.sin(y * 16) * .018);
  }
  ribbon.geometry.computeVertexNormals(); ribbon.position.set(.51, -1.19, .04); ribbon.rotation.z = -.055; group.add(ribbon);

  const leaves = [];
  for (let i = 0; i < 3; i++) {
    const hinge = new THREE.Group(); hinge.position.set(-.777, 0, .15 + i * .002);
    const leaf = addMesh(makeDeckleLeaf(1.58, 2.28, 0, i), paper, hinge, .79, 0, 0);
    leaf.castShadow = true; group.add(hinge); leaves.push(hinge);
  }
  // Full-page artwork is revealed when the loose front flyleaves have opened.
  let openness = 0;
  function setOpen(progress) {
    openness = clamp(progress, 0, 1);
    coverPivot.rotation.y = -Math.PI * .94 * openness;
    leaves.forEach((leaf, i) => {
      const t = clamp((openness - .2 - i * .08) / (.8 - i * .08), 0, 1);
      leaf.rotation.y = -Math.PI * .985 * t;
    });
  }

  function update(time) {
    ribbon.rotation.x = Math.sin(time * .9) * .014;
    leaves.forEach((leaf, i) => {
      if (openness > .99) leaf.rotation.y = -Math.PI * .985 + Math.sin(time * 1.3 + i) * .002;
    });
  }
  function dispose() {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    group.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      const mats = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
      mats.forEach(mat => { materials.add(mat); Object.values(mat).forEach(value => { if (value?.isTexture) textures.add(value); }); });
    });
    geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
  }
  setOpen(0);
  return { group, coverPivot, pageTarget, update, setOpen, dispose };
}
