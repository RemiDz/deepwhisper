import { BinauralPreset } from '@/types';

export interface BinauralNodes {
  left: OscillatorNode;
  right: OscillatorNode;
  masterGain: GainNode;
}

const BINAURAL_FREQS: Record<Exclude<BinauralPreset, 'off'>, number> = {
  theta: 6,
  alpha: 10,
  delta: 2,
};

export function createBinaural(ctx: BaseAudioContext, preset: Exclude<BinauralPreset, 'off'>, carrierFreq: number = 200): BinauralNodes {
  const beatFreq = BINAURAL_FREQS[preset];
  const merger = ctx.createChannelMerger(2);
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.15;
  merger.connect(masterGain);
  masterGain.connect(ctx.destination);

  const left = ctx.createOscillator();
  left.type = 'sine';
  left.frequency.value = carrierFreq;
  const leftGain = ctx.createGain();
  leftGain.gain.value = 1;
  left.connect(leftGain);
  leftGain.connect(merger, 0, 0);

  const right = ctx.createOscillator();
  right.type = 'sine';
  right.frequency.value = carrierFreq + beatFreq;
  const rightGain = ctx.createGain();
  rightGain.gain.value = 1;
  right.connect(rightGain);
  rightGain.connect(merger, 0, 1);

  left.start();
  right.start();

  return { left, right, masterGain };
}

export function getBinauralHz(preset: BinauralPreset): number {
  if (preset === 'off') return 0;
  return BINAURAL_FREQS[preset];
}
