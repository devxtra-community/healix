'use client';

import { useEffect, useState } from 'react';

interface OrderSuccessOverlayProps {
  onComplete: () => void;
}

export default function OrderSuccessOverlay({
  onComplete,
}: OrderSuccessOverlayProps) {
  const [phase, setPhase] = useState<'ripple' | 'check' | 'text' | 'fade'>(
    'ripple',
  );

  useEffect(() => {
    // Phase timeline: ripple → check → text → fade → complete
    const t1 = setTimeout(() => setPhase('check'), 400);
    const t2 = setTimeout(() => setPhase('text'), 900);
    const t3 = setTimeout(() => setPhase('fade'), 2400);
    const t4 = setTimeout(() => onComplete(), 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
    >
      {/* Ripple rings */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer ripple */}
        <span
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 160,
            background: 'rgba(52,211,153,0.15)',
            animation: 'gpay-ripple 1.2s ease-out infinite',
          }}
        />
        {/* Middle ripple */}
        <span
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background: 'rgba(52,211,153,0.22)',
            animation: 'gpay-ripple 1.2s ease-out 0.2s infinite',
          }}
        />
        {/* Green circle */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 88,
            height: 88,
            background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
            boxShadow: '0 0 40px rgba(52,211,153,0.5)',
            animation:
              phase === 'ripple'
                ? 'gpay-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
                : 'none',
            transform: phase === 'ripple' ? 'scale(0.3)' : 'scale(1)',
          }}
        >
          {/* Checkmark SVG */}
          <svg
            viewBox="0 0 52 52"
            style={{
              width: 44,
              height: 44,
              opacity:
                phase === 'check' || phase === 'text' || phase === 'fade'
                  ? 1
                  : 0,
              transition: 'opacity 0.2s',
            }}
          >
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27 L22 35 L38 17"
              style={{
                strokeDasharray: 36,
                strokeDashoffset:
                  phase === 'check' || phase === 'text' || phase === 'fade'
                    ? 0
                    : 36,
                transition: 'stroke-dashoffset 0.4s ease-out',
              }}
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div
        style={{
          opacity: phase === 'text' || phase === 'fade' ? 1 : 0,
          transform:
            phase === 'text' || phase === 'fade'
              ? 'translateY(0)'
              : 'translateY(16px)',
          transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          textAlign: 'center',
        }}
      >
        <p className="text-white text-2xl font-bold mb-1">Order Placed!</p>
        <p className="text-emerald-400 text-sm font-medium">
          Your order is being processed
        </p>
      </div>

      <style>{`
        @keyframes gpay-ripple {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes gpay-pop {
          0%   { transform: scale(0.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
