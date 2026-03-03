import { HealingFrequency } from '@/types/session';

export interface FrequencyNodes {
  oscillator: OscillatorNode;
  gain: GainNode;
  tremoloOsc: OscillatorNode;
  tremoloGain: GainNode;
}

export const healingFreqDescriptions: Record<HealingFrequency, string> = {
  432: 'Natural tuning, harmony',
  528: 'Transformation, DNA repair',
  396: 'Liberation from fear',
  639: 'Connection, relationships',
};

export function createHealingFrequency(ctx: AudioContext, freq: HealingFrequency): FrequencyNodes {
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;

  const gain = ctx.createGain();
  gain.gain.value = 0.08;

  // Tremolo LFO for warmth
  const tremoloOsc = ctx.createOscillator();
  tremoloOsc.type = 'sine';
  tremoloOsc.frequency.value = 0.2;
  const tremoloGain = ctx.createGain();
  tremoloGain.gain.value = 0.008; // depth 0.1 of base gain
  tremoloOsc.connect(tremoloGain);
  tremoloGain.connect(gain.gain);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  tremoloOsc.start();

  return { oscillator, gain, tremoloOsc, tremoloGain };
}
