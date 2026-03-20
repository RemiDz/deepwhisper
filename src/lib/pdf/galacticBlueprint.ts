import type { jsPDF as JsPDFType } from 'jspdf';
import type { Kin } from '../dreamspell/types';
import { SEALS } from '../dreamspell/seals';
import { TONES } from '../dreamspell/tones';
import { buildKin } from '../dreamspell/kin';
import { getOracle } from '../dreamspell/oracle';
import { getWavespellNumber, getWavespellSeal, getWavespellPosition } from '../dreamspell/wavespell';
import { getEarthFamily, getColourFamily } from '../dreamspell/earthFamilies';
import { getSealSound, getToneSound, getBestTimeOfDay } from '../dreamspell/soundHealing';
import { SEAL_DESCRIPTIONS, TONE_DESCRIPTIONS, COLOUR_DESCRIPTIONS, DIRECTION_DESCRIPTIONS } from '../dreamspell/descriptions';
import { CASTLES } from '../dreamspell/castles';

// ── Colours (BRIGHT MODE) ────────────────────────────────────────────────
const TEXT_DARK = '#1a1a2e';
const TEXT_MED  = '#5a5a6e';
const TEXT_LIGHT = '#8a8a9e';
const PURPLE = '#7c3aed';
const BG_CARD = '#f4f4f8';
const WHITE = '#ffffff';

const PW = 210; // page width mm
const PH = 297; // page height mm
const M = 20;   // margin
const CW = PW - M * 2; // content width = 170mm

// Seal chamber words for affirmation construction
const CHAMBER: Record<number, string> = {};
for (let i = 0; i < 4; i++) CHAMBER[i] = 'input';
for (let i = 4; i < 8; i++) CHAMBER[i] = 'store';
for (let i = 8; i < 12; i++) CHAMBER[i] = 'process';
for (let i = 12; i < 16; i++) CHAMBER[i] = 'output';
for (let i = 16; i < 20; i++) CHAMBER[i] = 'matrix';

function infinitive(verb: string): string {
  if (verb.endsWith('ies')) return verb.slice(0, -3) + 'y';
  if (verb.endsWith('es')) return verb.slice(0, -2) === '' ? verb.slice(0, -1) : verb.slice(0, -1).endsWith('s') ? verb.slice(0, -2) : verb.slice(0, -1);
  if (verb.endsWith('s')) return verb.slice(0, -1);
  return verb;
}

function gerund(verb: string): string {
  const v = verb.toLowerCase();
  if (v.endsWith('e') && !v.endsWith('ee')) return v.slice(0, -1) + 'ing';
  return v + 'ing';
}

function buildAffirmation(kin: Kin): string {
  const toneAction = kin.tone.action.toLowerCase();
  const sealAction = infinitive(kin.seal.action).toLowerCase();
  const tonePower = gerund(kin.tone.power);
  const sealEssence = kin.seal.essence.toLowerCase();
  const chamber = CHAMBER[kin.seal.number] ?? 'input';
  const sealPower = kin.seal.power.toLowerCase();
  const toneName = kin.tone.name.toLowerCase();
  const toneEssence = kin.tone.essence.toLowerCase();
  return `I ${toneAction} in order to ${sealAction}. ${tonePower.charAt(0).toUpperCase() + tonePower.slice(1)} ${sealEssence}, I seal the ${chamber} of ${sealPower} with the ${toneName} tone of ${toneEssence}.`;
}

