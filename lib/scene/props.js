import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Right-hand side of the clearing: a low stump used as a table with a vintage radio (plays jazz)
// and a phone leaning beside it (opens the portfolio inside a phone frame).
// Everything is procedural: a handful of meshes and two small canvas textures.

export const TABLE = new THREE.Vector3(1.15, 0, 2.3);
const TABLE_TOP = .5;

function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}
function tex(c, color = true) {
  const t = new THREE.CanvasTexture(c);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function walnutTexture() {
  const [c, ctx] = canvas(512, 256);
  ctx.fillStyle = '#3b2412'; ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * 256, h = .6 + Math.random() * 2.4;
    ctx.fillStyle = `rgba(${20 + Math.random() * 40},${8 + Math.random() * 20},${2 + Math.random() * 8},${.1 + Math.random() * .25})`;
    ctx.fillRect(0, y, 512, h);
  }
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = 'rgba(120,76,36,.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); const y = Math.random() * 256; ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) ctx.lineTo(x, y + Math.sin(x * .03 + i) * 3);
    ctx.stroke();
  }
  return tex(c);
}

function grilleTexture() {
  const [c, ctx] = canvas(320, 288);
  ctx.fillStyle = '#6b5436'; ctx.fillRect(0, 0, 320, 288);
  for (let y = 0; y < 288; y += 4) for (let x = (y / 4) % 2 ? 0 : 2; x < 320; x += 4) {
    ctx.fillStyle = (x + y) % 8 ? '#43331f' : '#8a6f47'; ctx.fillRect(x, y, 2, 2);
  }
  ctx.strokeStyle = '#a58542'; ctx.lineWidth = 6;
  for (const x of [60, 110, 160, 210, 260]) { ctx.beginPath(); ctx.moveTo(x, 18); ctx.lineTo(x, 270); ctx.stroke(); }
  ctx.strokeStyle = '#c9a766'; ctx.lineWidth = 8; ctx.strokeRect(6, 6, 308, 276);
  return tex(c);
}

