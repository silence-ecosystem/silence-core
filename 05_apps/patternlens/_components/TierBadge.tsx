'use client'

import Link from 'next/link'

interface TierBadgeProps {
  tier: 'FREE' | 'PRO'
  used: number
  limit: number
}

export default function TierBadge({ tier, used, limit }: TierBadgeProps) {
  const remaining = limit - used
  const isLow = remaining <= 2
  const isDepleted = remaining <= 0

  if (tier === 'PRO') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-dark-800 to-secondary-500/10 border border-secondary-400/30 rounded-lg p-6">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-radial from-secondary-400/20 to-transparent rounded-full" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">✨</span>
            <div>
              <h3 className="text-lg font-semibold text-secondary-400">PRO Tier - Unlimited</h3>
              <p className="text-sm text-slate-300">Pełny dostęp do wszystkich funkcji PatternLens</p>
            </div>
          </div>
          <div className="bg-secondary-500/20 border border-secondary-400/30 rounded-lg px-5 py-3 text-center">
            <div className="text-2xl font-bold text-gradient-pro">∞</div>
            <div className="text-xs text-slate-400">unlimited</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg p-6 ${
      isDepleted 
        ? 'bg-gradient-to-br from-dark-800 to-danger/10 border border-danger/30'
        : isLow
          ? 'bg-gradient-to-br from-dark-800 to-warning/10 border border-warning/30'
          : 'bg-gradient-to-br from-dark-800 to-primary-400/5 border border-primary-400/30'
    }`}>
      <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-radial rounded-full ${
        isDepleted ? 'from-danger/10' : isLow ? 'from-warning/10' : 'from-primary-400/10'
      } to-transparent`} />
      
      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDepleted ? 'text-danger' : isLow ? 'text-warning' : 'text-primary-400'
            }`}>
              FREE Tier - {limit} Objects/tydzień
            </h3>
            <p className="text-sm text-slate-300">
              {isDepleted ? (
                <>Limit wyczerpany. <Link href="/upgrade" className="text-secondary-400 hover:underline">Odblokuj PRO →</Link></>
              ) : (
                <>Przeanalizowałeś <strong>{used} z {limit}</strong> obiektów. <Link href="/upgrade" className="text-primary-400 hover:underline">Odblokuj unlimited →</Link></>
              )}
            </p>
          </div>
        </div>
        
        <div className={`rounded-lg px-5 py-3 text-center border ${
          isDepleted 
            ? 'bg-danger/20 border-danger/30'
            : isLow
              ? 'bg-warning/20 border-warning/30'
              : 'bg-primary-400/20 border-primary-400/30'
        }`}>
          <div className={`text-2xl font-bold ${
            isDepleted ? 'text-danger' : isLow ? 'text-warning' : 'text-gradient-primary'
          }`}>
            {used}/{limit}
          </div>
          <div className="text-xs text-slate-400">limit tygodniowy</div>
        </div>
      </div>
    </div>
  )
}
