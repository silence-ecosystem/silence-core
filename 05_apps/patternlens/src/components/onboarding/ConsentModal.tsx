'use client';
import { useState } from 'react';

const CONSENTS = [
  { id: 'structural', label: 'Rozumiem że to analiza strukturalna, nie terapia' },
  { id: 'safety', label: 'Przeczytałem wytyczne bezpieczeństwa' },
  { id: 'data', label: 'Zgadzam się na przetwarzanie danych' },
  { id: 'age', label: 'Mam 18 lat lub więcej' }
];

export default function ConsentModal({ isOpen, onComplete }: { isOpen: boolean; onComplete: (c: Record<string, boolean>) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  if (!isOpen) return null;
  const allDone = CONSENTS.every(c => checked[c.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="max-w-lg w-full bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Przed rozpoczęciem</h2>
        <div className="space-y-3 mb-6">
          {CONSENTS.map(c => (
            <button key={c.id} onClick={() => setChecked(p => ({ ...p, [c.id]: !p[c.id] }))} className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-left">
              <span className={`w-5 h-5 rounded-full border-2 ${checked[c.id] ? 'bg-green-500 border-green-500' : 'border-gray-600'}`} />
              <span className="text-sm text-gray-300">{c.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => onComplete(checked)} disabled={!allDone} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-lg">Kontynuuj</button>
      </div>
    </div>
  );
}
