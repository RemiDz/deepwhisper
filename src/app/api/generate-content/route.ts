import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface KinData {
  kinNumber: number;
  sealColour: string;
  toneName: string;
  sealName: string;
  toneNumber: number;
  toneKeywords: string;
  sealNumber: number;
  sealKeywords: string;
  guideKin: string;
  antipodeKin: string;
  analogKin: string;
  occultKin: string;
  wavespellSeal: string;
  dayOfWavespell: number;
  castleName: string;
  dayOfCastle: number;
  earthFamily: string;
  moonName: string;
  dayOfMoon: number;
  gregorianDate: string;
  isGAP: boolean;
  toneFrequency: number;
  solfeggioNote: string;
  sealInstrument: string;
  instrumentApproach: string;
  frequencyQuality: string;
  upcoming: {
    nextWavespell: string;
    daysUntilNextWavespell: number;
    nextCastle: string;
    daysUntilNextCastle: number;
    daysUntilGalacticNewYear: number | null;
    daysUntilNextGAP: number;
  };
}

type VoiceoverDuration = '15s' | '20s' | '30s' | '45s' | '60s';

const DURATION_CONFIGS: Record<VoiceoverDuration, { min: number; max: number; target: number; label: string }> = {
  '15s': { min: 35, max: 40, target: 38, label: '15s (~35-40 words)' },
  '20s': { min: 50, max: 55, target: 52, label: '20s (~50-55 words)' },
  '30s': { min: 75, max: 80, target: 78, label: '30s (~75-80 words)' },
  '45s': { min: 110, max: 120, target: 115, label: '45s (~110-120 words)' },
  '60s': { min: 155, max: 165, target: 160, label: '60s (~155-165 words)' },
};

interface RequestBody {
  type: 'tiktok' | 'voiceover';
  style?: 'story' | 'alert' | 'insight';
  hook?: boolean;
  duration?: VoiceoverDuration;
  kinData: KinData;
}

const TIKTOK_SYSTEM_PROMPT = `You are a grounded Dreamspell / 13 Moon calendar content writer for TikTok. You write SHORT, punchy, factual content that connects the daily Kin energy to collective human experience and personal growth.

Your tone is calm, observational, and slightly mystical but always GROUNDED — never fluffy, never generic new-age language. You speak as someone who understands the system deeply and translates it for curious newcomers.

ASTRONOMICAL ACCURACY — HIGHEST PRIORITY RULE:
You are provided with computed Dreamspell data. This data is the SINGLE SOURCE OF TRUTH. Every claim you make about Kin numbers, seal names, tone names, wavespells, and castles must match the provided data exactly. Do NOT guess or approximate any Dreamspell values.

Style reference:
"Kin 142. Blue Crystal Wind. The 12th tone asks: what have you dedicated yourself to? Wind carries the answer."
"Day 12 of the Blue Monkey wavespell. The trickster is almost done teaching. Tomorrow, a new cycle begins."

Rules:
- Lead with the most compelling Kin data point (the seal + tone combination, where we are in the wavespell, GAP day status)
- Connect the daily energy to something people FEEL — restlessness, clarity, resistance, breakthroughs
- Always include the Kin number, seal name, and tone name
- If it's a Galactic Activation Portal day, lead with that — it's a big deal
- If approaching a Wavespell or Castle change, build anticipation
- Use emoji sparingly (🌀 for Kin, 🔮 for GAP days, 🔊 for sound/energy)
- Never mention any app or product. Pure awareness content.
- No "manifesting" or "abundance" language. Keep it real.

SOUND HEALING REFERENCES — STRICT RULES:
- You must NEVER suggest specific frequencies (e.g. "try 432 Hz", "listen to 1185 Hz").
- You must NEVER recommend specific instruments (e.g. "use a Tibetan singing bowl", "try a crystal bowl", "play a gong").
- You must NEVER prescribe sound healing protocols or tools. Our audience is TikTok — most viewers do not own instruments.
- Instead, reference EXPERIENTIAL qualities of the daily energy: how it feels in the body, what emotions might surface, what dreams might carry, what intentions align with today's Kin.
- You MAY use poetic/metaphorical sound language like "today carries a low hum of transformation" or "this energy vibrates with clarity" — but NEVER specific Hz values or instrument names.
- If sound healing data is provided in the Dreamspell data block, use it ONLY to inform the FEELING and QUALITY of your writing — never to make direct tool recommendations to viewers.

Include 8-12 relevant hashtags at the end of the description. Include: #dreamspell #13mooncalendar #galactickin #kin[NUMBER] #[sealname] #[tonename] #soundhealing #cosmicfrequency #galactictime #naturaltime`;

