/** SpeechSynthesis helpers. Note: SpeechSynthesis cannot be captured to AudioBuffer in most browsers.
 *  For preview only — not for export. */

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function speakPreview(text: string, voice?: SpeechSynthesisVoice, rate: number = 1.0): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  utterance.volume = 0.8;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}
