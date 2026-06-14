'use client';

import { useAppStore } from '@/lib/store';
import { ConstructionDisclaimer } from '@/components/ConstructionDisclaimer';

export default function SettingsPage() {
  const { profile, consent, reports, deleteAllReports } = useAppStore();

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ profile, consent, reports }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silence-objects-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-light">Ustawienia</h1>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-lg font-medium">Profil</h2>
        {profile ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-neutral-500">Nazwa</dt>
              <dd className="text-neutral-200">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Obszar</dt>
              <dd className="capitalize text-neutral-200">{profile.focus}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Głębokość</dt>
              <dd className="capitalize text-neutral-200">{profile.depth}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Tryb poznawczy</dt>
              <dd className="capitalize text-neutral-200">{profile.neurotype}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-neutral-500">Brak zapisanego profilu.</p>
        )}
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-lg font-medium">RODO — Twoje dane</h2>
        <p className="text-sm text-neutral-400">
          Wszystkie dane przechowywane są lokalnie w tej przeglądarce. Możesz je
          wyeksportować lub usunąć w dowolnej chwili.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="rounded border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
          >
            Eksportuj dane
          </button>
          <button
            onClick={deleteAllReports}
            className="rounded border border-red-900/50 px-4 py-2 text-sm text-red-400 hover:bg-red-950/20"
          >
            Usuń wszystkie raporty
          </button>
        </div>
      </section>

      {consent && (
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
          <h2 className="mb-2 text-lg font-medium">Historia zgód</h2>
          <p className="text-sm text-neutral-400">
            Zgody zaakceptowano: {new Date(consent.acceptedAt).toLocaleString('pl-PL')}
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-500">
            {consent.rodoData && <li>Przetwarzanie lokalne</li>}
            {consent.rodoModel && <li>Zgoda na model generatywny</li>}
          </ul>
        </section>
      )}

      <ConstructionDisclaimer />
    </div>
  );
}
