/**
 * [PATH]: 05_apps/silence-objects/components/PaywallModal.tsx
 *
 * Paywall trigger modal.
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export function PaywallModal({
  open,
  onClose,
  trigger,
}: {
  open: boolean;
  onClose: () => void;
  trigger: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-700 bg-neutral-950 p-6 text-neutral-100 shadow-2xl">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 shrink-0 text-amber-500" aria-hidden="true" />
            <div className="space-y-3">
              <Dialog.Title className="text-lg font-semibold">Wersja Pro</Dialog.Title>
              <p className="text-sm text-neutral-300">
                Ta funkcja ({trigger}) wymaga wersji Pro.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/pro"
                  onClick={onClose}
                  className="rounded bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
                >
                  Zobacz Pro
                </Link>
                <button
                  onClick={onClose}
                  className="rounded border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
                >
                  Później
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
