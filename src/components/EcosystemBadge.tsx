export default function EcosystemBadge() {
  return (
    <a
      href="https://harmonicwaves.app"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs no-underline transition-colors"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
      }}
    >
      <span style={{ color: 'var(--accent)' }}>~</span>
      Part of Harmonic Waves
    </a>
  );
}
