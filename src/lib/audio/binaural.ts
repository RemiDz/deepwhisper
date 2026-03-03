export interface BinauralNodes {
  left: OscillatorNode;
  right: OscillatorNode;
  merger: ChannelMergerNode;
  gainLeft: GainNode;
  gainRight: GainNode;
  masterGain: GainNode;
}

export function createBinaural(
  ctx: AudioContext,
  binauralFreq: number,
  carrierFreq: number = 200
): BinauralNodes {
  const merger = ctx.createChannelMerger(2);
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.15;

  const left = ctx.createOscillator();
  left.type = 'sine';
  left.frequency.value = carrierFreq;

  const right = ctx.createOscillator();
  right.type = 'sine';
  right.frequency.value = carrierFreq + binauralFreq;

  const gainLeft = ctx.createGain();
  gainLeft.gain.value = 1;
  const gainRight = ctx.createGain();
  gainRight.gain.value = 1;

  left.connect(gainLeft);
  right.connect(gainRight);
  gainLeft.connect(merger, 0, 0);
  gainRight.connect(merger, 0, 1);
  merger.connect(masterGain);
  masterGain.connect(ctx.destination);

  left.start();
  right.start();

  return { left, right, merger, gainLeft, gainRight, masterGain };
}

export const binauralPresets: Record<string, number> = {
  theta: 6,
  alpha: 10,
  delta: 2,
};
