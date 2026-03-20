import { SEALS } from './seals';
import type { SolarSeal } from './types';

export interface EarthFamily {
  name: string;
  role: string;
  sealIndices: number[];
  description: string;
}

export const EARTH_FAMILIES: EarthFamily[] = [
  { name: 'Polar',    role: 'Receivers',    sealIndices: [19, 4, 9, 14],   description: 'You receive galactic information and ground it into awareness.' },
  { name: 'Cardinal', role: 'Catalysts',    sealIndices: [0, 5, 10, 15],   description: 'You initiate action and catalyse new directions.' },
  { name: 'Core',     role: 'Processors',   sealIndices: [2, 6, 11, 16],   description: 'You process and transform information at the centre.' },
  { name: 'Signal',   role: 'Transmitters', sealIndices: [3, 7, 12, 17],   description: 'You signal and transmit galactic frequencies outward.' },
  { name: 'Gateway',  role: 'Transporters', sealIndices: [8, 1, 13, 18],   description: 'You open gateways and transport consciousness between worlds.' },
];

export function getEarthFamily(sealIndex: number): EarthFamily {
  return EARTH_FAMILIES.find(f => f.sealIndices.includes(sealIndex)) ?? EARTH_FAMILIES[0];
}

export function getEarthFamilySeals(family: EarthFamily): SolarSeal[] {
  return family.sealIndices.map(i => SEALS[i]);
}

export function getColourFamily(sealIndex: number): { colour: string; sealIndices: number[] } {
  const colour = SEALS[sealIndex].colour;
  const sealIndices = SEALS.filter(s => s.colour === colour).map(s => s.number);
  return { colour, sealIndices };
}
