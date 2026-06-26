'use client'

import Link from 'next/link'

interface FooterProps {
  onCrisisClick: () => void
}

export default function Footer({ onCrisisClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const links = [
    { label: 'Polityka Prywatności', href: '/privacy' },
    { label: 'Regulamin', href: '/terms' },
    { label: 'Kontakt', href: '/contact' },
  ]

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-sm text-slate-400">
            © {currentYear} <span className="text-primary-400 font-medium">PatternLens</span> | Framework SILENCE.OBJECTS
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={onCrisisClick}
              className="text-sm text-danger hover:text-red-400 transition-colors"
            >
              🆘 Zasoby Kryzysowe
            </button>
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-dark-700 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1">
              <span>⚠️</span>
              <strong className="text-slate-400">PatternLens to narzędzie konstrukcyjne do analizy strukturalnej.</strong>
            </span>
            {' '}NIE jest to terapia, interwencja kryzysowa ani usługa medyczna.
            <br className="hidden sm:block" />
            {' '}Jeśli doświadczasz kryzysu, skontaktuj się z numerem alarmowym{' '}
            <a href="tel:112" className="text-danger hover:underline font-medium">112</a>
            {' '}lub Telefonem Zaufania{' '}
            <a href="tel:116123" className="text-danger hover:underline font-medium">116 123</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}
