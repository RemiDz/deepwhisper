export interface SealYogaPrescription {
  poses: string[];
  bodyFocus: string;
  description: string;
}

export interface ToneYogaPrescription {
  style: string;
  description: string;
}

export const SEAL_YOGA_MAP: SealYogaPrescription[] = [
  /* 0  Dragon */      { poses: ["Child's pose", 'Malasana', 'Earth salutations'], bodyFocus: 'Grounding, root connection', description: 'Dragon energy roots you to origin. Begin low to the earth. Child\'s pose and malasana bring your body close to the ground where Dragon lives. Move slowly — this is not a day for speed.' },
  /* 1  Wind */        { poses: ['Nadi shodhana', 'Ujjayi breathing', 'Camel pose'], bodyFocus: 'Breath-focused, pranayama', description: 'Wind breathes through you. Let pranayama lead today\'s practice. Alternate nostril breathing clears the channel, and camel pose opens the throat where Wind speaks.' },
  /* 2  Night */       { poses: ['Yoga nidra', 'Supported fish', 'Legs up the wall'], bodyFocus: 'Restorative, dream-like', description: 'Night draws you inward. Restorative poses held in stillness let the dreamscape open. Yoga nidra is especially powerful today — let yourself drift between waking and sleeping.' },
  /* 3  Seed */        { poses: ['Seated meditation', 'Boat pose', 'Tree pose'], bodyFocus: 'Intention setting, core', description: 'Seed plants with purpose. Begin seated, setting a clear intention. Core work like boat pose activates your centre. Tree pose embodies growth from a single rooted point.' },
  /* 4  Serpent */     { poses: ['Cat-cow', 'Cobra', 'Spinal twists'], bodyFocus: 'Kundalini, spine', description: 'Serpent moves through the spine. Cat-cow undulations wake the kundalini channel. Cobra lifts the serpent energy upward. Spinal twists wring out stagnation — let life force flow.' },
  /* 5  Worldbridger */{ poses: ['Bridge', 'Supported backbends', 'Savasana'], bodyFocus: 'Heart opening, release', description: 'Worldbridger opens the heart to both sides. Bridge pose connects earth and sky through the body. Finish with a long savasana — Worldbridger teaches that letting go is the ultimate opening.' },
  /* 6  Hand */        { poses: ['Slow vinyasa', 'Hands-to-heart', 'Healing mudras'], bodyFocus: 'Healing, gentle flow', description: 'Hand heals through gentle presence. Move through a slow vinyasa with attention on your palms. Healing mudras channel energy through the hands — let each gesture be medicine.' },
  /* 7  Star */        { poses: ['Dancer', 'Half moon', 'Star pose'], bodyFocus: 'Balance, harmony', description: 'Star seeks beauty in form. Balance poses like dancer and half moon embody elegance. Star pose spreads your body wide — take up space with grace and symmetry.' },
  /* 8  Moon */        { poses: ['Moon salutations', 'Hip openers', 'Pigeon'], bodyFocus: 'Fluid, emotional release', description: 'Moon flows with feeling. Moon salutations honour the emotional body. Hip openers and pigeon release stored emotions — let tears come if they want to. The body remembers what the mind forgets.' },
  /* 9  Dog */         { poses: ['Heart openers', 'Puppy pose', 'Camel'], bodyFocus: 'Heart-centred, devotion', description: 'Dog opens the heart with devotion. Puppy pose and camel stretch the chest wide. Today your practice is an offering — move with loyalty to your own body\'s needs.' },
  /* 10 Monkey */      { poses: ['Arm balances', 'Inversions', 'Free movement'], bodyFocus: 'Playful, creative', description: 'Monkey plays without rules. Try arm balances, inversions, or anything that makes you laugh. If you fall, laugh louder. Today\'s yoga is recess, not discipline.' },
  /* 11 Human */       { poses: ['Free flow practice', 'Follow your body'], bodyFocus: 'Intuitive, self-guided', description: 'Human follows inner wisdom. No sequence today — let your body choose what it needs. Move intuitively. Your free will is the teacher; the mat is just the classroom.' },
  /* 12 Skywalker */   { poses: ['Sun salutations (extended)', 'Warrior series'], bodyFocus: 'Expansive, reaching', description: 'Skywalker reaches beyond limits. Extended sun salutations build heat and expansion. The warrior series grounds your exploration — reach further than you think you can.' },
  /* 13 Wizard */      { poses: ['Long-hold yin poses', 'Seated meditation'], bodyFocus: 'Receptive, stillness', description: 'Wizard receives in stillness. Hold yin poses for 3-5 minutes each. Let the fascia release on its own timeline. Meditation at the end lets you absorb what the practice revealed.' },
  /* 14 Eagle */       { poses: ['Eagle pose', 'Gazing meditation', 'Headstand'], bodyFocus: 'Vision, focus', description: 'Eagle sees with focused intensity. Eagle pose wraps the body tight — a concentrated lens. Gazing meditation sharpens inner vision. Headstand shifts your perspective entirely.' },
  /* 15 Warrior */     { poses: ['Warrior I, II, III', 'Power flow'], bodyFocus: 'Strong, courageous', description: 'Warrior stands with courage. Move through all three warriors with fierce intention. Power flow builds heat and resolve. Today you practice strength — not as aggression, but as unwavering presence.' },
  /* 16 Earth */       { poses: ['Mountain', 'Tree', 'Standing balances'], bodyFocus: 'Grounding, stability', description: 'Earth finds its centre. Stand in mountain pose and feel the ground hold you. Tree and standing balances teach the body to navigate by feel — let gravity be your guide.' },
  /* 17 Mirror */      { poses: ['Mirror-image flows', 'Forward folds'], bodyFocus: 'Reflective, symmetry', description: 'Mirror reflects truth. Practice symmetrical flows — what you do on one side, repeat exactly on the other. Forward folds turn your gaze inward. Notice what you see without judgement.' },
  /* 18 Storm */       { poses: ['Power vinyasa', 'Breath of fire', 'Dynamic flow'], bodyFocus: 'Dynamic, transformative', description: 'Storm transforms through intensity. Power vinyasa with breath of fire generates inner heat. Move fast, move hard — the storm does not hold back. Transformation happens at the edge of comfort.' },
  /* 19 Sun */         { poses: ['Complete sun salutation sequence', 'Full practice'], bodyFocus: 'Full practice, illumination', description: 'Sun illuminates the full practice. Today, do it all — complete sun salutation rounds followed by standing, seated, and resting poses. Let every part of the body receive light.' },
];

