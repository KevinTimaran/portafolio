import * as THREE from 'three';

function noiseTexture(size, fabric = false) {
  const element = document.createElement('canvas'); element.width = element.height = size;
  const ctx = element.getContext('2d'); const data = ctx.createImageData(size, size);
  let seed = 731;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    const random = (seed >>> 0) / 4294967296;
    const weave = fabric ? Math.sin(x * Math.PI * .5) * 22 + Math.sin(y * Math.PI * .5) * 18 : 0;
    const value = 125 + random * (fabric ? 30 : 23) + weave;
    const i = (y * size + x) * 4; data.data[i] = data.data[i + 1] = data.data[i + 2] = value; data.data[i + 3] = 255;
  }
  ctx.putImageData(data, 0, 0);
  const texture = new THREE.CanvasTexture(element); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Continuous, tapered organic surface: no separate ball joints. */
function taperedTube(points, radii, segments = 30, radialSegments = 14, flatten = 1) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'centripetal');
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [], normals = [], uvs = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const sample = t * (radii.length - 1), low = Math.floor(sample), high = Math.min(radii.length - 1, low + 1);
    const radius = THREE.MathUtils.lerp(radii[low], radii[high], sample - low);
    const center = curve.getPointAt(t);
    for (let j = 0; j <= radialSegments; j++) {
      const a = j / radialSegments * Math.PI * 2;
      const normal = frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a) * flatten);
      const p = center.clone().addScaledVector(normal, radius);
      positions.push(p.x, p.y, p.z); normal.normalize(); normals.push(normal.x, normal.y, normal.z); uvs.push(j / radialSegments, t);
      if (i < segments && j < radialSegments) {
        const a = i * (radialSegments + 1) + j, b = a + radialSegments + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals(); return { geometry, curve };
}

