'use client'

import { useState } from 'react'
import {
  Header,
  TierBadge,
  StatsGrid,
  CreateObject,
  RecentObjects,
  Sidebar,
  Footer,
  CrisisModal,
} from '@/components'

// Mock data - replace with Supabase queries
const mockObjects = [
  {
    id: '1',
    title: 'Wzorzec wycofywania na spotkaniach',
    createdAt: '3 dni temu',
    duration: '2.4 min',
    risk: 'NONE' as const,
    frameworks: ['Psychodynamic', 'Existential'],
    confidence: 83,
    structure: 4.2,
    hasDualLens: true,
  },
  {
    id: '2',
    title: 'Unikanie konfliktów - pattern',
    createdAt: '1 tydzień temu',
    duration: '3.1 min',
    risk: 'MEDIUM' as const,
    frameworks: ['Attachment', 'Cognitive-Behavioral'],
    confidence: 76,
    structure: 3.8,
    hasDualLens: true,
  },
  {
    id: '3',
    title: 'Paraliż decyzyjny przy autorytecie',
    createdAt: '2 tygodnie temu',
    duration: '1.8 min',
    risk: 'NONE' as const,
    frameworks: ['Schema', 'Systemic'],
    confidence: 91,
    structure: 4.7,
    hasDualLens: true,
  },
  {
    id: '4',
    title: 'Analiza cyklu prokrastynacji',
    createdAt: '2 tygodnie temu',
    duration: '2.6 min',
    risk: 'NONE' as const,
    frameworks: ['ADHD', 'Executive Function'],
    confidence: 88,
    structure: 4.4,
    hasDualLens: true,
  },
]

export default function Dashboard() {
  const [crisisModalOpen, setCrisisModalOpen] = useState(false)

  // User state - replace with auth
  const user = {
    name: 'SO',
    tier: 'FREE' as const,
    usedObjects: 5,
    objectLimit: 7,
    totalObjects: 12,
    isPro: false,
  }

  const handleCrisisClick = () => {
    setCrisisModalOpen(true)
  }

  return (
    <>
      <Header onCrisisClick={handleCrisisClick} userName={user.name} />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            <TierBadge
              tier={user.tier}
              used={user.usedObjects}
              limit={user.objectLimit}
            />

            <StatsGrid
              totalObjects={user.totalObjects}
              weeklyObjects={user.usedObjects}
              isPro={user.isPro}
            />

            <CreateObject
              onCrisisDetected={handleCrisisClick}
              remainingObjects={user.objectLimit - user.usedObjects}
            />

            <RecentObjects
              objects={mockObjects}
              weeklyCount={user.usedObjects}
            />
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar onCrisisClick={handleCrisisClick} isPro={user.isPro} />
          </div>
        </div>
      </main>

      <Footer onCrisisClick={handleCrisisClick} />

      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </>
  )
}
