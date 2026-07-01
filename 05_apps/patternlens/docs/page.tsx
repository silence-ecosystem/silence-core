// src/app/(emergency)/emergency/page.tsx
// Example documentation file - see actual implementation in src/app/(emergency)/emergency/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HELPLINES,
  detectRegion,
  getRegionalHelplines,
  type RegionHelplines
} from '@/lib/safety/helplines';

export default function EmergencyPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [currentHelplines, setCurrentHelplines] = useState<RegionHelplines | null>(null);

  useEffect(() => {
    const detected = detectRegion();
    setSelectedRegion(detected);
    setCurrentHelplines(getRegionalHelplines(detected));
  }, []);

  useEffect(() => {
    setCurrentHelplines(getRegionalHelplines(selectedRegion));
  }, [selectedRegion]);

  const allRegions = Object.entries(HELPLINES).filter(([key]) => key !== 'DEFAULT');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
          >
            Back to SILENCE.OBJECTS
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">
            Crisis Resources
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            If you are in immediate danger or experiencing a crisis, please contact one of these services.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3">
            <label htmlFor="region" className="text-zinc-400 text-sm">
              Select your region:
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allRegions.map(([code, region]) => (
                <option key={code} value={code}>
                  {region.region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Region Resources */}
        {currentHelplines && (
          <div className="space-y-6 mb-12">
            {currentHelplines.helplines.map((helpline, index) => (
              <div
                key={helpline.number}
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {index === 0 && (
                      <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-medium px-2 py-1 rounded mb-2">
                        Primary
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-zinc-100">
                      {helpline.name}
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">
                      Available: {helpline.available}
                    </p>
                  </div>
                  <a
                    href={`tel:${helpline.number.replace(/\s/g, '')}`}
                    className={`${index === 0 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-zinc-700 hover:bg-zinc-600'} text-white font-bold text-xl px-8 py-4 rounded-lg transition-colors text-center min-h-[56px] flex items-center justify-center`}
                  >
                    {helpline.number}
                  </a>
                </div>
              </div>
            ))}

            {/* Emergency */}
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    Emergency Services
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    For immediate danger or life-threatening emergencies
                  </p>
                </div>
                <a
                  href={`tel:${currentHelplines.emergencyNumber}`}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-2xl px-10 py-4 rounded-lg transition-colors text-center min-h-[56px] flex items-center justify-center"
                >
                  {currentHelplines.emergencyNumber}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Table */}
        <div className="border-t border-zinc-800 pt-12">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 text-center">
            Quick Reference - All Regions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-3 px-4 text-zinc-400 font-medium">Region</th>
                  <th className="py-3 px-4 text-zinc-400 font-medium">Primary</th>
                  <th className="py-3 px-4 text-zinc-400 font-medium">Emergency</th>
                </tr>
              </thead>
              <tbody>
                {allRegions.map(([code, region]) => {
                  const primary = region.helplines.find(h => h.isPrimary) || region.helplines[0];
                  return (
                    <tr key={code} className="border-b border-zinc-800">
                      <td className="py-3 px-4 text-zinc-100">
                        {region.region}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`tel:${primary.number.replace(/\s/g, '')}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {primary.number}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`tel:${region.emergencyNumber}`}
                          className="text-red-400 hover:text-red-300 font-medium"
                        >
                          {region.emergencyNumber}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">
            SILENCE.OBJECTS is a construction tool for structural pattern analysis.
            It does not provide crisis intervention, therapy, diagnosis, or medical advice.
            If you are in danger, please contact emergency services immediately.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
          >
            Return to SILENCE.OBJECTS
          </Link>
        </div>
      </footer>
    </div>
  );
}
