export interface SolarSeal {
  number: number;        // 0-19 (internal), displayed as 1-20
  name: string;
  colour: 'Red' | 'White' | 'Blue' | 'Yellow';
  colourHex: string;
  bgHex: string;
  direction: 'East' | 'North' | 'West' | 'South';
  power: string;
  action: string;
  essence: string;
  iconPath: string;      // Path to PNG icon in /public/icons/
}

export interface GalacticTone {
  number: number;        // 1-13
  name: string;
  action: string;
  power: string;
  essence: string;
}

export interface Kin {
  number: number;        // 1-260
  seal: SolarSeal;
  tone: GalacticTone;
  title: string;
  wavespell: number;     // 1-20
  castle: Castle;
  harmonic: number;      // 1-65
  isGAP: boolean;        // Galactic Activation Portal
}

export interface Oracle {
  destiny: Kin;
  guide: SolarSeal;
  analog: SolarSeal;
  antipode: SolarSeal;
  occult: SolarSeal;
}

export interface Castle {
  number: number;        // 1-5
  name: string;
  colour: string;
  direction: string;
  quality: string;
  kinRange: [number, number];
}

export interface Moon13 {
  number: number;        // 1-13
  name: string;
  tone: GalacticTone;
  gregorianStart: { month: number; day: number };
  gregorianEnd: { month: number; day: number };
  question: string;
}

export interface DreamspellDate {
  kin: Kin;
  moon: Moon13;
  moonDay: number;       // 1-28
  dayOfYear: number;     // 1-365
  yearBearer: Kin;
  isDayOutOfTime: boolean;
  isHunabKu: boolean;    // Feb 29
}

export interface MoonData {
  phase: number;
  illumination: number;
  phaseName: string;
  zodiacSign: string;
  zodiacDegree: number;
}