function dialTexture() {
  const [c, ctx] = canvas(384, 208);
  const g = ctx.createLinearGradient(0, 0, 0, 208); g.addColorStop(0, '#f2e2b8'); g.addColorStop(1, '#d6bf8a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 384, 208);
  ctx.strokeStyle = '#4a3320'; ctx.fillStyle = '#4a3320'; ctx.lineWidth = 2;
  ctx.font = '600 20px Georgia, serif'; ctx.textAlign = 'center';
  ctx.fillText('JAZZ · FM', 192, 44);
  for (let i = 0; i <= 40; i++) {
    const x = 36 + i * 8.55, long = i % 5 === 0;
    ctx.beginPath(); ctx.moveTo(x, 118); ctx.lineTo(x, long ? 90 : 102); ctx.stroke();
    if (long && i % 10 === 0) ctx.fillText(String(88 + i / 2), x, 82);
  }
  ctx.font = 'italic 17px Georgia, serif'; ctx.fillText('Radiodifusora', 192, 168);
  ctx.strokeStyle = '#9c7a43'; ctx.lineWidth = 5; ctx.strokeRect(3, 3, 378, 202);
  return tex(c);
}

function screenTexture() {
  const W = 364, H = 772;
  const [c, ctx] = canvas(W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0b1a2a'); bg.addColorStop(.55, '#12304a'); bg.addColorStop(1, '#1b1738');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // aurora hint behind the content
  const au = ctx.createRadialGradient(W * .3, 150, 10, W * .3, 150, 320);
  au.addColorStop(0, 'rgba(70,255,170,.38)'); au.addColorStop(1, 'rgba(70,255,170,0)');
  ctx.fillStyle = au; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#e9f3ee'; ctx.font = '600 20px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('9:41', 34, 46);
  ctx.textAlign = 'right'; ctx.fillText('●●● ▮', W - 30, 46);
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#d9b97a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 190, 62, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#e6c88c'; ctx.font = '600 58px "Cinzel", Georgia, serif'; ctx.fillText('KB', W / 2, 210);
  ctx.fillStyle = '#f3ead8'; ctx.font = '600 33px "Cinzel", Georgia, serif'; ctx.fillText('Kevin Stiven', W / 2, 316);
  ctx.fillStyle = '#9fb8c4'; ctx.font = 'italic 22px Georgia, serif'; ctx.fillText('Diseño, código y experiencias', W / 2, 352);
  const apps = ['Obras', 'Oficio', 'Cuaderno', 'Contacto'];
  apps.forEach((name, i) => {
    const x = 48 + i * 74, y = 420;
    ctx.fillStyle = ['#c9a766', '#6fb59a', '#8a7bd6', '#d98a6a'][i];
    ctx.beginPath(); ctx.roundRect(x, y, 56, 56, 15); ctx.fill();
    ctx.fillStyle = '#d4e0e6'; ctx.font = '15px system-ui, sans-serif'; ctx.fillText(name, x + 28, y + 80);
  });
  ctx.fillStyle = '#e6c88c'; ctx.beginPath(); ctx.roundRect(42, 580, W - 84, 66, 33); ctx.fill();
  ctx.fillStyle = '#2a1a0c'; ctx.font = '600 25px "Cinzel", Georgia, serif'; ctx.fillText('Entrar al portafolio', W / 2, 622);
  ctx.fillStyle = '#7f98a6'; ctx.font = '17px system-ui, sans-serif'; ctx.fillText('Toca para abrir', W / 2, 686);
  ctx.fillStyle = '#d9e2e6'; ctx.beginPath(); ctx.roundRect(W / 2 - 62, H - 26, 124, 6, 3); ctx.fill();
  return tex(c);
}

export function createProps({ barkMat, woodMat, quality = 'high' } = {}) {
  const group = new THREE.Group(); group.name = 'Radio y móvil';
  const disposables = [];
  const track = item => { disposables.push(item); return item; };

  // ---- table stump
  const sideMat = track(barkMat.clone());
  for (const key of ['map', 'normalMap', 'roughnessMap']) {
    if (barkMat[key]) { sideMat[key] = track(barkMat[key].clone()); sideMat[key].repeat.set(2, .6); }
  }
  const tableGeo = track(new THREE.CylinderGeometry(.6, .7, TABLE_TOP, 56, 8));
  const pos = tableGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), a = Math.atan2(z, x);
    const k = 1 + Math.sin(a * 6 + 1.3) * .035 + Math.cos(a * 11) * .02;
    pos.setX(i, x * k); pos.setZ(i, z * k);
  }
  tableGeo.computeVertexNormals();
  const table = new THREE.Mesh(tableGeo, [sideMat, woodMat, sideMat]);
  table.position.set(TABLE.x, TABLE_TOP / 2, TABLE.z);
  table.castShadow = table.receiveShadow = true;
  group.add(table);

  // ---- radio
  const radio = new THREE.Group(); radio.name = 'Radio';
  radio.position.set(TABLE.x + .1, TABLE_TOP, TABLE.z + .02); radio.rotation.y = -.32;
  const wood = track(new THREE.MeshStandardMaterial({ map: track(walnutTexture()), roughness: .62, metalness: .05 }));
  const body = new THREE.Mesh(track(new RoundedBoxGeometry(.64, .38, .27, 5, .045)), wood);
  body.position.y = .21; body.castShadow = body.receiveShadow = true; radio.add(body);
  const front = .1365;
  const grille = new THREE.Mesh(track(new THREE.PlaneGeometry(.3, .27)), track(new THREE.MeshStandardMaterial({ map: track(grilleTexture()), roughness: 1 })));
  grille.position.set(-.14, .205, front); radio.add(grille);
  const dialMat = track(new THREE.MeshStandardMaterial({ map: track(dialTexture()), roughness: .5, emissive: new THREE.Color('#ffbe6a'), emissiveMap: null, emissiveIntensity: 0 }));
  const dial = new THREE.Mesh(track(new THREE.PlaneGeometry(.24, .13)), dialMat);
  dial.position.set(.14, .285, front); radio.add(dial);
  const needle = new THREE.Mesh(track(new THREE.BoxGeometry(.004, .075, .002)), track(new THREE.MeshBasicMaterial({ color: '#b3261e' })));
  needle.position.set(.14, .285, front + .002); radio.add(needle);
  const glow = new THREE.Mesh(track(new THREE.PlaneGeometry(.26, .15)),
    track(new THREE.MeshBasicMaterial({ color: '#ffb35a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
  glow.position.set(.14, .285, front + .003); radio.add(glow);
  const knobMat = track(new THREE.MeshStandardMaterial({ color: '#1d1511', roughness: .4, metalness: .3 }));
  const ring = track(new THREE.MeshStandardMaterial({ color: '#b08c4c', roughness: .35, metalness: .8 }));
  const knobGeo = track(new THREE.CylinderGeometry(.03, .034, .036, 24)); const ringGeo = track(new THREE.TorusGeometry(.034, .004, 8, 24));
  const knobs = [];
  for (const x of [.08, .2]) {
    const k = new THREE.Mesh(knobGeo, knobMat); k.rotation.x = Math.PI / 2; k.position.set(x, .12, front + .014);
    const r = new THREE.Mesh(ringGeo, ring); r.position.set(x, .12, front + .003); radio.add(k, r); knobs.push(k);
  }
  const footGeo = track(new THREE.CylinderGeometry(.018, .02, .03, 12));
  for (const [x, z] of [[-.26, -.09], [.26, -.09], [-.26, .09], [.26, .09]]) {
    const f = new THREE.Mesh(footGeo, knobMat); f.position.set(x, .015, z); radio.add(f);
  }
  group.add(radio);

  // ---- phone
  const phone = new THREE.Group(); phone.name = 'Móvil';
  phone.position.set(TABLE.x - .36, TABLE_TOP, TABLE.z + .16); phone.rotation.set(-.3, -.3, 0);
  const shell = track(new THREE.MeshStandardMaterial({ color: '#17181c', roughness: .35, metalness: .7 }));
  const pBody = new THREE.Mesh(track(new RoundedBoxGeometry(.2, .41, .024, 4, .022)), shell);
  pBody.position.y = .205; pBody.castShadow = true; phone.add(pBody);
  const screenMat = track(new THREE.MeshBasicMaterial({ map: track(screenTexture()), toneMapped: false }));
  const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(.182, .386)), screenMat);
  screen.position.set(0, .205, .0125); phone.add(screen);
  const island = new THREE.Mesh(track(new THREE.CircleGeometry(.0085, 16)), track(new THREE.MeshBasicMaterial({ color: '#050506' })));
  island.position.set(0, .386, .0128); phone.add(island);
  const sideGeo = track(new THREE.BoxGeometry(.004, .05, .008));
  const s1 = new THREE.Mesh(sideGeo, shell); s1.position.set(.102, .27, 0); phone.add(s1);
  const s2 = new THREE.Mesh(sideGeo, shell); s2.position.set(-.102, .3, 0); phone.add(s2);
  const screenLight = new THREE.PointLight(0x8fd2ff, quality === 'low' ? 0 : .45, 1.4, 2);
  screenLight.position.set(0, .22, .22); phone.add(screenLight);
  group.add(phone);

  let radioOn = false, radioLevel = 0;
  const tmp = new THREE.Vector3();
  return {
    group, radio, phone,
    setRadioOn(on) { radioOn = Boolean(on); },
    isRadioOn: () => radioOn,
    radioPoint: () => { radio.updateMatrixWorld(true); return radio.localToWorld(tmp.set(0, .5, .1)).clone(); },
    phonePoint: () => { phone.updateMatrixWorld(true); return phone.localToWorld(tmp.set(0, .205, .02)).clone(); },
    update(time) {
      radioLevel += ((radioOn ? 1 : 0) - radioLevel) * .08;
      const beat = radioOn ? .5 + .5 * Math.sin(time * 2.4) : 0;
      glow.material.opacity = radioLevel * (.2 + beat * .12);
      dialMat.emissiveIntensity = radioLevel * .25;
      needle.position.x = .14 + (radioOn ? Math.sin(time * .35) * .085 : -.085 * (1 - radioLevel));
      knobs.forEach((k, i) => { k.rotation.y = radioOn ? Math.sin(time * .2 + i) * .15 : 0; });
      const pulse = .9 + .1 * Math.sin(time * 1.6);
      screenMat.color.setScalar(pulse);
      screenLight.intensity = (quality === 'low' ? 0 : .45) * pulse;
    },
    dispose() { disposables.forEach(item => item.dispose?.()); },
  };
}
