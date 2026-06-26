'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after user engagement
      const hasInteracted = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasInteracted && !isStandalone) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white rounded-lg p-4 shadow-lg z-50 max-w-sm mx-auto">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Smartphone className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">
            Zainstaluj PatternLens
          </h3>
          <p className="text-xs text-blue-100 mb-3">
            Szybszy dostęp, działanie offline, powiadomienia kryzysowe
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Zainstaluj
            </button>
            <button
              onClick={handleDismiss}
              className="text-blue-100 px-3 py-1.5 rounded text-sm"
            >
              Nie teraz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