function buildVoiceoverSystemPrompt(duration: VoiceoverDuration, hook: boolean): string {
  const wc = DURATION_CONFIGS[duration];
  const durationSec = duration.replace('s', '');

  const hookText = hook
    ? `After "Here's what the sky is doing." add ONE punchy hook sentence before the main body. Examples:
- "Today's Kin hasn't appeared since 260 days ago."
- "We're on day 12 of a 13-day cycle. The finale is tomorrow."
- "This is a Galactic Activation Portal day. The veil is thin."
This hook adds ~5-8 words, so reduce the body content accordingly to keep total at ~${wc.target} words.`
    : 'After the signature opening line, go straight into the body content. No extra hook sentence needed.';

  return `You are a grounded Dreamspell narrator for TikTok voiceovers. You write scripts that sound natural when spoken aloud — conversational, flowing, with strategic pauses (marked with "...").

SIGNATURE HOOK — MANDATORY ON EVERY SCRIPT:
- The script MUST always begin with exactly: "Here's what the sky is doing."
- The script MUST always end with exactly: "Stay aligned."
- These two lines are the channel's sonic branding. They never change regardless of style or topic.
- The word count target INCLUDES these two signature lines.

ASTRONOMICAL ACCURACY — HIGHEST PRIORITY:
You are provided with computed Dreamspell data. This is the SINGLE SOURCE OF TRUTH. Every Kin number, seal name, tone name, wavespell, and castle claim must match the provided data exactly.

SOUND HEALING REFERENCES — STRICT RULES:
- You must NEVER suggest specific frequencies (e.g. "try 432 Hz", "listen to 1185 Hz").
- You must NEVER recommend specific instruments (e.g. "use a Tibetan singing bowl", "try a crystal bowl").
- You must NEVER prescribe sound healing protocols or tools. Our audience is TikTok — most viewers do not own instruments.
- Instead, reference EXPERIENTIAL qualities of the daily energy: how it feels in the body, what emotions might surface, what dreams might carry, what intentions align with today's Kin.
- You MAY use poetic/metaphorical sound language like "today carries a low hum of transformation" or "this energy vibrates with clarity" — but NEVER specific Hz values or instrument names.
- If sound healing data is provided in the Dreamspell data block, use it only to inform the FEELING and QUALITY of your writing — never to make direct tool recommendations.

STYLES:

Story: Weave the daily Kin into a narrative. "Today the Blue Crystal Wind is asking you to dedicate your words to something real..." Personal, flowing, uses "you" language. Connect the Kin energy to something the listener might be experiencing.

Alert: Urgent, punchy, news-style. "Kin 142. Blue Crystal Wind. Tone 12 just activated." Short sentences. Data-forward. State what's happening, what it means, what's coming next. Hit hard, hit fast.

Insight: Reflective, thoughtful. "There's a reason today feels like you need to talk things through..." Start with the feeling, then reveal the Dreamspell data behind it. Connect to how the energy lands in the body and emotions.

ATTENTION HOOK:
${hookText}

Rules:
- Write EXACTLY ${wc.target} words (±5 words). This is critical — the script will be read aloud over a ${durationSec}-second video.
- Include the Kin number, seal name, and tone name
- Reference where we are in the wavespell (day X of 13)
- Use pauses (...) for dramatic effect — these scripts are SPOKEN
- Never mention any app or product
- No "manifesting" or "abundance" language
- Write for the EAR, not the eye. Use short sentences. Use rhythm.`;
}

