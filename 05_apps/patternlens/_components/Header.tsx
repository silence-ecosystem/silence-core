'use client'

import { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  onCrisisClick: () => void
  userName?: string
}

export default function Header({ onCrisisClick, userName = 'SO' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/', active: true },
    { label: 'Archiwum', href: '/archive', active: false },
    { label: 'Wzorce', href: '/patterns', active: false, pro: true },
    { label: 'Ustawienia', href: '/settings', active: false },
  ]

  return (
    <header className="sticky top-0 z-40 glass border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span>🔍</span>
          <span className="text-gradient-primary">PatternLens</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium py-2 border-b-2 transition-all duration-150 ${
                item.active
                  ? 'text-primary-400 border-primary-500'
                  : 'text-slate-400 border-transparent hover:text-primary-400'
              }`}
            >
              {item.label}
              {item.pro && (
                <span className="ml-1 text-[10px] text-secondary-400">PRO</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCrisisClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-danger rounded-lg hover:bg-danger/10 transition-colors touch-target"
            aria-label="Otwórz zasoby kryzysowe"
          >
            <span>⚠️</span>
            <span className="hidden sm:inline">🆘 Zasoby Kryzysowe</span>
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-sm font-semibold">
            {userName.slice(0, 2).toUpperCase()}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-primary-400"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-dark-700 bg-dark-800 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                item.active
                  ? 'bg-primary-500/15 text-primary-300'
                  : 'text-slate-400 hover:bg-dark-700'
              }`}
            >
              {item.label}
              {item.pro && <span className="ml-2 text-xs text-secondary-400">PRO</span>}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