export function createHands() {
  const group = new THREE.Group(); group.name = 'first-person-hands'; group.visible = false;
  const skinGrain = noiseTexture(256), linenWeave = noiseTexture(256, true);
  const skin = new THREE.MeshPhysicalMaterial({ color: '#bc8d6e', roughness: .69, bumpMap: skinGrain, bumpScale: .0022, sheen: .08, sheenColor: '#b98468' });
  const knuckleSkin = new THREE.MeshStandardMaterial({ color: '#b9896c', roughness: .74, bumpMap: skinGrain, bumpScale: .0017 });
  const nailMaterial = new THREE.MeshPhysicalMaterial({ color: '#c4a28b', roughness: .46, clearcoat: .12, clearcoatRoughness: .6 });
  const linen = new THREE.MeshStandardMaterial({ color: '#493a29', roughness: .99, bumpMap: linenWeave, bumpScale: .009 });
  const cuffMaterial = new THREE.MeshStandardMaterial({ color: '#352b20', roughness: .97, bumpMap: linenWeave, bumpScale: .006 });
  const creaseMaterial = new THREE.LineBasicMaterial({ color: '#78513d', transparent: true, opacity: .27 });

  function mesh(geometry, material, parent) {
    const object = new THREE.Mesh(geometry, material); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  }

  function buildHand(side) {
    const hand = new THREE.Group(); group.add(hand); hand.name = side < 0 ? 'left-hand' : 'right-hand';
    const palm = mesh(new THREE.SphereGeometry(1, 32, 24), skin, hand);
    palm.scale.set(.137, .213, .071); palm.position.set(0, .012, .015); palm.rotation.z = side * -.09;

    // The heel of the hand flows into an angled wrist and forearm.
    const wrist = taperedTube([[0, -.09, 0], [side * .025, -.25, .025], [side * .11, -.53, .12], [side * .19, -.73, .2]], [.086, .082, .096, .112], 24, 20, .82);
    mesh(wrist.geometry, skin, hand);
    const arm = taperedTube([[side * .11, -.47, .09], [side * .19, -.78, .22], [side * .34, -1.18, .41], [side * .52, -1.72, .68]], [.127, .154, .19, .22], 36, 24, .9);
    mesh(arm.geometry, linen, hand);
    const cuff = taperedTube([[side * .096, -.434, .082], [side * .12, -.50, .11], [side * .14, -.57, .14]], [.132, .132, .138], 12, 24, .91);
    mesh(cuff.geometry, cuffMaterial, hand);

    // Four differently proportioned fingers curve over the book's side.
    const lengths = [.30, .35, .32, .255];
    for (let i = 0; i < 4; i++) {
      const rootX = side * (-.093 + i * .061);
      const baseY = .135 - Math.abs(i - 1.35) * .016;
      const length = lengths[i];
      const radius = i === 3 ? .026 : .031;
      const points = [
        [rootX, baseY, .012],
        [rootX + side * .009, baseY + length * .36, .035],
        [rootX - side * .018, baseY + length * .68, .094],
        [rootX - side * .049, baseY + length * .80, .16],
        [rootX - side * .062, baseY + length * .73, .192],
      ];
      const finger = taperedTube(points, [radius * 1.03, radius, radius * .92, radius * .84, radius * .65, .004], 27, 14, .91);
      mesh(finger.geometry, skin, hand);

      const nail = mesh(new THREE.SphereGeometry(1, 16, 10), nailMaterial, hand);
      nail.scale.set(radius * .65, radius * .91, .0055);
      nail.position.set(rootX - side * .054, baseY + length * .761, .192);
      nail.rotation.x = -.22; nail.rotation.z = side * -.2;

      // Shallow irregular creases, without hard segmented rings.
      for (let k = 0; k < 2; k++) {
        const y = baseY + length * .38 + k * .009;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(rootX - radius * .6, y - .001, .062),
          new THREE.Vector3(rootX, y + .003, .067),
          new THREE.Vector3(rootX + radius * .6, y - .001, .062),
        ]);
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(9)), creaseMaterial); hand.add(line);
      }
    }

    // An opposable thumb rests on the cover and visibly supports its lower edge.
    const thumbPoints = [
      [-side * .071, -.07, .035], [-side * .142, -.015, .09],
      [-side * .19, .065, .17], [-side * .235, .105, .212], [-side * .26, .11, .214],
    ];
    const thumb = taperedTube(thumbPoints, [.06, .055, .043, .034, .023, .003], 28, 18, .9);
    mesh(thumb.geometry, skin, hand);
    const thenar = mesh(new THREE.SphereGeometry(1, 24, 18), knuckleSkin, hand);
    thenar.position.set(-side * .065, -.07, .035); thenar.scale.set(.082, .113, .057); thenar.rotation.z = side * .35;
    const thumbNail = mesh(new THREE.SphereGeometry(1, 20, 12), nailMaterial, hand);
    thumbNail.position.set(-side * .23, .107, .241); thumbNail.scale.set(.036, .025, .006); thumbNail.rotation.z = side * -.24;

    // Subtle tendons give the back of the hand a non-spherical silhouette.
    for (let i = 0; i < 3; i++) {
      const x = -.046 + i * .047;
      const tendon = taperedTube([[x * .5, -.16, .058], [x, -.05, .083], [x, .085, .067]], [.003, .004, .002], 12, 6);
      mesh(tendon.geometry, skin, hand);
    }
    return hand;
  }

  const left = buildHand(-1), right = buildHand(1);
  let reach = 0, opening = 0;

  function pose() {
    const r = THREE.MathUtils.clamp(reach, 0, 1);
    const o = THREE.MathUtils.clamp(opening, 0, 1);
    left.position.set(-.93 - o * .64 - (1 - r) * .13, -.76 - (1 - r) * 1.1 + o * .07, .035 + (1 - r) * .7 + o * .025);
    right.position.set(.93 + (1 - r) * .13, -.76 - (1 - r) * 1.1, .035 + (1 - r) * .7);
    left.rotation.set(o * -.04, o * .17, -.11 + o * .24);
    right.rotation.set(0, 0, .11);
  }

  function setReach(progress) { reach = progress; pose(); }
  function setOpen(progress) { opening = progress; pose(); }
  function update(time) {
    pose();
    if (reach > .99) {
      left.rotation.z += Math.sin(time * .65) * .002;
      right.rotation.z += Math.sin(time * .65 + .3) * .002;
    }
  }

  function dispose() {
    const geometries = new Set(), materials = new Set();
    group.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); skinGrain.dispose(); linenWeave.dispose();
  }
  pose();
  return { group, setReach, setOpen, update, dispose };
}
