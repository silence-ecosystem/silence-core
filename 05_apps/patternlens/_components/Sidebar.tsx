'use client'

import Link from 'next/link'

interface SidebarProps {
  onCrisisClick: () => void
  isPro?: boolean
}

export default function Sidebar({ onCrisisClick, isPro = false }: SidebarProps) {
  const navItems = [
    { icon: '📊', label: 'Dashboard', href: '/', active: true },
    { icon: '📁', label: 'Archiwum', href: '/archive', active: false },
    { icon: '🔗', label: 'Wzorce', href: '/patterns', active: false, pro: true },
    { icon: '⏰', label: 'Kapsuły', href: '/capsules', active: false, pro: true },
  ]

  const resourceItems = [
    { icon: '🆘', label: 'Zasoby Kryzysowe', onClick: onCrisisClick, crisis: true },
    { icon: '❓', label: 'FAQ', href: '/faq' },
    { icon: '⚙️', label: 'Ustawienia', href: '/settings' },
  ]

  return (
    <aside className="sticky top-24 bg-dark-800 border border-dark-700 rounded-lg p-6 h-fit">
      {/* Navigation */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Nawigacja
        </h3>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all touch-target ${
                item.active
                  ? 'bg-primary-500/15 text-primary-300 border-l-3 border-primary-500 pl-[13px]'
                  : item.pro && !isPro
                    ? 'text-secondary-400 hover:bg-dark-700'
                    : 'text-slate-300 hover:bg-dark-700 hover:text-primary-400'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.pro && !isPro && (
                <span className="ml-auto text-xs text-secondary-400">PRO</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Resources */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Zasoby
        </h3>
        <nav className="space-y-1">
          {resourceItems.map((item, idx) => (
            item.onClick ? (
              <button
                key={idx}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all w-full text-left touch-target ${
                  item.crisis
                    ? 'text-danger hover:bg-danger/10'
                    : 'text-slate-300 hover:bg-dark-700 hover:text-primary-400'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-dark-700 hover:text-primary-400 transition-all touch-target"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
            Upgrade
          </h3>
          <button className="btn-pro w-full mb-3">
            ✨ Upgrade do PRO
          </button>
          <p className="text-xs text-slate-400 text-center">
            Unlimited Objects • Wzorce • Kapsuły Czasowe
          </p>
        </div>
      )}
    </aside>
  )
}
