import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CompliPilot — AI-Powered Compliance on Autopilot';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 700,
          }}
        >
          CP
        </div>
        <span style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>CompliPilot</span>
      </div>
      <p
        style={{
          fontSize: '28px',
          color: '#94a3b8',
          maxWidth: '800px',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        AI-Powered Compliance on Autopilot
      </p>
      <div
        style={{
          display: 'flex',
          gap: '32px',
          marginTop: '40px',
        }}
      >
        {['EU AI Act', 'RGPD', 'NIS2', 'DORA'].map((reg) => (
          <div
            key={reg}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid #334155',
              color: '#e2e8f0',
              fontSize: '18px',
            }}
          >
            {reg}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
