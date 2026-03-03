'use client';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  size?: number;
}

export default function RecordButton({ isRecording, onClick, size = 64 }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'recording-pulse' : ''}`}
      style={{
        width: size,
        height: size,
        background: isRecording ? 'var(--danger)' : 'var(--bg-surface)',
        border: `2px solid ${isRecording ? 'var(--danger)' : 'var(--border)'}`,
      }}
    >
      <div
        className="transition-all duration-300"
        style={{
          width: isRecording ? size * 0.3 : size * 0.35,
          height: isRecording ? size * 0.3 : size * 0.35,
          borderRadius: isRecording ? 3 : '50%',
          background: isRecording ? 'white' : 'var(--danger)',
        }}
      />
    </button>
  );
}
