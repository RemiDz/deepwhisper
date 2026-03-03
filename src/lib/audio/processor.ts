import { dbToGain } from '../utils';

export async function speedUpBuffer(buffer: AudioBuffer, speed: number): Promise<AudioBuffer> {
  const newLength = Math.ceil(buffer.length / speed);
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, newLength, buffer.sampleRate);
  const source = offCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = speed;
  source.connect(offCtx.destination);
  source.start();
  return offCtx.startRendering();
}

export function reverseBuffer(buffer: AudioBuffer): AudioBuffer {
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const reversed = offCtx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const input = buffer.getChannelData(ch);
    const output = reversed.getChannelData(ch);
    for (let i = 0; i < buffer.length; i++) {
      output[i] = input[buffer.length - 1 - i];
    }
  }
  return reversed;
}

export async function reduceVolume(buffer: AudioBuffer, db: number): Promise<AudioBuffer> {
  const gain = dbToGain(db);
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const source = offCtx.createBufferSource();
  source.buffer = buffer;
  const gainNode = offCtx.createGain();
  gainNode.gain.value = gain;
  source.connect(gainNode);
  gainNode.connect(offCtx.destination);
  source.start();
  return offCtx.startRendering();
}

export async function ultrasonicShift(buffer: AudioBuffer, carrierHz: number): Promise<AudioBuffer> {
  const offCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const source = offCtx.createBufferSource();
  source.buffer = buffer;

  const carrier = offCtx.createOscillator();
  carrier.frequency.value = carrierHz;

  const modGain = offCtx.createGain();
  modGain.gain.value = 0;
  carrier.connect(modGain.gain);

  source.connect(modGain);
  modGain.connect(offCtx.destination);

  source.start();
  carrier.start();

  return offCtx.startRendering();
}

export function concatenateBuffers(ctx: BaseAudioContext, buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length === 0) throw new Error('No buffers to concatenate');
  if (buffers.length === 1) return buffers[0];

  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const numChannels = buffers[0].numberOfChannels;
  const sampleRate = buffers[0].sampleRate;
  const result = ctx.createBuffer(numChannels, totalLength, sampleRate);

  let offset = 0;
  for (const buf of buffers) {
    for (let ch = 0; ch < numChannels; ch++) {
      result.getChannelData(ch).set(buf.getChannelData(ch), offset);
    }
    offset += buf.length;
  }
  return result;
}

export async function processAffirmations(
  buffer: AudioBuffer,
  techniques: Set<string>,
  speedMultiplier: number,
  volumeDb: number,
  ultrasonicHz: number,
): Promise<AudioBuffer> {
  let processed = buffer;

  if (techniques.has('speed')) {
    processed = await speedUpBuffer(processed, speedMultiplier);
  }
  if (techniques.has('reverse')) {
    processed = reverseBuffer(processed);
  }
  if (techniques.has('volume')) {
    processed = await reduceVolume(processed, volumeDb);
  }
  if (techniques.has('ultrasonic')) {
    processed = await ultrasonicShift(processed, ultrasonicHz);
  }

  return processed;
}
