"use client";

interface FirstObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirstObjectModal({ isOpen, onClose }: FirstObjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#161b22] border border-[#2d3748] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#6e7681] hover:text-[#f5f7fa] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(74,222,128,0.15)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-2">
            Pierwszy Obiekt zapisany
          </h2>
          <p className="text-sm text-[#8b949e]">
            Właśnie rozpocząłeś dokumentowanie swoich wzorców.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 bg-[#1a1f28]">
          <h3 className="text-sm font-semibold text-[#f5f7fa] mb-3">
            Co się zmieniło?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[rgba(74,144,226,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#4a90e2] font-semibold">1</span>
              </div>
              <div>
                <p className="text-sm text-[#f5f7fa]">Masz teraz punkt odniesienia</p>
                <p className="text-xs text-[#6e7681] mt-0.5">System będzie porównywać przyszłe Obiekty z tym wzorcem</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[rgba(74,144,226,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#4a90e2] font-semibold">2</span>
              </div>
              <div>
                <p className="text-sm text-[#f5f7fa]">Wybrałeś interpretację</p>
                <p className="text-xs text-[#6e7681] mt-0.5">Twój wybór mówi coś o tym, jak postrzegasz sytuacje</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[rgba(74,144,226,0.15)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-[#4a90e2] font-semibold">3</span>
              </div>
              <div>
                <p className="text-sm text-[#f5f7fa]">Wzorce potrzebują czasu</p>
                <p className="text-xs text-[#6e7681] mt-0.5">Po 3-5 Obiektach zaczną pojawiać się powtarzające struktury</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="px-6 py-5">
          <button
            onClick={onClose}
            className="w-full min-h-[48px] px-6 py-3 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Rozumiem
          </button>
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-[#6e7681]">
            Ten komunikat pojawi się tylko raz
          </p>
        </div>
      </div>
    </div>
  );
}
