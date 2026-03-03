import { CategoryDefinition, IntentionCategory } from '@/types/session';

export const categories: CategoryDefinition[] = [
  { key: 'confidence', name: 'Confidence & Self-Worth', icon: '✨', accent: '#E8B931', description: 'Build unshakeable self-belief' },
  { key: 'abundance', name: 'Abundance & Prosperity', icon: '💎', accent: '#4ECDC4', description: 'Attract wealth and opportunity' },
  { key: 'health', name: 'Health & Healing', icon: '🌿', accent: '#2ECC71', description: 'Activate your body\'s healing power' },
  { key: 'sleep', name: 'Sleep & Relaxation', icon: '🌙', accent: '#6C5CE7', description: 'Drift into deep, restorative rest' },
  { key: 'focus', name: 'Focus & Clarity', icon: '🎯', accent: '#74B9FF', description: 'Sharpen your mind and attention' },
  { key: 'love', name: 'Love & Relationships', icon: '💜', accent: '#FF6B9D', description: 'Open your heart to connection' },
  { key: 'spiritual', name: 'Spiritual Growth', icon: '🕉️', accent: '#A855F7', description: 'Deepen your spiritual journey' },
  { key: 'creative', name: 'Creative Flow', icon: '🎨', accent: '#FF9F43', description: 'Unlock your creative potential' },
  { key: 'custom', name: 'Custom', icon: '⚡', accent: '#C4A1FF', description: 'Write your own affirmations' },
];

export const getCategoryDef = (key: IntentionCategory): CategoryDefinition => {
  return categories.find(c => c.key === key) || categories[8];
};

export const getCategoryAccent = (key: IntentionCategory): string => {
  return getCategoryDef(key).accent;
};
