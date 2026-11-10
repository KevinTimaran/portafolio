import * as THREE from 'three';

// Local CC0 scanned surfaces and seeded geometry make revisiting the clearing
// feel like returning to the same place, rather than generating a different forest.
function randomSequence(seed = 1481) {
  return () => { seed = Math.imul(1664525, seed) + 1013904223 | 0; return (seed >>> 0) / 4294967296; };
}
const fract = n => n - Math.floor(n);
const hash = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), u), THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), u), v);
}

function surfaceTexture(type, renderer, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');
  const pixels = context.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const fine = hash(x, y), broad = noise(x / 49, y / 49), mid = noise(x / 9, y / 9);
    let rgb;
    if (type === 'bark') {
      const ridge = Math.pow(Math.abs(Math.sin(x * .19 + noise(x / 42, y / 70) * 5 + noise(x / 12, y / 26) * .65)), .42);
      const crack = noise(x / 4, y / 34);
      const value = 22 + ridge * 46 + broad * 20 + mid * 15 + fine * 12 - (crack < .22 ? 19 : 0);
      rgb = [value * .99, value * .79, value * .57];
    } else if (type === 'wood') {
      const dx = x - size * .51, dy = y - size * .48;
      const radius = Math.hypot(dx * 1.04, dy) + noise(x / 70, y / 70) * 13;
      const ring = Math.pow(Math.abs(Math.sin(radius * .38)), .45);
      const value = 63 + ring * 34 + fine * 14 + broad * 20;
      const angle = Math.atan2(dy, dx);
      const crack = Math.abs(Math.sin(angle * 6 + radius * .0009)) < .014 && radius > 76 ? .35 : 1;
      rgb = [value * 1.12 * crack, value * .84 * crack, value * .51 * crack];
    } else if (type === 'stone') {
      const value = 40 + broad * 48 + mid * 27 + fine * 18;
      const moss = noise(x / 80 + 12, y / 70) > .64 ? .8 : 1;
      rgb = [value * .88 * moss, value * .86, value * .69 * moss];
    } else {
      const value = 21 + broad * 25 + mid * 18 + fine * 17;
      const speck = fine > .989 ? 25 : 0;
      rgb = [value * 1.1 + speck, value * .83 + speck, value * .51 + speck];
    }
    pixels.data[i] = rgb[0]; pixels.data[i + 1] = rgb[1]; pixels.data[i + 2] = rgb[2]; pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() || 4, 8);
  return texture;
}

function cylinderBetween(start, end, radius, dummy, topRatio = 1) {
  const direction = end.clone().sub(start);
  dummy.position.copy(start).add(end).multiplyScalar(.5);
  dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  dummy.scale.set(radius, direction.length(), radius * topRatio);
  dummy.updateMatrix();
  return dummy.matrix;
}

const flameVertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const flameFragment = `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
  }
  float fbm(vec2 p) { return noise(p)*.55 + noise(p*2.13)*.28 + noise(p*4.16)*.14; }
  void main() {
    float t = uTime;
    vec2 uv=vUv;
    float y=uv.y;
    float turbulence=fbm(vec2(uv.x*8.+uSeed,y*6.-t*3.8));
    float sway=(noise(vec2(y*4.4-t*2.2,uSeed))-0.5)*y*.64;
    float x=(uv.x-.5+sway)*2.;
    float taper=pow(max(0.,1.-y),1.1);
    float edge=abs(x)/max(.02,taper);
    float body=1.-smoothstep(.15,.8,edge + (turbulence-.5)*1.75);
    float tongues=fbm(vec2(uv.x*12.+uSeed,y*5.5-t*4.1));
    float heightFade=1.-smoothstep(.18+ .68*tongues,.98,y);
    float a=body*heightFade*smoothstep(0.,.08,y)*.68;
    a*=smoothstep(.18,.43,turbulence+body*.2);
    float core=pow(max(0.,1.-edge),2.)*pow(1.-y,1.8);
    vec3 color=mix(vec3(.75,.055,.003),vec3(1.7,.52,.025),body*.75);
    color=mix(color,vec3(2.0,1.15,.21),core*.8);
    gl_FragColor=vec4(color,a);
  }
`;

