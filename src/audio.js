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

  async function toggle() {
    if (disposed) return false;
    const token = ++revision;
    clearTimers();
    if (enabled) {
      enabled = false;
      smoothGain(master, 0, .035);
      suspendTimer = setTimeout(() => {
        suspendTimer = null;
        if (!enabled) context?.suspend().catch(() => {});
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
    if (!visible() || !enabled) {
      try { await context.suspend(); } catch { /* A closing context needs no action. */ }
    } else if (enabled) {
      try {
        await context.resume();
        if (enabled && !disposed && visible()) scheduleCrackle();
      } catch { /* A browser may require the next explicit user gesture. */ }
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  return {
    toggle,
    isEnabled: () => enabled,
    setReading(value) {
      reading = Boolean(value);
      smoothGain(ambience, reading ? .2 : 1, .65);
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