// ── Image loading ─────────────────────────────────────────────────────────
async function loadSealImage(sealIndex: number): Promise<string> {
  const path = SEALS[sealIndex].iconPath;
  const resp = await fetch(path);
  const blob = await resp.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function preloadAllSeals(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  const promises = SEALS.map(async (seal) => {
    const data = await loadSealImage(seal.number);
    map.set(seal.number, data);
  });
  await Promise.all(promises);
  return map;
}

// ── Hex to RGB ────────────────────────────────────────────────────────────
function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

// ── Main generator ────────────────────────────────────────────────────────
export async function generateGalacticBlueprint(kin: Kin): Promise<JsPDFType> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const oracle = getOracle(kin);
  const wsNum = getWavespellNumber(kin.number);
  const wsSeal = getWavespellSeal(kin.number);
  const wsPos = getWavespellPosition(kin.number);
  const earthFamily = getEarthFamily(kin.seal.number);
  const colourFamily = getColourFamily(kin.seal.number);
  const sealSound = getSealSound(kin.seal.number);
  const toneSound = getToneSound(kin.tone.number);
  const affirmation = buildAffirmation(kin);
  const sealRgb = hexRgb(kin.seal.colourHex);
  const purpleRgb = hexRgb(PURPLE);

  // Preload all seal images
  const sealImages = await preloadAllSeals();

  // Light background colours for icons on white PDF
  const pdfIconBg: Record<string, string> = {
    Red: '#fee2e2',
    White: '#f1f0ed',
    Blue: '#dbeafe',
    Yellow: '#fef9c3',
  };

  const addSealImg = (sealIndex: number, x: number, y: number, size: number) => {
    const data = sealImages.get(sealIndex);
    if (!data) return;
    // Draw light coloured rounded rect behind icon
    const seal = SEALS[sealIndex];
    const bgColour = pdfIconBg[seal.colour] ?? '#f1f0ed';
    const pad = size * 0.08; // padding around icon
    const bgRgb = hexRgb(bgColour);
    doc.setFillColor(...bgRgb);
    doc.roundedRect(x - pad, y - pad, size + pad * 2, size + pad * 2, 2, 2, 'F');
    // Subtle border in seal colour
    const borderRgb = hexRgb(seal.colourHex);
    doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
    doc.setGState(doc.GState({ opacity: 0.3 }));
    doc.setLineWidth(0.3);
    doc.roundedRect(x - pad, y - pad, size + pad * 2, size + pad * 2, 2, 2, 'S');
    doc.setGState(doc.GState({ opacity: 1 }));
    // Place PNG on top
    doc.addImage(data, 'PNG', x, y, size, size);
  };

  // ── Helpers ───────────────────────────────────────────────────────────
  const footer = (pageNo: number) => {
    doc.setFontSize(8);
    doc.setTextColor(...hexRgb(TEXT_LIGHT));
    doc.text(`${pageNo}`, PW / 2, PH - 10, { align: 'center' });
    doc.text('deepwhisper.app', PW / 2, PH - 6, { align: 'center' });
  };

  const heading = (title: string, y: number, colour?: string): number => {
    const rgb = hexRgb(colour ?? PURPLE);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...rgb);
    doc.text(title.toUpperCase(), M, y);
    doc.setDrawColor(...rgb);
    doc.setLineWidth(0.4);
    doc.line(M, y + 3, M + CW, y + 3);
    return y + 12;
  };

  const body = (text: string, y: number, size?: number, maxW?: number): number => {
    doc.setFontSize(size ?? 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_DARK));
    const lines = doc.splitTextToSize(text, maxW ?? CW);
    doc.text(lines, M, y);
    return y + lines.length * (size ?? 12) * 0.45 + 2;
  };

  const bodyGrey = (text: string, y: number, size?: number): number => {
    doc.setFontSize(size ?? 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_MED));
    const lines = doc.splitTextToSize(text, CW);
    doc.text(lines, M, y);
    return y + lines.length * (size ?? 12) * 0.45 + 2;
  };

  const kvRow = (label: string, value: string, x: number, y: number, labelW?: number): number => {
    const lw = labelW ?? 30;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_MED));
    doc.text(label, x, y);
    doc.setTextColor(...hexRgb(TEXT_DARK));
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + lw, y);
    doc.setFont('helvetica', 'normal');
    return y + 6;
  };

  const cardBg = (x: number, y: number, w: number, h: number, colour?: string) => {
    const rgb = colour ? hexRgb(colour) : [244, 244, 248] as [number, number, number];
    doc.setFillColor(...rgb);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
  };

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 1: COVER
  // ═══════════════════════════════════════════════════════════════════════
  // Purple accent line at top
  doc.setFillColor(...purpleRgb);
  doc.rect(0, 0, PW, 3, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...purpleRgb);
  doc.text('G A L A C T I C   B L U E P R I N T', PW / 2, 35, { align: 'center' });

  // Seal icon — large, centred
  const coverIconSize = 40;
  const coverIconX = PW / 2 - coverIconSize / 2;
  // Coloured background square behind icon
  cardBg(coverIconX - 4, 48, coverIconSize + 8, coverIconSize + 8, kin.seal.bgHex);
  addSealImg(kin.seal.number, coverIconX, 52, coverIconSize);

  // Kin number
  doc.setFontSize(56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(TEXT_DARK));
  doc.text(String(kin.number), PW / 2, 120, { align: 'center' });

  // Full title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...sealRgb);
  doc.text(kin.title, PW / 2, 135, { align: 'center' });

  // Tone line
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexRgb(TEXT_MED));
  doc.text(`Tone ${kin.tone.number} — ${kin.tone.name}: ${kin.tone.action} · ${kin.tone.power} · ${kin.tone.essence}`, PW / 2, 148, { align: 'center' });

  // Affirmation
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexRgb(TEXT_MED));
  const affLines = doc.splitTextToSize(`"${affirmation}"`, CW - 20);
  doc.text(affLines, PW / 2, 165, { align: 'center' });

  // Info pills row
  const pillY = 190;
  const pills = [
    `${kin.seal.colour} — ${kin.seal.direction}`,
    kin.castle.name.replace('Castle of ', ''),
    `${wsSeal.name} Wavespell`,
  ];
  const pillW = CW / 3 - 4;
  pills.forEach((p, i) => {
    const px = M + i * (pillW + 6);
    cardBg(px, pillY, pillW, 10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_MED));
    doc.text(p, px + pillW / 2, pillY + 6.5, { align: 'center' });
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text(`deepwhisper.app · Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, PW / 2, PH - 15, { align: 'center' });

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 2: YOUR SOLAR SEAL
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  // Seal icon next to heading
  addSealImg(kin.seal.number, M, 18, 16);
  let y = 22;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...sealRgb);
  doc.text('YOUR SOLAR SEAL', M + 20, y);
  doc.setDrawColor(...sealRgb);
  doc.setLineWidth(0.4);
  doc.line(M, y + 3, M + CW, y + 3);
  y += 12;

  // Quick reference card
  cardBg(M, y, CW, 28);
  const qrY = y + 7;
  kvRow('Power:', kin.seal.power, M + 5, qrY);
  kvRow('Action:', kin.seal.action, M + 5, qrY + 7);
  kvRow('Essence:', kin.seal.essence, M + 5, qrY + 14);
  kvRow('Direction:', kin.seal.direction, M + CW / 2, qrY);
  kvRow('Colour:', kin.seal.colour, M + CW / 2, qrY + 7);
  y += 34;

  // Description
  const sealDesc = SEAL_DESCRIPTIONS[kin.seal.number] ?? '';
  y = body(sealDesc, y);
  y += 4;

  // Extended context
  y = body(`As a ${kin.seal.colour} seal, ${kin.seal.name} belongs to the ${kin.seal.direction}ern direction. ${COLOUR_DESCRIPTIONS[kin.seal.colour] ?? ''} ${DIRECTION_DESCRIPTIONS[kin.seal.direction] ?? ''}`, y);

  footer(2);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 3: YOUR GALACTIC TONE
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();

  // Tone number circle
  doc.setFillColor(...purpleRgb);
  doc.circle(M + 10, 27, 8, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(String(kin.tone.number), M + 10, 30, { align: 'center' });

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...purpleRgb);
  doc.text('YOUR GALACTIC TONE', M + 22, 30);
  doc.setDrawColor(...purpleRgb);
  doc.setLineWidth(0.4);
  doc.line(M, 33, M + CW, 33);
  y = 42;

  // Quick reference card
  cardBg(M, y, CW, 22);
  kvRow('Action:', kin.tone.action, M + 5, y + 7);
  kvRow('Power:', kin.tone.power, M + 5, y + 14);
  kvRow('Essence:', kin.tone.essence, M + CW / 2, y + 7);
  y += 28;

  // Question
  const toneDesc = TONE_DESCRIPTIONS[kin.tone.number] ?? '';
  const questionMatch = toneDesc.match(/"([^"]+)"/);
  if (questionMatch) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...purpleRgb);
    doc.text(`"${questionMatch[1]}"`, PW / 2, y, { align: 'center' });
    y += 10;
  }

  y = body(toneDesc, y);
  y += 6;

  // Affirmation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...hexRgb(TEXT_MED));
  const affLines2 = doc.splitTextToSize(`"${affirmation}"`, CW);
  doc.text(affLines2, M, y);
  y += affLines2.length * 5.4 + 4;

  // Bar-dot visual
  const bars = Math.floor(kin.tone.number / 5);
  const dots = kin.tone.number % 5;
  const bdX = PW / 2;
  let bdY = y + 5;
  doc.setFillColor(...purpleRgb);
  for (let b = 0; b < bars; b++) {
    doc.roundedRect(bdX - 15, bdY, 30, 3, 1, 1, 'F');
    bdY += 6;
  }
  for (let d = 0; d < dots; d++) {
    doc.circle(bdX - (dots - 1) * 5 / 2 + d * 5, bdY + 2, 1.5, 'F');
  }

  footer(3);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 4: YOUR FIFTH FORCE ORACLE
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = heading('YOUR FIFTH FORCE ORACLE', 25);

  y = bodyGrey('The oracle reveals five energies that shape your cosmic identity. Your destiny seal is at the centre, surrounded by four complementary forces that together form the Fifth Force.', y);
  y += 4;

  // Visual cross layout
  const crossCx = PW / 2;
  const crossCy = y + 40;
  const crossSpread = 38;
  const smallIcon = 14;
  const bigIcon = 22;

  // Guide (top)
  addSealImg(oracle.guide.number, crossCx - smallIcon / 2, crossCy - crossSpread - smallIcon / 2, smallIcon);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(oracle.guide.colourHex));
  doc.text(oracle.guide.name, crossCx, crossCy - crossSpread + smallIcon / 2 + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('Guide', crossCx, crossCy - crossSpread + smallIcon / 2 + 9, { align: 'center' });

  // Destiny (centre, large)
  cardBg(crossCx - bigIcon / 2 - 3, crossCy - bigIcon / 2 - 3, bigIcon + 6, bigIcon + 6, kin.seal.bgHex);
  addSealImg(kin.seal.number, crossCx - bigIcon / 2, crossCy - bigIcon / 2, bigIcon);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...sealRgb);
  doc.text(kin.seal.name, crossCx, crossCy + bigIcon / 2 + 7, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('Destiny', crossCx, crossCy + bigIcon / 2 + 11, { align: 'center' });

  // Antipode (left)
  addSealImg(oracle.antipode.number, crossCx - crossSpread - smallIcon / 2, crossCy - smallIcon / 2, smallIcon);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(oracle.antipode.colourHex));
  doc.text(oracle.antipode.name, crossCx - crossSpread, crossCy + smallIcon / 2 + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('Antipode', crossCx - crossSpread, crossCy + smallIcon / 2 + 9, { align: 'center' });

  // Analog (right)
  addSealImg(oracle.analog.number, crossCx + crossSpread - smallIcon / 2, crossCy - smallIcon / 2, smallIcon);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(oracle.analog.colourHex));
  doc.text(oracle.analog.name, crossCx + crossSpread, crossCy + smallIcon / 2 + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('Analog', crossCx + crossSpread, crossCy + smallIcon / 2 + 9, { align: 'center' });

  // Occult (bottom)
  addSealImg(oracle.occult.number, crossCx - smallIcon / 2, crossCy + crossSpread - smallIcon / 2, smallIcon);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(oracle.occult.colourHex));
  doc.text(oracle.occult.name, crossCx, crossCy + crossSpread + smallIcon / 2 + 5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('Occult', crossCx, crossCy + crossSpread + smallIcon / 2 + 9, { align: 'center' });

  // Connecting lines
  doc.setDrawColor(...hexRgb(TEXT_LIGHT));
  doc.setLineWidth(0.2);
  doc.line(crossCx, crossCy - bigIcon / 2 - 3, crossCx, crossCy - crossSpread + smallIcon / 2 + 2);
  doc.line(crossCx, crossCy + bigIcon / 2 + 3, crossCx, crossCy + crossSpread - smallIcon / 2 - 2);
  doc.line(crossCx - bigIcon / 2 - 3, crossCy, crossCx - crossSpread + smallIcon / 2 + 2, crossCy);
  doc.line(crossCx + bigIcon / 2 + 3, crossCy, crossCx + crossSpread - smallIcon / 2 - 2, crossCy);

  // Oracle descriptions below
  y = crossCy + crossSpread + 28;

  const oracleRoles: [string, typeof oracle.guide, string][] = [
    ['Guide', oracle.guide, 'shows you the way forward — the directing power above you.'],
    ['Analog', oracle.analog, 'is your supportive partner — the energy that walks beside you.'],
    ['Antipode', oracle.antipode, 'is your challenge — the power that tests and strengthens you.'],
    ['Occult', oracle.occult, 'is your hidden power — the unexpected gift from within.'],
  ];

  for (const [role, seal, desc] of oracleRoles) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexRgb(seal.colourHex));
    doc.text(`${role}: ${seal.colour} ${seal.name}`, M, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_DARK));
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(desc, CW);
    doc.text(descLines, M, y);
    y += descLines.length * 4.5 + 4;
  }

  footer(4);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 5: YOUR WAVESPELL
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  addSealImg(wsSeal.number, M, 18, 14);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexRgb(wsSeal.colourHex));
  doc.text(`${wsSeal.name.toUpperCase()} WAVESPELL`, M + 18, 28);
  doc.setDrawColor(...hexRgb(wsSeal.colourHex));
  doc.setLineWidth(0.4);
  doc.line(M, 31, M + CW, 31);
  y = 38;

  y = bodyGrey(`Wavespell ${wsNum} of 20 · Power of ${wsSeal.power} · Position ${wsPos} of 13`, y, 11);
  y += 2;

  y = body(`You are on day ${wsPos} of the ${wsSeal.name} Wavespell, a 13-day cycle initiated by the power of ${wsSeal.power}. The ${kin.tone.name} tone places you at the ${kin.tone.essence.toLowerCase()} stage — the moment of ${kin.tone.action.toLowerCase()}.`, y);
  y += 4;

  // Wavespell timeline: all 13 Kin
  const wsStartKin = (wsNum - 1) * 13 + 1;
  for (let i = 0; i < 13; i++) {
    const wk = buildKin(wsStartKin + i);
    const isMe = wk.number === kin.number;
    const tone = TONES[i];

    if (isMe) {
      const rgb = hexRgb(kin.seal.colourHex);
      doc.setFillColor(rgb[0], rgb[1], rgb[2], 0.08);
      cardBg(M, y - 3, CW, 9, `${kin.seal.colourHex}15`);
    }

    // Tone number
    doc.setFontSize(10);
    doc.setFont('helvetica', isMe ? 'bold' : 'normal');
    doc.setTextColor(...purpleRgb);
    doc.text(String(tone.number), M + 3, y + 3, { align: 'center' });

    // Seal icon
    addSealImg(wk.seal.number, M + 8, y - 2, 7);

    // Kin title
    doc.setFontSize(10);
    doc.setFont('helvetica', isMe ? 'bold' : 'normal');
    doc.setTextColor(...hexRgb(isMe ? wk.seal.colourHex : TEXT_DARK));
    doc.text(`${wk.title}`, M + 18, y + 3);

    // Kin number
    doc.setTextColor(...hexRgb(TEXT_LIGHT));
    doc.text(String(wk.number), M + CW - 3, y + 3, { align: 'right' });

    // Arrow for current position
    if (isMe) {
      doc.setTextColor(...sealRgb);
      doc.text('▸', M + CW - 12, y + 3);
    }

    y += 9;
    if (y > PH - 25) break;
  }

  footer(5);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 6: CASTLE + EARTH FAMILY
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = heading('YOUR CASTLE', 25);

  // Castle visual: 5 blocks
  const castleBlockW = CW / 5 - 2;
  const castleColours: Record<string, string> = { Red: '#ef4444', White: '#a0a0a0', Blue: '#3b82f6', Yellow: '#eab308', Green: '#22c55e' };
  CASTLES.forEach((c, i) => {
    const cx = M + i * (castleBlockW + 2.5);
    const isActive = c.number === kin.castle.number;
    const rgb = hexRgb(castleColours[c.colour] ?? '#888');
    if (isActive) {
      doc.setFillColor(...rgb);
    } else {
      doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    }
    doc.roundedRect(cx, y, castleBlockW, 8, 2, 2, 'F');
    if (!isActive) {
      // Overlay with white to fade
      doc.setFillColor(255, 255, 255);
      doc.setGState(doc.GState({ opacity: 0.75 }));
      doc.roundedRect(cx, y, castleBlockW, 8, 2, 2, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));
    }
    doc.setFontSize(7);
    doc.setTextColor(isActive ? 255 : 100, isActive ? 255 : 100, isActive ? 255 : 100);
    doc.text(c.quality, cx + castleBlockW / 2, y + 5.5, { align: 'center' });
  });
  y += 14;

  y = kvRow('Castle:', kin.castle.name, M, y);
  y = kvRow('Quality:', kin.castle.quality, M, y);
  y = kvRow('Kin range:', `${kin.castle.kinRange[0]}–${kin.castle.kinRange[1]}`, M, y);
  y += 2;
  y = body(`Your Kin falls within the ${kin.castle.name}. The castle of ${kin.castle.quality} frames your energy within its 52-day court — a period of ${kin.castle.quality.toLowerCase()} that shapes your galactic signature. There are five castles in the 260-day Tzolkin cycle, each containing four wavespells.`, y);
  y += 8;

  // Earth family section
  y = heading('YOUR EARTH FAMILY', y);

  // Family seal icons in a row
  earthFamily.sealIndices.forEach((si, i) => {
    addSealImg(si, M + i * 18, y, 12);
  });
  y += 18;

  y = kvRow('Family:', `${earthFamily.name} — ${earthFamily.role}`, M, y);
  y += 2;
  y = body(earthFamily.description, y);
  y += 2;
  y = body('The five Earth Families — Polar, Cardinal, Core, Signal, and Gateway — define your planetary service role. Each family contains four seals that share a common purpose in the evolution of consciousness.', y);

  footer(6);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 7: SONIC HEALING PROTOCOL
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  // Purple accent line
  doc.setFillColor(...purpleRgb);
  doc.rect(M, 20, CW, 1, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...purpleRgb);
  doc.text('YOUR SONIC HEALING PROTOCOL', M, 30);
  y = 38;

  y = bodyGrey('Based on sound healing traditions and chakra correspondences, your galactic signature has a unique sonic profile. This is your personalised prescription for alignment and healing.', y, 11);
  y += 4;

  // Main prescription card
  const cardColour = `${kin.seal.colourHex}12`;
  cardBg(M, y, CW, 58, BG_CARD);
  const cy2 = y + 8;
  // Frequency — LARGE
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...sealRgb);
  doc.text(`${sealSound.frequency} Hz`, M + 8, cy2 + 2);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexRgb(TEXT_MED));
  doc.text(sealSound.note, M + 8, cy2 + 10);

  let ky = cy2 + 18;
  kvRow('Chakra:', sealSound.chakra, M + 8, ky);
  kvRow('Quality:', sealSound.quality, M + 8, ky + 7);
  kvRow('Instruments:', sealSound.instruments.join(', '), M + 8, ky + 14);
  kvRow('Duration:', `${sealSound.duration} minutes`, M + CW / 2, ky);
  kvRow('Body focus:', sealSound.bodyArea, M + CW / 2, ky + 7);
  kvRow('Best time:', getBestTimeOfDay(kin.seal.direction), M + CW / 2, ky + 14);
  y += 64;

  // Tone interval card
  cardBg(M, y, CW, 24, BG_CARD);
  kvRow('Tone interval:', `${toneSound.interval} (${toneSound.ratio})`, M + 8, y + 8);
  kvRow('Quality:', toneSound.quality, M + 8, y + 15);
  kvRow('Bowl note:', toneSound.bowlNote, M + CW / 2, y + 8);
  y += 30;

  // Resonance callout
  cardBg(M, y, CW, 16, '#7c3aed');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const resText = `Combine ${sealSound.frequency} Hz with the ${toneSound.interval} (${toneSound.ratio}) for your galactic resonance`;
  doc.text(resText, PW / 2, y + 10, { align: 'center' });
  y += 22;

  footer(7);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 8: DAILY PRACTICE GUIDE
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = heading('DAILY PRACTICE GUIDE', 25);

  y = bodyGrey('Follow this step-by-step protocol for deep galactic alignment:', y, 11);
  y += 4;

  const steps = [
    `Find a quiet, comfortable space at ${getBestTimeOfDay(kin.seal.direction).toLowerCase()}.`,
    `Set your intention with the affirmation: "${affirmation}"`,
    `Begin with 3 deep breaths, focusing awareness on your ${sealSound.bodyArea.toLowerCase()}.`,
    `Play or listen to ${sealSound.frequency} Hz (${sealSound.note}) for ${sealSound.duration} minutes.`,
    `If using instruments: ${sealSound.instruments[0].toLowerCase()} tuned to ${sealSound.note} is ideal. ${sealSound.instruments.length > 1 ? `${sealSound.instruments[1]} can be used as an alternative.` : ''}`,
    `Visualise the colour ${kin.seal.colour.toLowerCase()} filling your ${sealSound.chakra.toLowerCase()} chakra.`,
    'Close with gratitude and sit in silence for 2 minutes.',
  ];

  steps.forEach((step, i) => {
    // Step number circle
    doc.setFillColor(...purpleRgb);
    doc.circle(M + 5, y + 1, 4, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), M + 5, y + 3, { align: 'center' });

    // Step text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexRgb(TEXT_DARK));
    const stepLines = doc.splitTextToSize(step, CW - 18);
    doc.text(stepLines, M + 14, y + 3);
    y += stepLines.length * 5.5 + 6;
  });

  y += 6;
  // Weekly schedule
  cardBg(M, y, CW, 20, BG_CARD);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...purpleRgb);
  doc.text('Weekly Practice', M + 8, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexRgb(TEXT_DARK));
  doc.text(`For deepest alignment, practise daily at ${getBestTimeOfDay(kin.seal.direction).toLowerCase()}. Minimum: 3 sessions per week.`, M + 8, y + 14);
  y += 26;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...purpleRgb);
  doc.text('Track your daily Kin and sonic alignment at deepwhisper.app', PW / 2, y, { align: 'center' });

  footer(8);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 9: THE GALACTIC YEAR
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();
  y = heading('THE GALACTIC YEAR', 25);

  y = body('The 13 Moon calendar year runs from July 26 to July 24, with July 25 as the Day Out of Time. Each year is coded by a Year Bearer Kin that sets the tone for the entire cycle.', y);
  y += 4;
  y = body('Your galactic signature is eternal — it does not change from year to year. However, the yearly energy interacts with your personal Kin to create unique annual themes and opportunities for growth. The interplay between your fixed signature and the changing year energy reveals new facets of your cosmic identity.', y);
  y += 4;
  y = body('The 52-year cycle (a "Calendar Round") completes when every possible Year Bearer has been experienced. This grand cycle marks a complete circuit of galactic learning.', y);
  y += 6;

  cardBg(M, y, CW, 14, BG_CARD);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...purpleRgb);
  doc.text('Track your daily alignment at deepwhisper.app', PW / 2, y + 9, { align: 'center' });

  footer(9);

  // ═══════════════════════════════════════════════════════════════════════
  // PAGE 10: CLOSING
  // ═══════════════════════════════════════════════════════════════════════
  doc.addPage();

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...purpleRgb);
  doc.text('This Galactic Blueprint was generated by', PW / 2, 80, { align: 'center' });

  doc.setFontSize(24);
  doc.text('Deep Whisper', PW / 2, 95, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexRgb(TEXT_MED));
  doc.text('13 Moon Galactic Calendar', PW / 2, 108, { align: 'center' });
  doc.text('Part of the Harmonic Waves ecosystem', PW / 2, 116, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(...hexRgb(TEXT_DARK));
  doc.text('deepwhisper.app', PW / 2, 135, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(...hexRgb(TEXT_MED));
  const genDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`Generated on ${genDate}`, PW / 2, 150, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexRgb(TEXT_LIGHT));
  doc.text('The Dreamspell calendar was created by Jose Arguelles and Lloydine Burris Arguelles', PW / 2, 170, { align: 'center' });
  doc.text('as a tool for synchronising with natural time and galactic consciousness.', PW / 2, 177, { align: 'center' });

  footer(10);

  return doc;
}
