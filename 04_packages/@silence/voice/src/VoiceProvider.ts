/**
 * [PATH]: 04_packages/@silence/voice/src/VoiceProvider.ts
 */
﻿import { SilenceEventBus } from '@silence/events';

/**
 * SILENCE.VOICE — Moduł interakcji głosowej.
 * Wykorzystuje Web Speech API dla pełnej kompatybilności Edge/Browser.
 */
export class VoiceProvider {
  private static synthesis: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static isMuted: boolean = false;

  static init() {
    const bus = SilenceEventBus.getInstance();

    // Subskrybujemy gotowe interwencje z JITAI Engine
    bus.subscribe('SYSTEM_INTERVENTION_READY' as any, (event: any) => {
      this.announce(event.payload.message);
    });
    
    console.log("✅ [VOICE] VoiceProvider initialized and listening for JITAI events.");
  }

  static announce(text: string) {
    if (!this.synthesis || this.isMuted) return;

    // Przerwij poprzednie komunikaty, aby nie tworzyć kolejki (ochrona przed przebodźcowaniem)
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL'; 
    utterance.pitch = 0.9; // Obniżony ton dla mniejszej inwazyjności
    utterance.rate = 0.85; // Wolniejsze tempo (Recovery-friendly)

    this.synthesis.speak(utterance);
    console.log(`[VOICE] Announcing: "${text}"`);
  }

  static toggleMute(state: boolean) {
    this.isMuted = state;
  }
}
