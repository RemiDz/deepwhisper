import type { SolarSeal } from './types';

// SVG glyph paths for 20 Solar Seals
// viewBox: -14 -14 28 28, stroke-only, designed for 22px display
const glyphs = {
  dragon:       'M0-10C-6-10-10-6-10 0S-6 10 0 10 6 10 10 6 10 0 6-10 0-10ZM-5-3C-3-5 3-5 5-3M-6 2C-4 5 4 5 6 2M0-2V4',
  wind:         'M0-10V10M-6-6C-3-8 3-8 6-6M-8 0C-5-3 5-3 8 0M-6 6C-3 4 3 4 6 6',
  night:        'M-8 6H8M-6-2V6M6-2V6M-6-2C-6-8 6-8 6-2M0-8V-4M-3-6H3',
  seed:         'M0-10V10M-3-7L0-10 3-7M-5-1L0 2 5-1M-4 5L0 8 4 5M-2 0H2',
  serpent:      'M0-10C-4-6-6-2-6 2S-4 8 0 10C4 8 6 4 6 2S4-6 0-10ZM-3 0C-2-2 2-2 3 0M-2 4H2M0-6V-3',
  worldbridger: 'M-8 8L0-8 8 8ZM-4 0H4M0-8V8M-6 4H6',
  hand:         'M-4 10V-2C-4-6-2-8 0-10 2-8 4-6 4-2V10M-4 2H4M-2-4V0M2-4V0M0-6V-2',
  star:         'M0-10L2.5-3 10-3 4 2 6.5 10 0 5.5-6.5 10-4 2-10-3-2.5-3Z',
  moon:         'M4-8C-2-6-6-3-6 0S-2 6 4 8C0 6-2 3-2 0S0-6 4-8Z M-2-2V2M0-4V4M2-2V2',
  dog:          'M-6-6C-6-10 6-10 6-6V4C6 8 0 10-6 8V-6ZM-3-3C-2-4 2-4 3-3M-3 1V2M3 1V2M-2 5C-1 6 1 6 2 5',
  monkey:       'M0-10C6-10 10-4 8 2L4 8C2 10-2 10-4 8L-8 2C-10-4-6-10 0-10ZM-3-3H-1M1-3H3M-3 2C-1 4 1 4 3 2',
  human:        'M0-10C-4-10-7-7-7-3V3C-7 7-4 10 0 10S7 7 7 3V-3C7-7 4-10 0-10ZM-4 0H4M0-6V6M-3-4C-1-5 1-5 3-4',
  skywalker:    'M0-10V10M-8-4H8M-8 4H8M-4-8V8M4-8V8',
  wizard:       'M-6-8C-6-10 6-10 6-8V0L0 10-6 0V-8ZM-3-5H3M-4-2H4M0 0V6',
  eagle:        'M0-10L-10 4 0 0 10 4ZM0 0V10M-6 4L0 8 6 4M-8 4H-4M4 4H8',
  warrior:      'M-6-8H6V-2L0 4-6-2V-8ZM-4 4V10M4 4V10M-4 10H4M-3-5H3M0-5V0',
  earth:        'M0-10C-6-10-10-6-10 0S-6 10 0 10 6 10 10 6 10 0 6-10 0-10ZM-10 0H10M0-10V10M-7-7L7 7M7-7L-7 7',
  mirror:       'M-8 0H8M-6-8L-8 0-6 8M6-8L8 0 6 8M-3-8H3M-3 8H3M0-8V8',
  storm:        'M0-10C-8-4-8 4 0 10C8 4 8-4 0-10ZM-4-4C-2 0 2 0 4-4M-5 2C-3 6 3 6 5 2M0-6V-2M0 2V6',
  sun:          'M0-6C-4-6-6-4-6 0S-4 6 0 6 4 6 6 4 6 0 4-6 0-6ZM0-10V-7M0 7V10M-10 0H-7M7 0H10M-7-7L-5-5M5 5L7 7M-7 7L-5 5M5-5L7-7',
};

