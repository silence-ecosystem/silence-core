'use client'

interface StatsGridProps {
  totalObjects: number
  weeklyObjects: number
  isPro: boolean
}

export default function StatsGrid({ totalObjects, weeklyObjects, isPro }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Objects */}
      <div className="card card-gradient-blue group">
        <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
          <span>📸</span>
          <span>Wszystkie Objects</span>
        </div>
        <div className="text-5xl font-bold text-gradient-primary mb-2">
          {totalObjects}
        </div>
        <div className="text-xs text-slate-400">od początku</div>
      </div>

      {/* Weekly Objects */}
      <div className="card card-gradient-orange group">
        <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
          <span>🔥</span>
          <span>Ten tydzień</span>
        </div>
        <div className="text-5xl font-bold text-amber-400 mb-2">
          {weeklyObjects}
        </div>
        <div className="text-xs text-slate-400">rolling 7 dni</div>
      </div>

      {/* Patterns (PRO) */}
      <div className="card card-gradient-pro relative overflow-hidden sm:col-span-2 lg:col-span-1">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-radial from-secondary-400/15 to-transparent rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <span>🔒</span>
            <span>Wzorce {isPro ? '' : '(PRO)'}</span>
          </div>
          {isPro ? (
            <>
              <div className="text-5xl font-bold text-gradient-pro mb-2">3</div>
              <div className="text-xs text-slate-400">wykryte wzorce</div>
            </>
          ) : (
            <>
              <div className="text-5xl font-bold text-slate-400/50 mb-2">✨</div>
              <button className="btn-pro w-full mt-4">
                Odblokuj Wzorce →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
