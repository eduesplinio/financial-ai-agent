import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <g
            transform="translate(2, 2)"
            stroke="#16a34a"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3L3 9l11 6 11-6-11-6z" />
            <path d="M3 21l11 6 11-6" />
            <path d="M3 15l11 6 11-6" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