export const SEALS: SolarSeal[] = [
  { number: 0,  name: 'Dragon',       colour: 'Red',    colourHex: '#ef4444', bgHex: '#7f1d1d', direction: 'East',  power: 'Birth',           action: 'Nurtures',       essence: 'Being',           glyphPath: glyphs.dragon },
  { number: 1,  name: 'Wind',         colour: 'White',  colourHex: '#e8e6df', bgHex: '#2a2a2a', direction: 'North', power: 'Spirit',          action: 'Communicates',   essence: 'Breath',          glyphPath: glyphs.wind },
  { number: 2,  name: 'Night',        colour: 'Blue',   colourHex: '#3b82f6', bgHex: '#1e3a5f', direction: 'West',  power: 'Abundance',       action: 'Dreams',         essence: 'Intuition',       glyphPath: glyphs.night },
  { number: 3,  name: 'Seed',         colour: 'Yellow', colourHex: '#eab308', bgHex: '#713f12', direction: 'South', power: 'Flowering',       action: 'Targets',        essence: 'Awareness',       glyphPath: glyphs.seed },
  { number: 4,  name: 'Serpent',      colour: 'Red',    colourHex: '#ef4444', bgHex: '#7f1d1d', direction: 'East',  power: 'Life Force',      action: 'Survives',       essence: 'Instinct',        glyphPath: glyphs.serpent },
  { number: 5,  name: 'Worldbridger', colour: 'White',  colourHex: '#e8e6df', bgHex: '#2a2a2a', direction: 'North', power: 'Death',           action: 'Equalises',      essence: 'Opportunity',     glyphPath: glyphs.worldbridger },
  { number: 6,  name: 'Hand',         colour: 'Blue',   colourHex: '#3b82f6', bgHex: '#1e3a5f', direction: 'West',  power: 'Accomplishment',  action: 'Knows',          essence: 'Healing',         glyphPath: glyphs.hand },
  { number: 7,  name: 'Star',         colour: 'Yellow', colourHex: '#eab308', bgHex: '#713f12', direction: 'South', power: 'Elegance',        action: 'Beautifies',     essence: 'Art',             glyphPath: glyphs.star },
  { number: 8,  name: 'Moon',         colour: 'Red',    colourHex: '#ef4444', bgHex: '#7f1d1d', direction: 'East',  power: 'Universal Water', action: 'Purifies',       essence: 'Flow',            glyphPath: glyphs.moon },
  { number: 9,  name: 'Dog',          colour: 'White',  colourHex: '#e8e6df', bgHex: '#2a2a2a', direction: 'North', power: 'Heart',           action: 'Loves',          essence: 'Loyalty',         glyphPath: glyphs.dog },
  { number: 10, name: 'Monkey',       colour: 'Blue',   colourHex: '#3b82f6', bgHex: '#1e3a5f', direction: 'West',  power: 'Magic',           action: 'Plays',          essence: 'Illusion',        glyphPath: glyphs.monkey },
  { number: 11, name: 'Human',        colour: 'Yellow', colourHex: '#eab308', bgHex: '#713f12', direction: 'South', power: 'Free Will',       action: 'Influences',     essence: 'Wisdom',          glyphPath: glyphs.human },
  { number: 12, name: 'Skywalker',    colour: 'Red',    colourHex: '#ef4444', bgHex: '#7f1d1d', direction: 'East',  power: 'Space',           action: 'Explores',       essence: 'Wakefulness',     glyphPath: glyphs.skywalker },
  { number: 13, name: 'Wizard',       colour: 'White',  colourHex: '#e8e6df', bgHex: '#2a2a2a', direction: 'North', power: 'Timelessness',    action: 'Enchants',       essence: 'Receptivity',     glyphPath: glyphs.wizard },
  { number: 14, name: 'Eagle',        colour: 'Blue',   colourHex: '#3b82f6', bgHex: '#1e3a5f', direction: 'West',  power: 'Vision',          action: 'Creates',        essence: 'Mind',            glyphPath: glyphs.eagle },
  { number: 15, name: 'Warrior',      colour: 'Yellow', colourHex: '#eab308', bgHex: '#713f12', direction: 'South', power: 'Intelligence',    action: 'Questions',      essence: 'Fearlessness',    glyphPath: glyphs.warrior },
  { number: 16, name: 'Earth',        colour: 'Red',    colourHex: '#ef4444', bgHex: '#7f1d1d', direction: 'East',  power: 'Navigation',      action: 'Evolves',        essence: 'Synchronicity',   glyphPath: glyphs.earth },
  { number: 17, name: 'Mirror',       colour: 'White',  colourHex: '#e8e6df', bgHex: '#2a2a2a', direction: 'North', power: 'Endlessness',     action: 'Reflects',       essence: 'Order',           glyphPath: glyphs.mirror },
  { number: 18, name: 'Storm',        colour: 'Blue',   colourHex: '#3b82f6', bgHex: '#1e3a5f', direction: 'West',  power: 'Self-generation', action: 'Catalyses',      essence: 'Energy',          glyphPath: glyphs.storm },
  { number: 19, name: 'Sun',          colour: 'Yellow', colourHex: '#eab308', bgHex: '#713f12', direction: 'South', power: 'Universal Fire',  action: 'Enlightens',     essence: 'Life',            glyphPath: glyphs.sun },
];
