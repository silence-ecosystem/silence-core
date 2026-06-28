/**
 * [PATH]: 05_apps/silence-objects/components/CrisisModal.tsx
 *
 * Hard-blocking crisis modal.
 */
// @ts-nocheck

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';
import type { CrisisLevel } from '@/lib/crisis';

export function CrisisModal({
  open,
  level,
  onClose,
}: {
  open: boolean;
  level: CrisisLevel;
  onClose: () => void;
}) {
  if (level === 'none') return null;

  const isBlock = level === 'block';

  return (
    <Dialog.Root open={open} onOpenChange={() => !isBlock && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-700 bg-neutral-950 p-6 text-neutral-100 shadow-2xl"
          onEscapeKeyDown={(e) => {
            if (isBlock) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (isBlock) e.preventDefault();
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 shrink-0 text-red-500" aria-hidden="true" />
            <div className="space-y-3">
              <Dialog.Title className="text-lg font-semibold text-red-500">
                Wykryto wysokie napięcie
              </Dialog.Title>
              <p className="text-sm text-neutral-300">
                Ten system nie zastępuje kontaktu z człowiekiem. Jeśli czujesz, że
                sytuacja jest poważna, skontaktuj się z profesjonalną osobą.
              </p>
              <div className="rounded border border-red-900/50 bg-red-950/30 p-3 text-sm font-mono text-red-400">
                Telefony kryzysowe: 116 123, 112
              </div>
              {isBlock ? (
                <p className="text-xs text-neutral-400">
                  Generowanie raportu zostało zatrzymane. Możesz zmienić opis,
                  ale nie używaj tu treści o zagrożeniu życia.
                </p>
              ) : (
                <button
                  onClick={onClose}
                  className="mt-2 w-full rounded bg-neutral-800 px-4 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                >
                  Rozumiem
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
