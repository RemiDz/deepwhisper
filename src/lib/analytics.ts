/** Plausible analytics helper — fires custom events if Plausible is loaded */
export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && (window as unknown as { plausible?: (name: string, opts?: { props: Record<string, string | number> }) => void }).plausible) {
    const plausible = (window as unknown as { plausible: (name: string, opts?: { props: Record<string, string | number> }) => void }).plausible;
    plausible(name, props ? { props } : undefined);
  }
}
