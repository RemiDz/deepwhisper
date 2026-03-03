export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  buffer: AudioBuffer | Float32Array,
  width: number,
  height: number,
  color: string = '#4A3AFF',
  barWidth: number = 2,
  gap: number = 1,
) {
  const data = buffer instanceof Float32Array ? buffer : buffer.getChannelData(0);
  const totalBars = Math.floor(width / (barWidth + gap));
  const samplesPerBar = Math.floor(data.length / totalBars);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = color;

  for (let i = 0; i < totalBars; i++) {
    let sum = 0;
    const start = i * samplesPerBar;
    for (let j = 0; j < samplesPerBar; j++) {
      sum += Math.abs(data[start + j] || 0);
    }
    const avg = sum / samplesPerBar;
    const barHeight = Math.max(2, avg * height * 2);
    const x = i * (barWidth + gap);
    const y = (height - barHeight) / 2;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
}

export function drawWaveformAnimated(
  ctx: CanvasRenderingContext2D,
  analyser: AnalyserNode,
  width: number,
  height: number,
  color: string = '#4A3AFF',
): number {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    analyser.getByteTimeDomainData(dataArray);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    return requestAnimationFrame(draw);
  };

  return draw();
}
