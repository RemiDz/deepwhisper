export function drawFlowerOfLife(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string = 'rgba(196, 161, 255, 0.08)',
  lineWidth: number = 1,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Central circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 6 surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Outer ring of 12
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = cx + Math.cos(angle) * radius * 1.732;
    const y = cy + Math.sin(angle) * radius * 1.732;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawMandala(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  color: string = 'rgba(196, 161, 255, 0.08)',
  lineWidth: number = 1,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Concentric circles
  for (let r = maxRadius * 0.1; r <= maxRadius; r += maxRadius * 0.12) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Petal shapes
  const rings = 5;
  for (let ring = 1; ring <= rings; ring++) {
    const petals = 6 + ring * 2;
    const r = (maxRadius * ring) / rings;
    for (let p = 0; p < petals; p++) {
      const angle = (p * Math.PI * 2) / petals;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.15, r * 0.4, angle, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function renderTextAlongCircle(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number = 14,
  color: string = 'rgba(232, 230, 240, 0.035)',
) {
  ctx.save();
  ctx.font = `${fontSize}px "DM Sans", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fullText = (text + '  ').repeat(Math.ceil((2 * Math.PI * radius) / (text.length * fontSize * 0.6)));
  const chars = fullText.split('');
  const angleStep = (2 * Math.PI) / chars.length;

  for (let i = 0; i < chars.length; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

export function drawMetatronsCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string = 'rgba(196, 161, 255, 0.06)',
  lineWidth: number = 0.5,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // 13 circles of Metatron's Cube
  const points: [number, number][] = [[cx, cy]];

  // Inner ring of 6
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }

  // Outer ring of 6
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6;
    points.push([cx + Math.cos(angle) * radius * 1.732, cy + Math.sin(angle) * radius * 1.732]);
  }

  // Draw circles at each point
  for (const [px, py] of points) {
    ctx.beginPath();
    ctx.arc(px, py, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Connect all points with lines
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ctx.beginPath();
      ctx.moveTo(points[i][0], points[i][1]);
      ctx.lineTo(points[j][0], points[j][1]);
      ctx.stroke();
    }
  }

  ctx.restore();
}
