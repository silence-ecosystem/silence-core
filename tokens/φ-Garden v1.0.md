// app/(protected)/intent-selector/page.tsx
import Link from "next/link";

const intentOptions = [
  {
    id: "quiet",
    title: "Quiet",
    description: "Mniej bodźców, więcej struktury. Dobry wybór dla spokojniejszego startu.",
  },
  {
    id: "rhythm",
    title: "Rhythm",
    description: "Stały rytm dnia, krótkie sekwencje, czytelny flow.",
  },
  {
    id: "garden",
    title: "Garden",
    description: "Praca z wzorcami, obserwacja, lekkie wejście w ogrodowy tryb.",
  },
  {
    id: "bare",
    title: "Bare",
    description: "Najprostszy wariant: minimalny interfejs i szybka kontynuacja.",
  },
] as const;

export default function IntentSelectorPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] px-6 py-10 text-[#f1f5f9]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm tracking-[0.24em] text-slate-400 uppercase">
            Step 2 · Intent
          </p>
          <h1 className="text-3xl font-light tracking-tight md:text-4xl">
            Wybierz tryb wejścia
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            To nie test ani diagnoza. To tylko wybór pierwszego kroku, który ustawia układ i tempo
            dalszego flow.
          </p>
        </header>

        <section
          className="grid gap-3 md:grid-cols-2"
          aria-label="Intent options"
        >
          {intentOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              data-intent={option.id}
              className="group rounded-2xl border border-slate-700 bg-[#111827] p-5 text-left transition duration-200 ease-out hover:border-slate-500 hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a55a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e17]"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-medium tracking-tight text-[#f1f5f9]">
                  {option.title}
                </h2>
                <span className="rounded-full border border-slate-700 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Select
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                {option.description}
              </p>
            </button>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
          <p className="text-sm leading-6 text-slate-300">
            Po wyborze zapisujemy `profiles.intent` i przechodzimy dalej bez dodatkowych formularzy.
          </p>
        </section>

        <footer className="flex items-center justify-between gap-4 text-sm text-slate-400">
          <Link href="/welcome" className="underline decoration-slate-600 underline-offset-4 hover:text-slate-200">
            ← Wstecz
          </Link>
          <Link href="/garden" className="rounded-full bg-[#c9a55a] px-4 py-2 font-medium text-[#0a0e17] transition hover:brightness-110">
            Kontynuuj
          </Link>
        </footer>
      </div>
    </main>
  );
}