export const TONE_YOGA_MAP: ToneYogaPrescription[] = [
  /* 1  Magnetic */    { style: 'Gentle start with intention', description: 'Begin gently. Set an opening intention in seated meditation. Let the first breaths establish the purpose of the practice.' },
  /* 2  Lunar */       { style: 'Explore opposites', description: 'Explore opposites — stretch left then right, forward then back. Feel the polarity in your body. The challenge is the teacher today.' },
  /* 3  Electric */    { style: 'Energising movement', description: 'Move with activation and purpose. This is an energising practice — bring heat, bring speed, bring the electric spark to each transition.' },
  /* 4  Self-existing */{ style: 'Structured holds', description: 'Build a structured sequence and hold each pose for four breaths. Form matters today — alignment over ambition, precision over power.' },
  /* 5  Overtone */    { style: 'Power and strength', description: 'Build power. Focus on strength and resonance in each pose. Hold longer, press deeper. Let your body radiate from its centre outward.' },
  /* 6  Rhythmic */    { style: 'Balanced flow', description: 'Create a balanced flow with equal effort and rest. Rhythmic breathing leads the movement. The tempo itself is the practice.' },
  /* 7  Resonant */    { style: 'Sustained holds at centre', description: 'Find the centre of each pose and stay there. Sustained holds let you discover what resonance feels like in the body — the vibration of perfect alignment.' },
  /* 8  Galactic */    { style: 'Layered practices', description: 'Layer breath, movement, and sound together. Chant while you hold. Breathe audibly through transitions. Integration of all practices is the goal.' },
  /* 9  Solar */       { style: 'Full energy presence', description: 'Move with complete presence and full energy. Every inhale intentional, every pose held with total awareness. This is not casual practice.' },
  /* 10 Planetary */   { style: 'Perfect alignment', description: 'Focus on precision in each pose. Perfect your alignment — micro-adjustments, stacked joints, engaged muscles. Manifestation lives in the details.' },
  /* 11 Spectral */    { style: 'Yin and surrender', description: 'Yin and restorative today. Let go of effort. Surrender into each pose and let gravity do the work. The dissolving of tension is the liberation.' },
  /* 12 Crystal */     { style: 'Partner or group practice', description: 'Practice with others if possible. Partner yoga, group class, or simply practising in shared space. Connection amplifies the energy today.' },
  /* 13 Cosmic */      { style: 'Free movement, no structure', description: 'No structure. Let the body lead entirely. Free movement, ecstatic dance, or simply lying still — whatever the cosmic pulse asks of you.' },
];

export function getSealYogaPrescription(sealIndex: number): SealYogaPrescription {
  return SEAL_YOGA_MAP[sealIndex] || SEAL_YOGA_MAP[0];
}

export function getToneYogaPrescription(toneNumber: number): ToneYogaPrescription {
  return TONE_YOGA_MAP[toneNumber - 1] || TONE_YOGA_MAP[0];
}
