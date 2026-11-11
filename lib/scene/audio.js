/** A quiet, locally synthesized fire. Audio starts only after the visitor opts in. */
export function createAmbience() {
  let context = null;
  let master = null;
  let ambience = null;
  let enabled = false;
  let reading = false;
  let disposed = false;
  let popTimer = null;
  let suspendTimer = null;
  let revision = 0;
  let noiseBuffer = null;
  const loops = [];
  const transientSources = new Set();
  const persistentNodes = [];

  const visible = () => document.visibilityState !== 'hidden';
  const canPlay = () => enabled && !disposed && visible() && context?.state === 'running';
  const clearTimers = () => {
    if (popTimer !== null) clearTimeout(popTimer);
    if (suspendTimer !== null) clearTimeout(suspendTimer);
    popTimer = suspendTimer = null;
  };
  const smoothGain = (node, value, seconds = .12) => {
    if (!context || !node) return;
    const now = context.currentTime;
    node.gain.cancelScheduledValues(now);
    node.gain.setTargetAtTime(value, now, seconds);
  };

  function makeNoise(seconds, brown = false) {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate);
    const samples = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < samples.length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + white * .02) / 1.02;
        samples[i] = last * 3.5;
      } else samples[i] = white;
    }
    return buffer;
  }

  function addLoop(buffer, frequency, gainValue, filterType) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = .45;
    const gain = context.createGain();
    gain.gain.value = gainValue;
    source.connect(filter).connect(gain).connect(ambience);
    source.start();
    loops.push(source);
    persistentNodes.push(filter, gain);
  }

  function initialize() {
    if (context) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || disposed) return false;
    try {
      context = new AudioContextClass();
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      ambience = context.createGain();
      ambience.gain.value = reading ? .2 : 1;
      ambience.connect(master);
      noiseBuffer = makeNoise(3.17);
      addLoop(noiseBuffer, 640, .06, 'lowpass');
      addLoop(makeNoise(4.73, true), 190, .045, 'lowpass');
      return true;
    } catch {
      context?.close?.().catch(() => {});
      context = null;
      master = ambience = null;
      return false;
    }
  }

  function finishSource(source, nodes) {
    transientSources.add(source);
    source.onended = () => {
      transientSources.delete(source);
      source.disconnect();
      for (const node of nodes) node.disconnect();
    };
  }

  function noiseGesture({ duration = .2, gain = .08, frequency = 900, highpass = 80, attack = .025, pitch = 1, destination = master } = {}) {
    if (!canPlay()) return;
    const now = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.playbackRate.value = pitch;
    const low = context.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(frequency, now);
    low.frequency.exponentialRampToValueAtTime(Math.max(100, frequency * .48), now + duration);
    const high = context.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = highpass;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(.0001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(.0002, gain), now + attack);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.connect(high).connect(low).connect(envelope).connect(destination);
    finishSource(source, [high, low, envelope]);
    source.start(now, Math.random());
    source.stop(now + duration + .025);
  }

  function thud(gain = .11, duration = .23) {
    if (!canPlay()) return;
    const now = context.currentTime;
    const source = context.createOscillator();
    const envelope = context.createGain();
    source.type = 'sine';
    source.frequency.setValueAtTime(96, now);
    source.frequency.exponentialRampToValueAtTime(38, now + duration);
    envelope.gain.setValueAtTime(.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + .012);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.connect(envelope).connect(master);
    finishSource(source, [envelope]);
    source.start(now);
    source.stop(now + duration + .02);
  }

  function scheduleCrackle() {
    if (popTimer !== null || !canPlay()) return;
    popTimer = setTimeout(() => {
      popTimer = null;
      if (!canPlay()) return;
      noiseGesture({
        duration: .018 + Math.random() * .07,
        gain: .012 + Math.random() * .045,
        frequency: 1100 + Math.random() * 1400,
        highpass: 440,
        attack: .002,
        destination: ambience,
      });
      scheduleCrackle();
    }, 110 + Math.random() * 520);
  }


  // ---------------------------------------------------------------- jazz radio (all synthesized)
  const BPM = 74, BEAT = 60 / BPM, SWING = BEAT * 2 / 3;
  const PROGRESSIONS = [
    [{ pc: 2, iv: [0, 3, 7, 10] }, { pc: 7, iv: [0, 4, 7, 10] }, { pc: 0, iv: [0, 4, 7, 11] }, { pc: 9, iv: [0, 4, 7, 10] }],
    [{ pc: 4, iv: [0, 3, 7, 10] }, { pc: 9, iv: [0, 4, 7, 10] }, { pc: 2, iv: [0, 3, 7, 10] }, { pc: 7, iv: [0, 4, 7, 10] }],
  ];
  let jazzOn = false, jazzBus = null, jazzTimer = null, jazzNext = 0, jazzBeat = 0, jazzMelodyUntil = 0, jazzLast = 72;
  const mtof = m => 440 * 2 ** ((m - 69) / 12);
  const bassMidi = pc => 36 + ((pc + 12) % 12);
  const near = (pc, around) => around + ((((pc - around) % 12) + 18) % 12) - 6;

  function ensureJazzBus() {
    if (jazzBus) return;
    jazzBus = context.createGain();
    jazzBus.gain.value = 0;
    const hp = context.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 120;
    const lp = context.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
    const body = context.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 900; body.gain.value = 3; body.Q.value = .7;
    const reverb = context.createConvolver();
    const len = Math.floor(context.sampleRate * 1.9), ir = context.createBuffer(2, len, context.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    reverb.buffer = ir;
    const wet = context.createGain(); wet.gain.value = .22;
    jazzBus.connect(hp).connect(body).connect(lp).connect(context.destination);
    lp.connect(reverb).connect(wet).connect(context.destination);
    persistentNodes.push(jazzBus, hp, body, lp, reverb, wet);
  }

  function voice(type, freq, t, dur, { gain = .05, attack = .01, cutoff = 2400, vibrato = 0 } = {}) {
    const osc = context.createOscillator(); osc.type = type; osc.frequency.value = freq;
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = cutoff; filter.Q.value = .6;
    const env = context.createGain();
    env.gain.setValueAtTime(.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + attack);
    env.gain.exponentialRampToValueAtTime(.0001, t + dur);
    const nodes = [filter, env];
    if (vibrato) {
      const lfo = context.createOscillator(); lfo.frequency.value = 5.2;
      const depth = context.createGain(); depth.gain.value = vibrato;
      lfo.connect(depth).connect(osc.detune); lfo.start(t); lfo.stop(t + dur + .05);
      nodes.push(depth); finishSource(lfo, []);
    }
    osc.connect(filter).connect(env).connect(jazzBus);
    finishSource(osc, nodes);
    osc.start(t); osc.stop(t + dur + .05);
  }

  function drumNoise(t, { dur = .06, gain = .02, high = 5000, low = 9000 } = {}) {
    const src = context.createBufferSource(); src.buffer = noiseBuffer;
    const hp = context.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = high;
    const lp = context.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = low;
    const env = context.createGain();
    env.gain.setValueAtTime(.0001, t); env.gain.exponentialRampToValueAtTime(gain, t + .003); env.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(hp).connect(lp).connect(env).connect(jazzBus);
    finishSource(src, [hp, lp, env]);
    src.start(t, Math.random() * 2); src.stop(t + dur + .02);
  }

  function jazzStep(t) {
    const bar = Math.floor(jazzBeat / 4), beat = jazzBeat % 4;
    const prog = PROGRESSIONS[Math.floor(bar / 4) % PROGRESSIONS.length];
    const chord = prog[bar % 4], next = prog[(bar + 1) % 4];
    // Walking bass
    const root = bassMidi(chord.pc);
    const approach = bassMidi(next.pc) + (Math.random() < .5 ? 1 : -1);
    const line = [root, root + chord.iv[1], root + chord.iv[2], approach];
    voice('triangle', mtof(line[beat]), t, BEAT * .92, { gain: .13, attack: .012, cutoff: 700 });
    // Ride, brushed hi-hat, feathered kick
    drumNoise(t, { dur: .12, gain: .014, high: 6000, low: 11000 });
    if (beat === 1 || beat === 3) {
      drumNoise(t + SWING, { dur: .09, gain: .011, high: 6500, low: 11000 });
      drumNoise(t, { dur: .045, gain: .018, high: 3500, low: 7000 });
    }
    if (beat === 0) {
      const k = context.createOscillator(), e = context.createGain();
      k.frequency.setValueAtTime(90, t); k.frequency.exponentialRampToValueAtTime(42, t + .18);
      e.gain.setValueAtTime(.0001, t); e.gain.exponentialRampToValueAtTime(.05, t + .01); e.gain.exponentialRampToValueAtTime(.0001, t + .2);
      k.connect(e).connect(jazzBus); finishSource(k, [e]); k.start(t); k.stop(t + .22);
    }
    // Electric-piano comping (rootless voicing), Charleston-ish rhythm
    const hit = (offset, probability) => {
      if (Math.random() > probability) return;
      const at = t + offset;
      [chord.iv[1], chord.iv[3], chord.iv[2], 14].forEach((iv, i) => {
        const f = mtof(near((chord.pc + iv) % 12, 64 + i * 2.4));
        voice('triangle', f, at + i * .012, BEAT * 1.6, { gain: .028, attack: .006, cutoff: 3200 });
        voice('sine', f * 2, at + i * .012, BEAT * .8, { gain: .009, attack: .004, cutoff: 5000 });
      });
    };
    if (beat === 0) hit(0, .85);
    if (beat === 1) hit(SWING, .6);
    if (beat === 3 && Math.random() < .35) hit(0, 1);
    // Lazy sax-like melody
    if (t >= jazzMelodyUntil && Math.random() < .55) {
      const pool = [...chord.iv, 14, 9];
      const pc = (chord.pc + pool[Math.floor(Math.random() * pool.length)]) % 12;
      const m = Math.max(64, Math.min(81, near(pc, jazzLast))); jazzLast = m;
      const start = t + (Math.random() < .4 ? SWING : 0), dur = BEAT * (.7 + Math.random() * 1.3);
      voice('sawtooth', mtof(m), start, dur, { gain: .034, attack: .07, cutoff: 1500, vibrato: 9 });
      jazzMelodyUntil = start + dur * .9;
    }
    jazzBeat++;
  }

  function jazzTick() {
    if (!jazzOn || !context || context.state !== 'running') return;
    while (jazzNext < context.currentTime + .4) { jazzStep(jazzNext); jazzNext += BEAT; }
  }

  async function toggleJazz() {
    if (disposed) return false;
    if (jazzOn) {
      jazzOn = false;
      smoothGain(jazzBus, 0, .25);
      if (jazzTimer !== null) { clearInterval(jazzTimer); jazzTimer = null; }
      setTimeout(() => { if (!enabled && !jazzOn) context?.suspend().catch(() => {}); }, 700);
      return false;
    }
    if (!initialize()) return false;
    try { await context.resume(); } catch { return false; }
    if (context.state !== 'running') return false;
    ensureJazzBus();
    jazzOn = true; jazzBeat = 0; jazzMelodyUntil = 0;
    jazzNext = context.currentTime + .15;
    smoothGain(jazzBus, reading ? .3 : 1, .6);
    jazzTick();
    jazzTimer = setInterval(jazzTick, 100);
    return true;
  }

  async function toggle() {
    if (disposed) return false;
    const token = ++revision;
    clearTimers();
    if (enabled) {
      enabled = false;
      smoothGain(master, 0, .035);
      suspendTimer = setTimeout(() => {
        suspendTimer = null;
        if (!enabled && !jazzOn) context?.suspend().catch(() => {});
      }, 180);
      return false;
    }
    if (!initialize()) return false;
    enabled = true;
    try {
      await context.resume();
      if (disposed || token !== revision) return enabled;
      enabled = context.state === 'running';
      if (!enabled) return false;
      smoothGain(master, .8, .18);
      if (visible()) scheduleCrackle();
      else await context.suspend();
      return enabled;
    } catch {
      if (token === revision) enabled = false;
      return false;
    }
  }

  async function onVisibility() {
    clearTimers();
    if (!context || disposed) return;
    if (!visible() || (!enabled && !jazzOn)) {
      try { await context.suspend(); } catch { /* A closing context needs no action. */ }
    } else if (enabled || jazzOn) {
      try {
        await context.resume();
        if (jazzOn) jazzNext = Math.max(jazzNext, context.currentTime + .1);
        if (enabled && !disposed && visible()) scheduleCrackle();
      } catch { /* A browser may require the next explicit user gesture. */ }
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  return {
    toggle,
    toggleJazz,
    isJazz: () => jazzOn,
    isEnabled: () => enabled,
    setReading(value) {
      reading = Boolean(value);
      smoothGain(ambience, reading ? .2 : 1, .65);
      smoothGain(jazzBus, reading ? .3 : 1, .65);
    },
    grab() {
      thud(.075, .27);
      noiseGesture({ duration: .5, gain: .075, frequency: 530, highpass: 110, attack: .07, pitch: .7 });
    },
    open() {
      noiseGesture({ duration: .7, gain: .11, frequency: 760, highpass: 160, attack: .16, pitch: .64 });
    },
    page() {
      noiseGesture({ duration: .38, gain: .075, frequency: 3400, highpass: 820, attack: .09, pitch: .9 });
    },
    putDown() {
      thud(.13, .3);
      noiseGesture({ duration: .17, gain: .075, frequency: 640, highpass: 80, attack: .012, pitch: .7 });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      enabled = false;
      revision++;
      clearTimers();
      if (jazzTimer !== null) clearInterval(jazzTimer);
      jazzOn = false;
      document.removeEventListener('visibilitychange', onVisibility);
      for (const source of [...loops, ...transientSources]) {
        try { source.stop(); } catch { /* An already-ended source is harmless. */ }
        source.disconnect();
      }
      transientSources.clear();
      for (const node of persistentNodes) node.disconnect();
      master?.disconnect();
      ambience?.disconnect();
      context?.close().catch(() => {});
    },
  };
}
