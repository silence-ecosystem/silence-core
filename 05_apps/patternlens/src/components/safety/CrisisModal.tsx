'use client';

import { AlertTriangle, Phone, X } from 'lucide-react';
import type { CrisisResource } from '@/types/crisis';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  level?: 'medium' | 'high' | 'critical';
  resources?: CrisisResource[];
  detectedKeywords?: string[];
}

export function CrisisModal({
  isOpen,
  onClose,
  level = 'critical',
  resources = [],
  detectedKeywords = [],
}: CrisisModalProps) {
  if (!isOpen) return null;

  const levelConfig = {
    medium: {
      title: 'System wykrył słowa kluczowe',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-500'
    },
    high: {
      title: 'Wykryto treści wymagające uwagi',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-orange-500'
    },
    critical: {
      title: 'System wykrył treści kryzysowe',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-500'
    }
  };

  const config = levelConfig[level];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative max-w-md w-full rounded-2xl border ${config.borderColor} ${config.bgColor} bg-gray-900/95 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Zamknij"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${config.bgColor}`}>
              <AlertTriangle className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h2 id="crisis-modal-title" className="text-lg font-semibold text-white">
                {config.title}
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <p>
              System wykrył słowa kluczowe wskazujące na zagrożenie bezpieczeństwa.
            </p>
            <p>
              PatternLens to narzędzie analizy strukturalnej i nie zapewnia interwencji kryzysowej.
            </p>
            <p className="font-medium text-white">
              Jeśli potrzebujesz natychmiastowej pomocy, skorzystaj z poniższych zasobów:
            </p>
            {detectedKeywords.length > 0 && (
              <p className="text-xs text-gray-400">
                Wykryte słowa kluczowe: {detectedKeywords.join(', ')}
              </p>
            )}
          </div>

          {/* Resources */}
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <a
                key={`${resource.name}-${index}`}
                href={`tel:${resource.number}`}
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <div className="p-2 rounded-full bg-green-500/20">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-green-400 transition-colors">
                    {resource.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {resource.number} &bull; {resource.description}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href="/emergency"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 text-center text-sm font-medium text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Więcej Zasobów
            </a>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Powrót
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
