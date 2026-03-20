import type { jsPDF as JsPDFType } from 'jspdf';
import type { Kin, Oracle } from '../dreamspell/types';
import { SEALS } from '../dreamspell/seals';
import { TONES } from '../dreamspell/tones';
import { getOracle } from '../dreamspell/oracle';
import { getWavespellNumber, getWavespellSeal, getWavespellPosition } from '../dreamspell/wavespell';
import { getEarthFamily, getColourFamily } from '../dreamspell/earthFamilies';
import { getSealSound, getToneSound, getBestTimeOfDay } from '../dreamspell/soundHealing';
import { SEAL_DESCRIPTIONS, TONE_DESCRIPTIONS, COLOUR_DESCRIPTIONS, DIRECTION_DESCRIPTIONS } from '../dreamspell/descriptions';

const BG = '#080812';
const BG2 = '#0e0e1c';
const TEXT = '#e8e6df';
const TEXT2 = '#a8a6a0';
const TEXT3 = '#68665e';
const PURPLE = '#c084fc';
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

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

  // Helper to set dark page background
  const darkPage = () => {
    doc.setFillColor(8, 8, 18);
    doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  };

  const pageNum = (n: number) => {
    doc.setFontSize(8);
    doc.setTextColor(104, 102, 94);
    doc.text(`${n}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });
  };

  const sectionTitle = (title: string, y: number, colour?: string) => {
    doc.setFontSize(9);
    doc.setTextColor(colour ?? PURPLE);
    doc.text(title.toUpperCase(), MARGIN, y);
    doc.setDrawColor(colour ?? PURPLE);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + 2, MARGIN + CONTENT_W, y + 2);
    return y + 8;
  };

  const bodyText = (text: string, y: number, maxW?: number): number => {
    doc.setFontSize(10);
    doc.setTextColor(TEXT);
    const lines = doc.splitTextToSize(text, maxW ?? CONTENT_W);
    doc.text(lines, MARGIN, y);
    return y + lines.length * 4.5;
  };

  const labelValue = (label: string, value: string, y: number): number => {
    doc.setFontSize(8);
    doc.setTextColor(TEXT3);
    doc.text(label, MARGIN, y);
    doc.setFontSize(10);
    doc.setTextColor(TEXT);
    doc.text(value, MARGIN + 35, y);
    return y + 5.5;
  };

  // ─── PAGE 1: Cover ──────────────────────────────────────────────────
  darkPage();
  doc.setFontSize(10);
  doc.setTextColor(TEXT3);
  doc.text('deepwhisper.app', PAGE_W / 2, 40, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(PURPLE);
  doc.text('G A L A C T I C   B L U E P R I N T', PAGE_W / 2, 80, { align: 'center' });

  doc.setFontSize(64);
  doc.setTextColor(TEXT);
  doc.text(String(kin.number), PAGE_W / 2, 130, { align: 'center' });

  doc.setFontSize(22);
  doc.setTextColor(kin.seal.colourHex);
  doc.text(kin.title, PAGE_W / 2, 148, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(TEXT2);
  doc.text(`${kin.tone.name} Tone · ${kin.seal.name} Seal`, PAGE_W / 2, 160, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(TEXT3);
  doc.text(`Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, PAGE_W / 2, PAGE_H - 30, { align: 'center' });
  doc.text('Part of the Harmonic Waves ecosystem', PAGE_W / 2, PAGE_H - 24, { align: 'center' });

  // ─── PAGE 2-3: Your Galactic Signature ──────────────────────────────
  doc.addPage();
  darkPage();
  let y = sectionTitle('Your Solar Seal', 25);
  y = labelValue('Seal', `${kin.seal.name} (${kin.seal.colour})`, y);
  y = labelValue('Power', kin.seal.power, y);
  y = labelValue('Action', kin.seal.action, y);
  y = labelValue('Essence', kin.seal.essence, y);
  y = labelValue('Direction', kin.seal.direction, y);
  y += 3;
  y = bodyText(SEAL_DESCRIPTIONS[kin.seal.number] ?? '', y);

  y += 6;
  y = sectionTitle('Your Galactic Tone', y);
  y = labelValue('Tone', `${kin.tone.number} — ${kin.tone.name}`, y);
  y = labelValue('Action', kin.tone.action, y);
  y = labelValue('Power', kin.tone.power, y);
  y = labelValue('Essence', kin.tone.essence, y);
  y += 3;
  y = bodyText(TONE_DESCRIPTIONS[kin.tone.number] ?? '', y);

  y += 6;
  y = sectionTitle('Your Colour Family', y, kin.seal.colourHex);
  y = bodyText(COLOUR_DESCRIPTIONS[kin.seal.colour] ?? '', y);
  y += 3;
  const colourSeals = colourFamily.sealIndices.map(i => SEALS[i].name).join(', ');
  y = labelValue('Seals', colourSeals, y);

  y += 6;
  y = sectionTitle('Your Direction', y);
  y = bodyText(DIRECTION_DESCRIPTIONS[kin.seal.direction] ?? '', y);
  pageNum(2);

  // ─── PAGE 4-5: Destiny Oracle ──────────────────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('Your Fifth Force Oracle', 25);
  y = bodyText('The oracle reveals five energies that shape your cosmic identity. Your destiny seal is at the centre, surrounded by four complementary forces.', y);
  y += 4;

  const oracleEntries: [string, typeof oracle.guide, string][] = [
    ['Guide (above)', oracle.guide, 'Your guide shows you the way forward. It is the power that leads and directs your path.'],
    ['Analog (right)', oracle.analog, 'Your analog is your supportive partner energy — the power that walks beside you.'],
    ['Antipode (left)', oracle.antipode, 'Your antipode is your challenge and strengthening energy — the power that tests and fortifies.'],
    ['Occult (below)', oracle.occult, 'Your occult is your hidden power — the unexpected gift that emerges from within.'],
  ];

  for (const [role, seal, roleDesc] of oracleEntries) {
    y = labelValue(role, `${seal.colour} ${seal.name}`, y);
    y = labelValue('  Power', seal.power, y);
    y = bodyText(`${roleDesc} ${SEAL_DESCRIPTIONS[seal.number]?.split('.')[0] ?? ''}.`, y);
    y += 3;
    if (y > 250) {
      pageNum(3);
      doc.addPage();
      darkPage();
      y = 25;
    }
  }
  pageNum(4);

  // ─── PAGE 6-7: Wavespell ──────────────────────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('Your Wavespell', 25);
  y = labelValue('Wavespell', `${wsNum} of 20 — ${wsSeal.name} Wavespell`, y);
  y = labelValue('Position', `Day ${wsPos} of 13`, y);
  y = labelValue('Initiator', `${wsSeal.colour} ${wsSeal.name}`, y);
  y = labelValue('Power', wsSeal.power, y);
  y += 3;
  y = bodyText(`You are on day ${wsPos} of the ${wsSeal.name} Wavespell, a 13-day cycle initiated by the power of ${wsSeal.power}. The ${kin.tone.name} tone places you at the ${kin.tone.essence.toLowerCase()} stage of this journey — the moment of ${kin.tone.action.toLowerCase()}.`, y);
  y += 4;
  y = bodyText('The 13 tones of the wavespell trace a journey from purpose (Magnetic) through challenge, service, form, radiance, balance, attunement, integrity, intention, manifestation, liberation, cooperation, and finally transcendence (Cosmic).', y);
  pageNum(5);

  // ─── PAGE 8: Castle ───────────────────────────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('Your Castle', 25);
  y = labelValue('Castle', kin.castle.name, y);
  y = labelValue('Quality', kin.castle.quality, y);
  y = labelValue('Kin range', `${kin.castle.kinRange[0]}–${kin.castle.kinRange[1]}`, y);
  y += 3;
  y = bodyText(`Your Kin falls within the ${kin.castle.name}. The castle of ${kin.castle.quality} frames your energy within its 52-day court — a period of ${kin.castle.quality.toLowerCase()} that colours your entire galactic signature.`, y);
  y += 4;
  y = bodyText('There are five castles in the 260-day Tzolkin: Turning (Red East), Crossing (White North), Burning (Blue West), Giving (Yellow South), and Enchantment (Green Central). Each castle contains four wavespells.', y);
  pageNum(6);

  // ─── PAGE 9: Earth Family ─────────────────────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('Your Earth Family', 25);
  y = labelValue('Family', `${earthFamily.name} — ${earthFamily.role}`, y);
  const famSeals = earthFamily.sealIndices.map(i => SEALS[i].name).join(', ');
  y = labelValue('Seals', famSeals, y);
  y += 3;
  y = bodyText(earthFamily.description, y);
  y += 4;
  y = bodyText('The five Earth Families (Polar, Cardinal, Core, Signal, Gateway) define your planetary service role. Each family contains four seals that share a common purpose in the evolution of consciousness.', y);
  pageNum(7);

  // ─── PAGE 10-11: Colour Family ────────────────────────────────────
  y += 8;
  y = sectionTitle('Your Colour Family', y, kin.seal.colourHex);
  y = labelValue('Colour', kin.seal.colour, y);
  const colSeals = colourFamily.sealIndices.map(i => SEALS[i].name).join(', ');
  y = labelValue('Seals', colSeals, y);
  y += 3;
  y = bodyText(COLOUR_DESCRIPTIONS[kin.seal.colour] ?? '', y);
  pageNum(8);

  // ─── PAGE 12-13: Sonic Healing Protocol ───────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('Your Sonic Healing Protocol', 25, '#a855f7');
  y = bodyText('Based on sound healing traditions and chakra correspondences, your galactic signature has a unique sonic profile. Use this protocol for alignment and healing.', y);
  y += 4;

  y = labelValue('Frequency', `${sealSound.frequency} Hz`, y);
  y = labelValue('Note', sealSound.note, y);
  y = labelValue('Chakra', sealSound.chakra, y);
  y = labelValue('Quality', sealSound.quality, y);
  y = labelValue('Instruments', sealSound.instruments.join(', '), y);
  y = labelValue('Duration', `${sealSound.duration} minutes`, y);
  y = labelValue('Body focus', sealSound.bodyArea, y);
  y = labelValue('Best time', getBestTimeOfDay(kin.seal.direction), y);
  y += 4;

  y = sectionTitle('Your Tone Interval', y, '#a855f7');
  y = labelValue('Interval', toneSound.interval, y);
  y = labelValue('Ratio', toneSound.ratio, y);
  y = labelValue('Quality', toneSound.quality, y);
  y = labelValue('Bowl note', toneSound.bowlNote, y);
  y += 4;

  doc.setFontSize(10);
  doc.setTextColor(PURPLE);
  y = bodyText(`Combine your seal frequency (${sealSound.frequency} Hz) with your tone interval (${toneSound.interval}, ${toneSound.ratio}) for your personal galactic resonance.`, y);
  y += 4;

  y = sectionTitle('Daily Practice', y);
  y = bodyText(`1. Find a quiet space at ${getBestTimeOfDay(kin.seal.direction).toLowerCase()}.`, y);
  y = bodyText(`2. Play or listen to ${sealSound.frequency} Hz for ${sealSound.duration} minutes.`, y);
  y = bodyText(`3. Focus awareness on your ${sealSound.bodyArea.toLowerCase()}.`, y);
  y = bodyText(`4. If available, use ${sealSound.instruments[0].toLowerCase()} tuned to ${sealSound.note}.`, y);
  y = bodyText('5. Set the intention of your tone: "I ' + kin.tone.action.toLowerCase() + ' in order to ' + kin.seal.action.toLowerCase() + '."', y);
  pageNum(9);

  // ─── PAGE 14: Galactic Year ───────────────────────────────────────
  doc.addPage();
  darkPage();
  y = sectionTitle('The Galactic Year', 25);
  y = bodyText('The 13 Moon calendar year runs from July 26 to July 24, with July 25 as the Day Out of Time. Each year is coded by a Year Bearer Kin that sets the tone for the entire cycle.', y);
  y += 4;
  y = bodyText('Your galactic signature is eternal — it does not change from year to year. However, the yearly energy interacts with your personal Kin to create unique annual themes and opportunities for growth.', y);
  y += 4;
  y = bodyText('Track your daily alignment at deepwhisper.app, where the Today view shows how each day\'s Kin relates to your personal signature through the oracle, wavespell, and castle systems.', y);
  pageNum(10);

  // ─── Final Page: About ────────────────────────────────────────────
  doc.addPage();
  darkPage();
  doc.setFontSize(12);
  doc.setTextColor(PURPLE);
  doc.text('Generated by Deep Whisper', PAGE_W / 2, 100, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(TEXT2);
  doc.text('13 Moon Galactic Calendar', PAGE_W / 2, 110, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(TEXT3);
  doc.text('deepwhisper.app', PAGE_W / 2, 125, { align: 'center' });
  doc.text('Part of the Harmonic Waves ecosystem', PAGE_W / 2, 132, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(TEXT3);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, PAGE_W / 2, 145, { align: 'center' });

  return doc;
}
