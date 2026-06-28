'use client'

import { useEffect, useCallback } from 'react'

interface CrisisModalProps {
  isOpen: boolean
  onClose: () => void
}

const resources = [
  {
    icon: '📞',
    name: 'Telefon Zaufania dla Dorosłych',
    phone: '116 123',
    desc: '24/7 bezpłatna linia wsparcia',
    href: 'tel:116123',
  },
  {
    icon: '📞',
    name: 'Telefon dla Dzieci i Młodzieży',
    phone: '116 111',
    desc: '24/7 bezpłatna linia dla młodych',
    href: 'tel:116111',
  },
  {
    icon: '📞',
    name: 'Centrum Wsparcia dla Osób w Kryzysie',
    phone: '800 70 2222',
    desc: 'Bezpłatna linia 14:00-22:00',
    href: 'tel:800702222',
  },
  {
    icon: '📞',
    name: 'Niebieska Linia - Przemoc Domowa',
    phone: '800 120 002',
    desc: 'Bezpłatna linia 24/7',
    href: 'tel:800120002',
  },
  {
    icon: '🚨',
    name: 'Numer Alarmowy',
    phone: '112',
    desc: 'Nagły wypadek - natychmiastowa pomoc',
    href: 'tel:112',
  },
]

const onlineResources = [
  {
    name: 'Forum Przeciw Depresji',
    url: 'https://forumprzeciwdepresji.pl',
  },
  {
    name: 'Poradnia Psychologiczna Online',
    url: 'https://poradnia.pl',
  },
]

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
    >
      <div className="modal-content max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-dark-700">
          <div className="flex-shrink-0 w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div className="flex-1">
            <h2 id="crisis-title" className="text-xl font-bold text-danger">
              🔴 Protokół Kryzysowy
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Wykryto treści wskazujące na możliwe zagrożenie bezpieczeństwa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-50 hover:bg-dark-700 rounded-lg transition-colors"
            aria-label="Zamknij"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resources */}
        <div className="p-6">
          <p className="text-sm text-slate-200 mb-4">
            ❤️ Jeśli doświadczasz trudności, nie jesteś sam/sama. Poniżej znajdziesz numery wsparcia:
          </p>

          <div className="space-y-3">
            {resources.map((resource) => (
              <a
                key={resource.phone}
                href={resource.href}
                className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-dark-700 transition-colors touch-target"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center text-xl">
                  {resource.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-50">{resource.name}</div>
                  <div className="text-2xl font-mono font-bold text-danger">{resource.phone}</div>
                  <div className="text-xs text-slate-400">{resource.desc}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Online Resources */}
          <div className="mt-6 pt-4 border-t border-dark-700">
            <p className="text-sm text-slate-400 mb-3">Zasoby online:</p>
            <div className="flex flex-wrap gap-2">
              {onlineResources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-400 hover:underline"
                >
                  {resource.name} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-dark-900/50 rounded-b-lg text-center">
          <p className="text-xs text-slate-500">
            ⚠️ PatternLens to narzędzie konstrukcyjne do analizy strukturalnej.
            <br />
            <strong className="text-slate-400">NIE jest to terapia, interwencja kryzysowa ani usługa medyczna.</strong>
            <br />
            Jeśli potrzebujesz natychmiastowej interwencji, zadzwoń teraz.
          </p>
        </div>
      </div>
    </div>
  )
}
