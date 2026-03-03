import { AmbientType } from '@/types/session';
import { createNoise } from './noise';

export interface AmbientNodes {
  nodes: AudioNode[];
  sources: AudioBufferSourceNode[];
  oscillators: OscillatorNode[];
  gain: GainNode;
}

export function createAmbient(ctx: AudioContext, type: AmbientType): AmbientNodes | null {
  if (type === 'silence') return null;

  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  const nodes: AudioNode[] = [masterGain];
  const sources: AudioBufferSourceNode[] = [];
  const oscillators: OscillatorNode[] = [];

  switch (type) {
    case 'rain': {
      // Primary rain: white noise → bandpass
      const noise = createNoise(ctx, 'white');
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 800;
      bandpass.Q.value = 0.5;
      const ampGain = ctx.createGain();
      ampGain.gain.value = 0.4;
      // Amplitude modulation for natural patter
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.12;
      lfo.connect(lfoGain);
      lfoGain.connect(ampGain.gain);
      noise.connect(bandpass);
      bandpass.connect(ampGain);
      ampGain.connect(masterGain);
      lfo.start();
      noise.start();
      sources.push(noise);
      oscillators.push(lfo);
      nodes.push(bandpass, ampGain, lfoGain);

      // Secondary sizzle: white noise → highpass
      const sizzle = createNoise(ctx, 'white');
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 3000;
      const sizzleGain = ctx.createGain();
      sizzleGain.gain.value = 0.08;
      sizzle.connect(highpass);
      highpass.connect(sizzleGain);
      sizzleGain.connect(masterGain);
      sizzle.start();
      sources.push(sizzle);
      nodes.push(highpass, sizzleGain);

      masterGain.gain.value = 0.4;
      break;
    }
    case 'ocean': {
      const noise = createNoise(ctx, 'brown');
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 400;
      const ampGain = ctx.createGain();
      ampGain.gain.value = 0.4;
      // LFO for wave swell: 0.08Hz sine controlling gain 0.2-0.6
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.2;
      lfo.connect(lfoGain);
      lfoGain.connect(ampGain.gain);
      noise.connect(lowpass);
      lowpass.connect(ampGain);
      ampGain.connect(masterGain);
      lfo.start();
      noise.start();
      sources.push(noise);
      oscillators.push(lfo);
      nodes.push(lowpass, ampGain, lfoGain);

      masterGain.gain.value = 0.5;
      break;
    }
    case 'forest': {
      // Pink noise → bandpass for ambient base
      const noise = createNoise(ctx, 'pink');
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1000;
      bandpass.Q.value = 0.5;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.15;
      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start();
      sources.push(noise);
      nodes.push(bandpass, noiseGain);

      // Bird-like pings: occasional sine at random frequencies
      const createPing = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const pingGain = ctx.createGain();
        pingGain.gain.value = 0;
        osc.connect(pingGain);
        pingGain.connect(masterGain);
        osc.start();
        oscillators.push(osc);
        nodes.push(pingGain);

        // Schedule pings with randomised intervals — stops when AudioContext is closed
        const schedulePing = () => {
          if (ctx.state === 'closed') return;
          const now = ctx.currentTime;
          const interval = 3 + Math.random() * 5;
          pingGain.gain.setValueAtTime(0, now + interval);
          pingGain.gain.linearRampToValueAtTime(0.05, now + interval + 0.02);
          pingGain.gain.exponentialRampToValueAtTime(0.001, now + interval + 0.15);
          pingGain.gain.setValueAtTime(0, now + interval + 0.16);
          setTimeout(schedulePing, (interval + 0.2) * 1000);
        };
        setTimeout(schedulePing, delay * 1000);
      };
      createPing(2800 + Math.random() * 1000, 1);
      createPing(3500 + Math.random() * 1500, 2.5);

      masterGain.gain.value = 0.3;
      break;
    }
    case 'bowls': {
      // 432Hz + harmonics with tremolo and detune
      const freqs = [432, 864, 1296];
      const gains = [0.2, 0.06, 0.03];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const oscGain = ctx.createGain();
        oscGain.gain.value = gains[idx];

        // Tremolo
        const tremolo = ctx.createOscillator();
        tremolo.type = 'sine';
        tremolo.frequency.value = 0.3;
        const tremoloGain = ctx.createGain();
        tremoloGain.gain.value = gains[idx] * 0.3;
        tremolo.connect(tremoloGain);
        tremoloGain.connect(oscGain.gain);

        // Detune wobble
        const detuneLfo = ctx.createOscillator();
        detuneLfo.type = 'sine';
        detuneLfo.frequency.value = 0.1;
        const detuneGain = ctx.createGain();
        detuneGain.gain.value = 2;
        detuneLfo.connect(detuneGain);
        detuneGain.connect(osc.frequency);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        tremolo.start();
        detuneLfo.start();
        oscillators.push(osc, tremolo, detuneLfo);
        nodes.push(oscGain, tremoloGain, detuneGain);
      });

      masterGain.gain.value = 0.35;
      break;
    }
    case 'drone': {
      // Layered sines at 68, 136, 204 Hz with detuning and breathing
      const freqs = [68, 136, 204];
      const gains = [0.25, 0.15, 0.1];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq + (Math.random() - 0.5);
        const oscGain = ctx.createGain();
        oscGain.gain.value = gains[idx];

        // Very slow breathing LFO
        const breathLfo = ctx.createOscillator();
        breathLfo.type = 'sine';
        breathLfo.frequency.value = 0.02;
        const breathGain = ctx.createGain();
        breathGain.gain.value = gains[idx] * 0.3;
        breathLfo.connect(breathGain);
        breathGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        breathLfo.start();
        oscillators.push(osc, breathLfo);
        nodes.push(oscGain, breathGain);
      });

      masterGain.gain.value = 0.4;
      break;
    }
  }

  return { nodes, sources, oscillators, gain: masterGain };
}

/** Play a 3-second preview of an ambient type, returns a stop function */
export function previewAmbient(type: AmbientType): (() => void) | null {
  if (type === 'silence') return null;
  const ctx = new AudioContext();
  const ambient = createAmbient(ctx, type);
  if (!ambient) { ctx.close(); return null; }

  // Auto-stop after 3 seconds with fade
  const stopTimeout = setTimeout(() => {
    ambient.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    setTimeout(() => {
      ambient.sources.forEach(s => { try { s.stop(); } catch {} });
      ambient.oscillators.forEach(o => { try { o.stop(); } catch {} });
      ctx.close();
    }, 600);
  }, 2500);

  return () => {
    clearTimeout(stopTimeout);
    ambient.sources.forEach(s => { try { s.stop(); } catch {} });
    ambient.oscillators.forEach(o => { try { o.stop(); } catch {} });
    ctx.close();
  };
}
