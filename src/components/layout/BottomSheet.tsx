'use client';

import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 max-h-[75dvh] overflow-y-auto animate-slide-up"
        style={{
          background: 'rgba(14,14,28,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '16px 16px 0 0',
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-white/10" />
        </div>
        {title && (
          <h2 className="text-center text-sm font-medium text-[var(--text-secondary)] pb-3">
            {title}
          </h2>
        )}
        <div className="px-5 pb-6">{children}</div>
        <div className="text-center pb-4">
          <button onClick={onClose} className="text-[10px] text-[var(--text-tertiary)]">Tap to close</button>
        </div>
      </div>
    </div>
  );
}
