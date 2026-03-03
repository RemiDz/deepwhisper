import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Deep Whisper Session';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A0F 0%, #7B5EA7 100%)',
          fontFamily: 'serif',
        }}
      >
        {/* Sacred geometry decorative corners */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Top-left */}
          <circle cx="60" cy="60" r="40" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.2" />
          <circle cx="60" cy="60" r="25" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.15" />
          {/* Top-right */}
          <circle cx="1140" cy="60" r="40" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.2" />
          <circle cx="1140" cy="60" r="25" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.15" />
          {/* Bottom-left */}
          <circle cx="60" cy="570" r="40" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.2" />
          <circle cx="60" cy="570" r="25" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.15" />
          {/* Bottom-right */}
          <circle cx="1140" cy="570" r="40" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.2" />
          <circle cx="1140" cy="570" r="25" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.15" />
          {/* Centre Flower of Life */}
          <circle cx="600" cy="315" r="80" fill="none" stroke="#C4A1FF" strokeWidth="1" opacity="0.15" />
          <circle cx="600" cy="235" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
          <circle cx="600" cy="395" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
          <circle cx="669" cy="275" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
          <circle cx="531" cy="275" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
          <circle cx="669" cy="355" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
          <circle cx="531" cy="355" r="80" fill="none" stroke="#C4A1FF" strokeWidth="0.5" opacity="0.1" />
        </svg>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <div
            style={{
              fontSize: 72,
              fontStyle: 'italic',
              color: '#F0E6FF',
              textAlign: 'center',
              textShadow: '0 0 60px rgba(196, 161, 255, 0.4)',
              marginBottom: 12,
            }}
          >
            Deep Whisper
          </div>
          <div style={{ fontSize: 26, color: '#8B7BA8', textAlign: 'center' }}>
            Subliminal Audio Intelligence
          </div>
        </div>

        {/* Branding */}
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', fontSize: 18, color: '#8B7BA8' }}>
          deepwhisper.app
        </div>
      </div>
    ),
    { ...size }
  );
}
