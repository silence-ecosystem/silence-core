/**
 * [PATH]: 04_packages/@silence/events/src/index.ts
 * @silence/events
 * Internal event bus for cross-package communication inside Silence.
 */

type Listener = (payload: any) => void;

export class SilenceEventBus {
  private static instance: SilenceEventBus;
  private listeners: Map<string, Listener[]> = new Map();

  static getInstance(): SilenceEventBus {
    if (!SilenceEventBus.instance) {
      SilenceEventBus.instance = new SilenceEventBus();
    }
    return SilenceEventBus.instance;
  }

  subscribe(eventType: string, listener: Listener): void {
    const existing = this.listeners.get(eventType) || [];
    existing.push(listener);
    this.listeners.set(eventType, existing);
  }

  publish(event: { type: string; [key: string]: any }): void {
    const subs = this.listeners.get(event.type) || [];
    subs.forEach((fn) => fn(event));
  }
}

export class EventEmitter {
  private listeners: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener): void {
    const existing = this.listeners.get(event) || [];
    existing.push(listener);
    this.listeners.set(event, existing);
  }

  emit(event: string, payload?: any): void {
    const subs = this.listeners.get(event) || [];
    subs.forEach((fn) => fn(payload));
  }
}