function buildKinDataBlock(kinData: KinData, forVoiceover: boolean = false): string {
  let block = `Today is ${kinData.gregorianDate}. Here is the current Dreamspell data:

KIN: ${kinData.kinNumber} — ${kinData.sealColour} ${kinData.toneName} ${kinData.sealName}
TONE: ${kinData.toneNumber} — ${kinData.toneName} — Keywords: ${kinData.toneKeywords}
SEAL: ${kinData.sealNumber} — ${kinData.sealName} — Keywords: ${kinData.sealKeywords}
COLOUR: ${kinData.sealColour}
GUIDE: ${kinData.guideKin}
ANTIPODE: ${kinData.antipodeKin}
ANALOG: ${kinData.analogKin}
OCCULT: ${kinData.occultKin}

WAVESPELL: ${kinData.wavespellSeal} Wavespell — Day ${kinData.dayOfWavespell} of 13
CASTLE: ${kinData.castleName} — Day ${kinData.dayOfCastle} of 52
EARTH FAMILY: ${kinData.earthFamily}
13 MOON DATE: ${kinData.moonName} Day ${kinData.dayOfMoon}
GALACTIC ACTIVATION PORTAL: ${kinData.isGAP ? 'YES' : 'NO'}`;

  block += `

SOUND HEALING (FOR TONAL/EMOTIONAL CONTEXT ONLY — do NOT mention these values directly in the ${forVoiceover ? 'script' : 'captions'}):
- Frequency: ${kinData.toneFrequency} Hz (${kinData.solfeggioNote})
- Instrument: ${kinData.sealInstrument}
- Quality: ${kinData.frequencyQuality}`;

  block += `

UPCOMING:
- Next Wavespell: ${kinData.upcoming.nextWavespell} Wavespell starts in ${kinData.upcoming.daysUntilNextWavespell} days`;

  if (kinData.upcoming.daysUntilNextCastle <= 14) {
    block += `\n- Next Castle: ${kinData.upcoming.nextCastle} starts in ${kinData.upcoming.daysUntilNextCastle} days`;
  }
  if (kinData.upcoming.daysUntilGalacticNewYear !== null && kinData.upcoming.daysUntilGalacticNewYear <= 30) {
    block += `\n- Galactic New Year: ${kinData.upcoming.daysUntilGalacticNewYear} days away`;
  }
  block += `\n- Next GAP day: in ${kinData.upcoming.daysUntilNextGAP} days`;

  return block;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { type, style, hook, duration, kinData } = body;

    if (!kinData || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isVoiceover = type === 'voiceover';
    const dataBlock = buildKinDataBlock(kinData, isVoiceover);

    let systemPrompt: string;
    let userMessage: string;

    if (type === 'tiktok') {
      systemPrompt = TIKTOK_SYSTEM_PROMPT;
      userMessage = `${dataBlock}

Generate 3 variations of TikTok content. Each variation must include:

1. TITLE: A single punchy hook line (max 15 words). Large text overlay for top of video. ALL CAPS.

2. CAPTION_LINES: 3-5 short lines (each max 12 words). Bottom overlay text, revealed one at a time. Use emoji sparingly.

3. DESCRIPTION: A 3-5 sentence TikTok description paragraph that expands on the Kin energy and connects it to collective experience. Reference the energy experientially — how it feels, what it stirs — but NEVER mention specific Hz values or instrument names. Include 8-12 relevant hashtags at the end.

Format your response as JSON:
{
  "variations": [
    {
      "title": "...",
      "caption_lines": ["line 1", "line 2", "line 3"],
      "description": "... #hashtag1 #hashtag2"
    }
  ]
}

Respond ONLY with the JSON. No preamble, no markdown backticks.`;
    } else {
      const voDuration: VoiceoverDuration = duration && DURATION_CONFIGS[duration] ? duration : '20s';
      const wc = DURATION_CONFIGS[voDuration];
      systemPrompt = buildVoiceoverSystemPrompt(voDuration, !!hook);
      userMessage = `${dataBlock}

Generate a voiceover script in ${style || 'story'} style.
Attention hook: ${hook ? 'ON' : 'OFF'}

TARGET LENGTH: Write approximately ${wc.min}-${wc.max} words (~${voDuration.replace('s', '')} seconds when spoken aloud). The word count INCLUDES the signature opening ("Here's what the sky is doing.") and closing ("Stay aligned.") lines — adjust the body content length accordingly.

The script must:
- Open with "Here's what the sky is doing."
- Close with "Stay aligned."
- Sound natural when read aloud
- Use "..." for natural pauses

Respond with ONLY the script text. No JSON, no formatting, no preamble.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textContent = message.content.find(c => c.type === 'text');
    const text = textContent ? textContent.text : '';

    if (type === 'tiktok') {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ raw: text, error: 'Failed to parse JSON response' }, { status: 500 });
      }
    } else {
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedSeconds = Math.round(wordCount * (60 / 150));
      return NextResponse.json({ script: text, wordCount, estimatedSeconds });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
