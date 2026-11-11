import * as THREE from 'three';

// Procedural night sky dome with an aurora borealis. No textures: the whole sky is one
// fragment shader driven by the view direction, so it costs a single draw call.
// The aurora hangs over the north of the map (-Z in three.js, behind the fire) and
// reaches the zenith, so it appears as the viewer looks up.

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0., a = .5;
    for (int i = 0; i < OCT; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= .5; }
    return v;
  }

  // One curtain: a wavy ribbon at height 'base' above the horizon with vertical streaks.
  vec3 curtain(float az, float elev, float base, float seed, float t, vec3 low, vec3 high) {
    float wave = fbm(vec2(az * 1.6 + seed, t * .07 + seed)) * .55
               + sin(az * 2.3 + t * .11 + seed * 3.) * .09;
    float edge = base + wave * .55;                         // lower edge of the curtain (radians)
    float h = elev - edge;                                   // height above that edge
    float body = smoothstep(-.015, .03, h) * exp(-max(h, 0.) * 4.2);
    // Vertical rays: thin streaks in azimuth that drift slowly.
    float rays = fbm(vec2(az * 22. + seed * 9. + t * .05, t * .2 + seed));
    rays = mix(.45, 1.15, smoothstep(.25, .8, rays));
    float shimmer = .8 + .2 * sin(t * (1.1 + seed * .3) + az * 7.);
    float k = clamp(h * 2.2, 0., 1.);
    vec3 col = mix(low, high, smoothstep(0., 1., k));
    return col * body * rays * shimmer;
  }

  void main() {
    vec3 d = normalize(vDir);
    float elev = asin(clamp(d.y, -1., 1.));                 // 0 at horizon, PI/2 at zenith
    float az = atan(d.x, -d.z);                              // 0 = north (-Z), +/-PI = south
    float t = uTime;

    // Night sky: near-black blue, a touch lighter toward the horizon.
    vec3 sky = mix(vec3(.030, .038, .048), vec3(.004, .010, .030), smoothstep(0., 1.15, elev));

    // Stars (cell hash on the direction), dimmed where the aurora glows.
    vec3 sp = d * 150.;
    vec3 cell = floor(sp);
    float sh = hash3(cell);
    vec3 local = fract(sp) - .5;
    float star = step(.9925, sh) * smoothstep(.33, .0, length(local));
    star *= .55 + .45 * sin(t * (.8 + sh * 3.) + sh * 40.);
    star *= smoothstep(.02, .12, elev);

    // Aurora: stronger toward the north, still present overhead.
    float north = 1. - smoothstep(1.35, 2.7, abs(az));
    float overhead = smoothstep(.75, 1.25, elev);
    float mask = clamp(north + overhead * .75, 0., 1.);
    vec3 green = vec3(.12, 1.0, .46);
    vec3 teal = vec3(.10, .82, .92);
    vec3 violet = vec3(.62, .22, .95);
    vec3 pink = vec3(.95, .25, .62);
    vec3 aur = vec3(0.);
    aur += curtain(az, elev, .32, 1.3, t, green, teal * 1.1);
    aur += curtain(az + .7, elev, .50, 4.1, t * .9, green * .9, violet * 1.1) * .85;
    aur += curtain(az - .9, elev, .72, 7.7, t * 1.1, teal, pink) * .7;
    // Soft diffuse glow behind the curtains.
    float glow = exp(-pow((elev - .55) * 2.4, 2.)) * (.5 + .5 * fbm(vec2(az * 2. + 3., t * .04)));
    aur += vec3(.03, .22, .15) * glow * .45;
    aur *= mask * uIntensity * .95;

    vec3 color = sky + aur + vec3(star) * (1. - clamp(dot(aur, vec3(.5)) * 1.4, 0., .9)) * .9;
    gl_FragColor = vec4(color, 1.);
  }
`;

export function createAurora({ quality = 'high' } = {}) {
  const geometry = new THREE.SphereGeometry(80, 56, 28, 0, Math.PI * 2, 0, Math.PI / 2 + .12);
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uIntensity: { value: 1 } },
    defines: { OCT: quality === 'low' ? 3 : 4 },
    vertexShader, fragmentShader,
    side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'Aurora boreal';
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return {
    mesh,
    update(time, reduced = false) { material.uniforms.uTime.value = reduced ? 20 : time; },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
