// src/components/safety/SafetyBanner.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SafetyBannerProps {
  message?: string;
  showDismiss?: boolean;
  variant?: 'info' | 'warning';
}

export function SafetyBanner({ 
  message,
  showDismiss = true,
  variant = 'info'
}: SafetyBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const bgColor = variant === 'warning' 
    ? 'bg-amber-900/20 border-amber-700/50' 
    : 'bg-zinc-800/50 border-zinc-700';

  return (
    <div 
      className={`${bgColor} border rounded-lg p-4`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg 
            className="w-5 h-5 text-zinc-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-zinc-300 text-sm">
            {message || 'If you are experiencing distress, crisis resources are available.'}
          </p>
          <Link 
            href="/emergency"
            className="inline-block mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Access crisis resources →
          </Link>
        </div>
        
        {showDismiss && (
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Dismiss"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default SafetyBanner;