export function createEnvironment({ renderer, quality = 'high' } = {}) {
  const random = randomSequence();
  const group = new THREE.Group();
  group.name = 'El claro junto a la lumbre';
  const resources = new Set();
  const register = item => { resources.add(item); return item; };
  const loader = new THREE.TextureLoader();
  const textureLoads = [];
  function scannedTexture(name, repeatX, repeatY, color = false) {
    let finish;
    textureLoads.push(new Promise(resolve => { finish = resolve; }));
    const texture = register(loader.load(`/assets/textures/${name}_1k.jpg`, () => finish(true), undefined, () => finish(false)));
    texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() || 4, 8);
    return texture;
  }
  const textures = {
    bark: scannedTexture('bark_brown_02_diff', 2, 7, true),
    barkNormal: scannedTexture('bark_brown_02_nor_gl', 2, 7),
    barkRough: scannedTexture('bark_brown_02_rough', 2, 7),
    earth: scannedTexture('forest_ground_04_diff', 30, 30, true),
    earthNormal: scannedTexture('forest_ground_04_nor_gl', 30, 30),
    earthRough: scannedTexture('forest_ground_04_rough', 30, 30),
    stone: scannedTexture('rock_boulder_dry_diff', 1, 1, true),
    stoneNormal: scannedTexture('rock_boulder_dry_nor_gl', 1, 1),
    stoneRough: scannedTexture('rock_boulder_dry_rough', 1, 1),
    wood: register(surfaceTexture('wood', renderer)),
  };
  const barkMat = register(new THREE.MeshStandardMaterial({ map: textures.bark, normalMap: textures.barkNormal, normalScale: new THREE.Vector2(.9, .9), roughnessMap: textures.barkRough, roughness: 1, color: 0xc6bdb0 }));
  const woodMat = register(new THREE.MeshStandardMaterial({ map: textures.wood, bumpMap: textures.wood, bumpScale: .018, roughness: .88 }));
  const rockMat = register(new THREE.MeshStandardMaterial({ map: textures.stone, normalMap: textures.stoneNormal, normalScale: new THREE.Vector2(.8, .8), roughnessMap: textures.stoneRough, roughness: 1, color: 0xaaa59a }));
  const groundMat = register(new THREE.MeshStandardMaterial({ map: textures.earth, normalMap: textures.earthNormal, normalScale: new THREE.Vector2(1.25, 1.25), roughnessMap: textures.earthRough, roughness: 1, color: 0xb8afa0 }));

  const groundGeometry = register(new THREE.PlaneGeometry(90, 90, 130, 130));
  groundGeometry.rotateX(-Math.PI / 2);
  const groundVertices = groundGeometry.attributes.position;
  for (let i = 0; i < groundVertices.count; i++) {
    const x = groundVertices.getX(i), z = groundVertices.getZ(i);
    const distance = Math.hypot(x, z);
    const slope = Math.min(1, Math.max(0, distance - 4) / 12);
    groundVertices.setY(i, -.045 + (noise(x * .38 + 20, z * .38 + 20) - .5) * .14 + slope * (noise(x * .07 + 15, z * .07 + 19) * 2.3));
  }
  groundGeometry.computeVertexNormals();
  const ground = new THREE.Mesh(groundGeometry, groundMat);
  ground.receiveShadow = true;
  group.add(ground);

  const hemi = new THREE.HemisphereLight(0xb6ad94, 0x35291d, .82);
  group.add(hemi);
  const nightLight = new THREE.DirectionalLight(0xb9b4a1, .75);
  nightLight.position.set(-8, 14, -10);
  group.add(nightLight);
  const firePosition = new THREE.Vector3(-.65, .14, -.5);
  const fireLight = new THREE.PointLight(0xffa550, 16, 16, 2);
  fireLight.position.copy(firePosition).add(new THREE.Vector3(0, .6, 0));
  fireLight.castShadow = quality !== 'low';
  fireLight.shadow.mapSize.set(quality === 'high' ? 1024 : 512, quality === 'high' ? 1024 : 512);
  fireLight.shadow.camera.near = .12;
  fireLight.shadow.camera.far = 16;
  fireLight.shadow.bias = -.001;
  fireLight.shadow.normalBias = .035;
  group.add(fireLight);
  const warmBounce = new THREE.PointLight(0xe3bc84, 6, 9, 2);
  warmBounce.position.set(.6, 1.7, 3.1);
  group.add(warmBounce);

  // A thick, rooted stump is a functional surface for the resting book.
  const stumpGeometry = register(new THREE.CylinderGeometry(.46, .55, .55, 64, 12));
  const stumpPos = stumpGeometry.attributes.position;
  for (let i = 0; i < stumpPos.count; i++) {
    const x = stumpPos.getX(i), y = stumpPos.getY(i), z = stumpPos.getZ(i);
    const angle = Math.atan2(z, x);
    const protrusion = 1 + Math.sin(angle * 7 + .7) * .035 + Math.cos(angle * 13) * .022;
    stumpPos.setXYZ(i, x * protrusion, y, z * protrusion);
  }
  stumpGeometry.computeVertexNormals();
  const stumpMat = register(barkMat.clone());
  for (const key of ['map','normalMap','roughnessMap']) {
    stumpMat[key] = register(barkMat[key].clone());
    stumpMat[key].repeat.set(2, .6);
  }
  const stump = new THREE.Mesh(stumpGeometry, [stumpMat, woodMat, stumpMat]);
  stump.position.set(1.25, .275, 2.3);
  stump.castShadow = stump.receiveShadow = true;
  group.add(stump);

  const branchGeometry = register(new THREE.CylinderGeometry(.58, 1, 1, 12, 6));
  const trunkGeometry = register(new THREE.CylinderGeometry(.65, 1, 1, 24, 24));
  const trunkPositions = trunkGeometry.attributes.position;
  for (let i = 0; i < trunkPositions.count; i++) {
    const x = trunkPositions.getX(i), y = trunkPositions.getY(i), z = trunkPositions.getZ(i);
    const angle = Math.atan2(z, x);
    const ridge = 1 + Math.sin(angle * 8 + y * 7) * .065 + Math.cos(angle * 13 - y * 4) * .025;
    trunkPositions.setXYZ(i, x * ridge + Math.sin(y * 4) * .035, y, z * ridge);
  }
  trunkGeometry.computeVertexNormals();
  const treeCount = quality === 'low' ? 55 : 105;
  const trees = new THREE.InstancedMesh(trunkGeometry, barkMat, treeCount);
  const branches = new THREE.InstancedMesh(branchGeometry, barkMat, treeCount * 7 + 8);
  const dummy = new THREE.Object3D();
  let branchIndex = 0;
  for (let i = 0; i < treeCount; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 5.0 + random() * 27;
    const tx = Math.sin(angle) * radius, tz = Math.cos(angle) * radius - 3;
    const height = 7 + random() * 9;
    const width = .13 + random() * .32;
    const rootY = Math.max(0, (noise(tx * .07 + 15, tz * .07 + 19) * 2.3) * Math.min(1, Math.max(0, Math.hypot(tx,tz) - 4) / 12) - .05);
    dummy.position.set(tx, height / 2 + rootY, tz);
    dummy.rotation.set((random()-.5)*.09,random()*6.28,(random()-.5)*.07);
    dummy.scale.set(width, height, width);
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
    trees.setColorAt(i, new THREE.Color().setRGB(.66 + random() * .23, .63 + random() * .2, .52 + random() * .16));
    for (let b = 0; b < 7; b++) {
      const theta = random() * Math.PI * 2;
      const level = b < 3 ? .08 : .45 + random() * .4;
      const start = new THREE.Vector3(tx, height * level + rootY, tz);
      const length = b < 3 ? width * 3 : 1.4 + random() * 2;
      const end = new THREE.Vector3(tx + Math.cos(theta) * length, b < 3 ? rootY + .05 : start.y + .55 + random(), tz + Math.sin(theta) * length);
      branches.setMatrixAt(branchIndex++, cylinderBetween(start, end, b < 3 ? width * .5 : width * .35, dummy));
    }
  }
  // Roots emerging at the base of the reading stump.
  for (let i = 0; i < 8; i++) {
    const angle = i / 8 * Math.PI * 2;
    const end = new THREE.Vector3(1.25 + Math.cos(angle) * (.63 + random() * .2), .015, 2.3 + Math.sin(angle) * (.63 + random() * .2));
    branches.setMatrixAt(branchIndex++, cylinderBetween(new THREE.Vector3(1.25 + Math.cos(angle) * .3,.16,2.3 + Math.sin(angle) * .3),end,.085,dummy));
  }
  trees.castShadow = branches.castShadow = true;
  trees.receiveShadow = branches.receiveShadow = true;
  group.add(trees, branches);

  // Individual leaves and reed blades have thin profiles; no cone-shaped trees.
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0,0);
  leafShape.quadraticCurveTo(-.12,.28,0,.52);
  leafShape.quadraticCurveTo(.12,.28,0,0);
  const leafGeometry = register(new THREE.ShapeGeometry(leafShape, 3));
  const leafMat = register(new THREE.MeshStandardMaterial({ color: 0x555337, side: THREE.DoubleSide, roughness: .97 }));
  const leafCount = quality === 'low' ? 750 : 1600;
  const leaves = new THREE.InstancedMesh(leafGeometry, leafMat, leafCount);
  for (let i = 0; i < leafCount; i++) {
    const radius = 3.8 + random() * 25, angle = random() * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * radius, 6.5 + random() * 8, Math.sin(angle) * radius - 3);
    dummy.rotation.set(random()*6.28,random()*6.28,random()*6.28);
    const scale = .7 + random() * 2.2;
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    leaves.setMatrixAt(i,dummy.matrix);
  }
  group.add(leaves);

  const grassGeometry = register(new THREE.PlaneGeometry(.025, .44, 1, 4));
  const grassPos = grassGeometry.attributes.position;
  for (let i=0;i<grassPos.count;i++) {
    const h=grassPos.getY(i)+.22;
    grassPos.setXYZ(i,grassPos.getX(i)*(1-h/.5),h,Math.pow(h,2)*.8);
  }
  grassGeometry.computeVertexNormals();
  const grassMat = register(new THREE.MeshStandardMaterial({color:0x4e4b2b,roughness:1,side:THREE.DoubleSide}));
  const grassCount = quality==='low' ? 1100 : 2500;
  const grass = new THREE.InstancedMesh(grassGeometry,grassMat,grassCount);
  for (let i=0;i<grassCount;i++) {
    const angle=random()*6.28, radius=2.4 + Math.pow(random(),.7)*13;
    const gx=Math.cos(angle)*radius, gz=Math.sin(angle)*radius-1;
    const groundHeight=Math.max(0,(noise(gx*.07+15,gz*.07+19)*2.3)*Math.min(1,Math.max(0,Math.hypot(gx,gz)-4)/12)-.04);
    dummy.position.set(gx,groundHeight,gz);
    dummy.rotation.set((random()-.5)*.3,random()*6.28,(random()-.5)*.4);
    const scale=.3+random()*.8; dummy.scale.set(scale,scale,scale);
    dummy.updateMatrix(); grass.setMatrixAt(i,dummy.matrix);
    grass.setColorAt(i,new THREE.Color().setRGB(.65+random()*.25,.63+random()*.2,.43+random()*.2));
  }
  grass.receiveShadow=true;
  group.add(grass);

  // Fallen leaves, pebbles and twigs interrupt the ground plane at human scale.
  const rockGeometry = register(new THREE.SphereGeometry(1,32,24));
  const rockPositions=rockGeometry.attributes.position;
  for(let i=0;i<rockPositions.count;i++) {
    const x=rockPositions.getX(i),y=rockPositions.getY(i),z=rockPositions.getZ(i);
    const variation=.88+noise(x*2+3,z*2+7)*.15+noise(y*3+3,x*3+2)*.09;
    rockPositions.setXYZ(i,x*variation,y*(.75+noise(x*2+1,z*3+8)*.15),z*variation);
  }
  rockGeometry.computeVertexNormals();
  const rocks=new THREE.InstancedMesh(rockGeometry,rockMat,95);
  for(let i=0;i<95;i++) {
    let x,z,scale;
    if(i<14) {
      const angle=i/14*6.28;
      x=firePosition.x+Math.cos(angle)*.67;
      z=firePosition.z+Math.sin(angle)*.56;
      scale=.14+random()*.06;
    } else {
      x=(random()-.5)*17; z=(random()-.5)*13;
      scale=.025+random()*.095;
    }
    dummy.position.set(x,scale*.42,z); dummy.rotation.set(random()*2,random()*6.28,random()*2);
    dummy.scale.set(scale*(1.2+random()*.45),scale*(.8+random()*.45),scale);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);
  }
  rocks.castShadow=rocks.receiveShadow=true;group.add(rocks);
  const fallenLeafMat=register(new THREE.MeshStandardMaterial({color:0x8c6540,roughness:1,side:THREE.DoubleSide}));
  const fallenLeaves=new THREE.InstancedMesh(leafGeometry,fallenLeafMat,450);
  for(let i=0;i<450;i++) {
    dummy.position.set((random()-.5)*9,.008+random()*.014,(random()-.5)*9+1);
    dummy.rotation.set(-Math.PI/2+(random()-.5)*.3,0,random()*6.28);
    const scale=.12+random()*.2;dummy.scale.set(scale,scale,scale);dummy.updateMatrix();fallenLeaves.setMatrixAt(i,dummy.matrix);
    fallenLeaves.setColorAt(i,new THREE.Color().setRGB(.6+random()*.4,.48+random()*.35,.3+random()*.3));
  }
  fallenLeaves.receiveShadow=true;group.add(fallenLeaves);

  const charMat=register(new THREE.MeshStandardMaterial({map:stumpMat.map,normalMap:stumpMat.normalMap,normalScale:new THREE.Vector2(1.2,1.2),color:0x30231b,roughness:.97}));
  const logGeometry=register(new THREE.CylinderGeometry(.085,.12,1.05,28,8));
  const logGroup=new THREE.Group();logGroup.position.copy(firePosition);logGroup.position.y=.15;
  for(let i=0;i<6;i++) {
    const log=new THREE.Mesh(logGeometry,[charMat,woodMat,woodMat]);
    log.rotation.set(Math.PI/2,0,i/6*Math.PI+ .2);
    log.position.set(Math.cos(i*2)*.09,i*.015,Math.sin(i*2)*.08);
    log.castShadow=log.receiveShadow=true;logGroup.add(log);
  }
  group.add(logGroup);
  const coalMaterial=register(new THREE.MeshStandardMaterial({color:0x2d160b,emissive:0xe5520b,emissiveIntensity:1.5,roughness:1}));
  const coals=new THREE.InstancedMesh(rockGeometry,coalMaterial,38);
  for(let i=0;i<38;i++) {
    const a=random()*6.28,r=Math.sqrt(random())*.42;
    dummy.position.set(firePosition.x+Math.cos(a)*r,.07,firePosition.z+Math.sin(a)*r);
    dummy.rotation.set(random()*3,random()*3,random()*3);dummy.scale.set(.035+random()*.05,.025,.035+random()*.06);dummy.updateMatrix();coals.setMatrixAt(i,dummy.matrix);
  }
  group.add(coals);

  const flames=[];
  const flameGeometry=register(new THREE.PlaneGeometry(1,1,1,1));
  for(let i=0;i<7;i++) {
    const material=register(new THREE.ShaderMaterial({
      vertexShader:flameVertex,fragmentShader:flameFragment,
      uniforms:{uTime:{value:0},uSeed:{value:i*5.18}},
      transparent:true,depthWrite:false,side:THREE.DoubleSide,
      blending:THREE.NormalBlending,toneMapped:false,
    }));
    const flame=new THREE.Mesh(flameGeometry,material);
    const height=i<2?.91:.48+random()*.28;
    flame.position.set(firePosition.x+(random()-.5)*.38,.14+height/2,firePosition.z+(random()-.5)*.3);
    flame.scale.set(i<2?.44:.3,height,1);
    flame.rotation.y=i/7*Math.PI;
    flame.renderOrder=2;
    group.add(flame);flames.push(flame);
  }

  const sparkCount=quality==='low'?40:85;
  const sparkPositions=new Float32Array(sparkCount*3);
  const sparkColors=new Float32Array(sparkCount*3);
  const sparkSeeds=Array.from({length:sparkCount},()=>({offset:random()*7,speed:.3+random()*.8,angle:random()*6.28,radius:.03+random()*.2}));
  const sparkGeometry=register(new THREE.BufferGeometry());
  sparkGeometry.setAttribute('position',new THREE.BufferAttribute(sparkPositions,3));
  sparkGeometry.setAttribute('color',new THREE.BufferAttribute(sparkColors,3));
  const sparkMaterial=register(new THREE.ShaderMaterial({
    vertexShader:`attribute vec3 color;varying vec3 vColor;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(12./-mv.z,1.,5.);}`,
    fragmentShader:`varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vColor,(1.-smoothstep(.05,.5,d))*.8);}`,
    transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,
  }));
  const sparks=new THREE.Points(sparkGeometry,sparkMaterial);group.add(sparks);
  const smokeCount=18;
  const smokeGeometry=register(new THREE.BufferGeometry());
  const smokePositions=new Float32Array(smokeCount*3);
  const smokeAges=new Float32Array(smokeCount);
  smokeGeometry.setAttribute('position',new THREE.BufferAttribute(smokePositions,3));
  smokeGeometry.setAttribute('age',new THREE.BufferAttribute(smokeAges,1));
  const smokeMaterial=register(new THREE.ShaderMaterial({
    uniforms:{uResolution:{value:Math.min(window.innerHeight,1200)}},
    vertexShader:`attribute float age;varying float vAge;uniform float uResolution;void main(){vAge=age;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(.3+age*.55)*uResolution/-mv.z;}`,
    fragmentShader:`varying float vAge;void main(){float d=length((gl_PointCoord-.5)*2.);float a=(1.-smoothstep(.05,1.,d))*.035*sin(vAge*3.14159);gl_FragColor=vec4(.22,.20,.16,a);}`,
    transparent:true,depthWrite:false,
  }));
  const smoke=new THREE.Points(smokeGeometry,smokeMaterial);smoke.renderOrder=1;group.add(smoke);

  const starPositions=new Float32Array(180*3);
  for(let i=0;i<180;i++) {
    const az=random()*6.28,elevation=.2+random()*1.2;
    starPositions[i*3]=Math.cos(az)*Math.cos(elevation)*65;
    starPositions[i*3+1]=Math.sin(elevation)*65;
    starPositions[i*3+2]=Math.sin(az)*Math.cos(elevation)*65;
  }
  const starGeometry=register(new THREE.BufferGeometry());starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const starMat=register(new THREE.PointsMaterial({color:0xb3a78b,size:.047,transparent:true,opacity:.48,depthWrite:false,fog:false}));
  group.add(new THREE.Points(starGeometry,starMat));

  return {
    group, fireLight, ready: Promise.all(textureLoads),
    update(time, delta) {
      const flicker=1+Math.sin(time*8.3)*.065+Math.sin(time*13.7)*.045+Math.sin(time*4.1)*.04;
      fireLight.intensity=16*flicker;
      fireLight.position.x=firePosition.x+Math.sin(time*3)*.035;
      fireLight.position.y=.74+Math.sin(time*6.7)*.035;
      coalMaterial.emissiveIntensity=1.35+flicker*.25;
      flames.forEach((flame,i)=>{flame.material.uniforms.uTime.value=time;flame.scale.x=(i<2?.44:.3)*(1+Math.sin(time*3.5+i)*.08);});
      for(let i=0;i<sparkCount;i++) {
        const seed=sparkSeeds[i],life=((time*seed.speed+seed.offset)%4)/4;
        const swirl=seed.angle+life*1.4;
        sparkPositions[i*3]=firePosition.x+Math.cos(swirl)*(seed.radius+life*.45)+Math.sin(time+seed.offset)*life*.12;
        sparkPositions[i*3+1]=.2+life*(2.4+seed.speed);
        sparkPositions[i*3+2]=firePosition.z+Math.sin(swirl)*(seed.radius+life*.3);
        const glow=(1-life)*Math.min(1,life*15);
        sparkColors[i*3]=2.4*glow;sparkColors[i*3+1]=.75*glow;sparkColors[i*3+2]=.08*glow;
      }
      sparkGeometry.attributes.position.needsUpdate=true;sparkGeometry.attributes.color.needsUpdate=true;
      for(let i=0;i<smokeCount;i++) {
        const life=((time*.13+i/smokeCount)%1);
        smokePositions[i*3]=firePosition.x+life*.65+Math.sin(life*8+i)*life*.15;
        smokePositions[i*3+1]=.6+life*4.1;
        smokePositions[i*3+2]=firePosition.z-life*.6;
        smokeAges[i]=life;
      }
      smokeGeometry.attributes.position.needsUpdate=true;smokeGeometry.attributes.age.needsUpdate=true;
    },
    dispose() {
      for(const resource of resources) resource.dispose?.();
      group.traverse(child=>{if(child.isInstancedMesh)child.dispose();});
      fireLight.dispose();
      group.clear();
    },
  };
}
