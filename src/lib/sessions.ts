import { SubliminalSession, IntentionCategory } from '@/types/session';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'deepwhisper-sessions';

export function getSessions(): SubliminalSession[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function getSession(id: string): SubliminalSession | null {
  return getSessions().find(s => s.id === id) || null;
}

export function saveSession(
  data: Omit<SubliminalSession, 'id' | 'shareId' | 'createdAt' | 'playCount'>
): SubliminalSession {
  const session: SubliminalSession = {
    ...data,
    id: nanoid(10),
    shareId: nanoid(8),
    createdAt: new Date().toISOString(),
    playCount: 0,
  };
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return session;
}

export function importSession(data: SubliminalSession): SubliminalSession {
  const session: SubliminalSession = {
    ...data,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    playCount: 0,
  };
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return session;
}

export function incrementPlayCount(id: string): void {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === id);
  if (session) {
    session.playCount++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

export function encodeSessionForShare(session: SubliminalSession): string {
  const lean = { ...session, id: undefined, playCount: undefined };
  return btoa(JSON.stringify(lean));
}

export function shareSessionUrl(session: SubliminalSession): string {
  const encoded = encodeSessionForShare(session);
  return `${window.location.origin}/session/${session.shareId}?d=${encoded}`;
}

export function decodeSharedSession(data: string): SubliminalSession | null {
  try { return JSON.parse(atob(data)); } catch { return null; }
}

export function generateSessionName(category: IntentionCategory): string {
  const names: Record<IntentionCategory, string> = {
    confidence: 'Confidence Session',
    abundance: 'Abundance Session',
    health: 'Healing Session',
    sleep: 'Sleep Session',
    focus: 'Focus Session',
    love: 'Love Session',
    spiritual: 'Spiritual Session',
    creative: 'Creative Session',
    custom: 'Custom Session',
  };
  return names[category];
}
