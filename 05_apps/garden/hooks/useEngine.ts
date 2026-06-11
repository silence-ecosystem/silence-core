/**
 * [PATH]: 05_apps/garden/hooks/useEngine.ts
 *
 * WASM engine wrapper for deterministic scheduling.
 * Loads silence-engine.wasm and exposes computeScheduleJson.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { trackSilenceEvent } from '@silence/telemetry';

interface WasmExports {
  compute_schedule_json(input_json: string): string;
  verify_determinism_json(input_json: string): boolean;
  validate_json(input_json: string, output_json: string): string;
}

interface EngineInstance {
  exports: WasmExports;
  computeScheduleJson(input: unknown): string;
  verifyDeterminismJson(input: unknown): boolean;
  validateJson(input: unknown, output: unknown): string;
}

type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useEngine() {
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<EngineInstance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (engineRef.current) return;

    setStatus('loading');
    const loadStart = performance.now();

    const loadWasm = async () => {
      try {
        const response = await fetch('/silence-engine.wasm');
        if (!response.ok) {
          throw new Error(`WASM fetch failed: ${response.status} ${response.statusText}`);
        }

        const wasmBuffer = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
          env: {
            memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
          },
        });

        const exports = wasmModule.instance.exports as unknown as WasmExports;

        const engine: EngineInstance = {
          exports,
          computeScheduleJson(input: unknown): string {
            return exports.compute_schedule_json(JSON.stringify(input));
          },
          verifyDeterminismJson(input: unknown): boolean {
            return exports.verify_determinism_json(JSON.stringify(input));
          },
          validateJson(input: unknown, output: unknown): string {
            return exports.validate_json(JSON.stringify(input), JSON.stringify(output));
          },
        };

        engineRef.current = engine;
        setStatus('ready');
        trackSilenceEvent({
          eventType: 'engine_wasm_loaded',
          timestamp: new Date().toISOString(),
          payload: { loadTimeMs: Math.round(performance.now() - loadStart) },
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setStatus('error');
        trackSilenceEvent({
          eventType: 'engine_wasm_failed',
          timestamp: new Date().toISOString(),
          payload: { error: msg, loadTimeMs: Math.round(performance.now() - loadStart) },
        });
      }
    };

    loadWasm();
  }, []);

  const computeSchedule = useCallback((input: unknown): string | null => {
    if (!engineRef.current || status !== 'ready') return null;
    try {
      return engineRef.current.computeScheduleJson(input);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return null;
    }
  }, [status]);

  const verifyDeterminism = useCallback((input: unknown): boolean | null => {
    if (!engineRef.current || status !== 'ready') return null;
    try {
      return engineRef.current.verifyDeterminismJson(input);
    } catch {
      return null;
    }
  }, [status]);

  return { status, error, computeSchedule, verifyDeterminism, engine: engineRef.current };
}
