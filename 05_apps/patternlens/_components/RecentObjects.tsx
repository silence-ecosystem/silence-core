'use client'

import Link from 'next/link'

type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'

interface ObjectData {
  id: string
  title: string
  createdAt: string
  duration: string
  risk: RiskLevel
  frameworks: string[]
  confidence: number
  structure: number
  hasDualLens: boolean
}

interface RecentObjectsProps {
  objects: ObjectData[]
  weeklyCount: number
}

const riskColors: Record<RiskLevel, string> = {
  NONE: 'risk-none',
  LOW: 'risk-low',
  MEDIUM: 'risk-medium',
  HIGH: 'risk-high',
}

const cardGradients: Record<RiskLevel, string> = {
  NONE: 'bg-gradient-to-br from-dark-800 to-success/5 border-success/15',
  LOW: 'bg-gradient-to-br from-dark-800 to-blue-500/5 border-blue-500/15',
  MEDIUM: 'bg-gradient-to-br from-dark-800 to-warning/5 border-warning/15',
  HIGH: 'bg-gradient-to-br from-dark-800 to-danger/5 border-danger/15',
}

export default function RecentObjects({ objects, weeklyCount }: RecentObjectsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📈 Ostatnie Objects</h2>
        <span className="badge badge-primary">{weeklyCount} w tym tygodniu</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objects.map((obj) => (
          <article
            key={obj.id}
            className={`rounded-lg border p-5 transition-all duration-250 hover:shadow-card-hover ${cardGradients[obj.risk]}`}
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-dark-700 mb-3">
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">{obj.title}</h3>
                <p className="text-xs text-slate-400">{obj.createdAt} • {obj.duration}</p>
              </div>
              <span className={`badge ${riskColors[obj.risk]}`}>{obj.risk}</span>
            </div>

            {/* Frameworks */}
            <p className="text-sm text-slate-300 mb-3">
              {obj.frameworks.join(' • ')}
            </p>

            {/* Stats */}
            <div className="bg-dark-900 rounded-lg p-3 mb-3">
              <p className="text-sm text-slate-300">
                <span className={obj.risk === 'MEDIUM' || obj.risk === 'HIGH' ? 'text-warning' : 'text-primary-400'}>
                  <strong>Confidence:</strong> {obj.confidence}%
                </span>
                {' • '}
                <span className={obj.risk === 'MEDIUM' || obj.risk === 'HIGH' ? 'text-warning' : 'text-primary-400'}>
                  <strong>Structure:</strong> {obj.structure}/5
                </span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {obj.hasDualLens && '✓ Dual Lens'}
              </span>
              <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                obj.risk === 'MEDIUM' || obj.risk === 'HIGH'
                  ? 'bg-warning/20 text-warning hover:bg-warning/30'
                  : 'bg-primary-400/20 text-primary-400 hover:bg-primary-400/30'
              }`}>
                Zobacz →
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link href="/archive" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
          Zobacz wszystkie w Archiwum →
        </Link>
      </div>
    </section>
  )
}
