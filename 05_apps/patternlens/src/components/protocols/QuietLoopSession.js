'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { saveProtocolBaseline } from '@/lib/api/protocols';
export function QuietLoopSession({ userId, onComplete }) {
    const [phase, setPhase] = useState('intro');
    const [timerSeconds, setTimerSeconds] = useState(20);
    const [currentDuration, setCurrentDuration] = useState(20);
    const [baselineSeconds, setBaselineSeconds] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    // Timer logic
    useEffect(() => {
        if (isRunning && timerSeconds > 0) {
            timerRef.current = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setPhase('check');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [isRunning, timerSeconds]);
    // Breathing animation sync with timer (20s = 4 breaths of 5s each)
    const breatheProgress = ((currentDuration - timerSeconds) % 5) / 5;
    function startSession() {
        setPhase('focus');
        setTimerSeconds(currentDuration);
        setIsRunning(true);
    }
    async function handleAttentionResponse(maintained) {
        // Staircase protocol logic
        const recordedSeconds = maintained ? currentDuration : Math.floor(currentDuration * 0.8);
        setBaselineSeconds(recordedSeconds);
        // Save to Supabase
        await saveProtocolBaseline({
            userId,
            protocolKey: 'QUIET_LOOP',
            baselineSeconds: recordedSeconds,
            maintained,
        });
        setPhase('complete');
        onComplete?.(recordedSeconds);
    }
    // Intro screen
    if (phase === 'intro') {
        return (_jsxs("div", { className: "fixed inset-0 flex flex-col bg-slate-900 text-zinc-100", children: [_jsx("div", { className: "flex-[0.62] flex flex-col items-center justify-center px-6 max-w-lg mx-auto", children: _jsxs("div", { className: "text-center space-y-golden-3", children: [_jsx("h1", { className: "text-golden-h1 font-semibold tracking-tight", children: "Quiet Loop \u2014 Pomiar stabilno\u015Bci uwagi" }), _jsxs("p", { className: "text-golden-body text-zinc-400 leading-relaxed", children: ["Przez ", currentDuration, " sekund skoncentruj wzrok na punkcie centralnym. Mo\u017Cesz oddycha\u0107 naturalnie \u2014 obserwuj, jak d\u0142ugo Twoja uwaga pozostaje stabilna."] }), _jsx("p", { className: "text-golden-caption text-zinc-500", children: "To nie \u0107wiczenie relaksacyjne ani test \u2014 to pomiar Twojej naturalnej pojemno\u015Bci uwagi." })] }) }), _jsx("div", { className: "flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-3", children: _jsx("button", { onClick: startSession, className: "px-8 py-3 rounded-lg bg-zinc-100 text-slate-900 font-semibold text-golden-body\n                       hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-100/50\n                       min-h-[44px]", children: "Rozpocznij pomiar" }) })] }));
    }
    // Focus phase (active timer)
    if (phase === 'focus') {
        return (_jsxs("div", { className: "fixed inset-0 flex flex-col bg-slate-900 text-zinc-100", children: [_jsxs("div", { className: "flex-[0.62] flex flex-col items-center justify-center px-6", children: [_jsx("div", { className: "w-32 h-32 rounded-full bg-zinc-100/10 border border-zinc-100/20 backdrop-blur-sm\n                       transition-transform duration-[2500ms] ease-in-out", style: {
                                transform: `scale(${1 + breatheProgress * 0.05})`,
                                opacity: 0.6 + breatheProgress * 0.25,
                            }, "aria-hidden": "true" }), _jsxs("div", { className: "mt-golden-3 text-golden-caption text-zinc-500 font-mono tabular-nums", children: [timerSeconds, "s"] })] }), _jsx("div", { className: "flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-2", children: _jsx("p", { className: "text-golden-caption text-zinc-500 text-center max-w-xs", children: "Trzymaj uwag\u0119 na punkcie. Obserwuj oddech, ale nie zmieniaj go." }) })] }));
    }
    // Check phase (after timer ends)
    if (phase === 'check') {
        return (_jsxs("div", { className: "fixed inset-0 flex flex-col bg-slate-900 text-zinc-100", children: [_jsx("div", { className: "flex-[0.62] flex flex-col items-center justify-center px-6 max-w-lg mx-auto", children: _jsxs("div", { className: "text-center space-y-golden-3", children: [_jsx("h2", { className: "text-golden-h1 font-semibold tracking-tight", children: "Czy Twoja uwaga pozosta\u0142a przy punkcie?" }), _jsx("p", { className: "text-golden-body text-zinc-400", children: "Odpowied\u017A mo\u017Ce by\u0107 przybli\u017Cona \u2014 to nie test, tylko pomiar." })] }) }), _jsxs("div", { className: "flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-3 space-y-3", children: [_jsx("button", { onClick: () => handleAttentionResponse(true), className: "w-full max-w-xs px-6 py-4 rounded-xl\n                       border border-zinc-800 bg-zinc-900/50\n                       hover:border-zinc-600 hover:bg-zinc-800/60\n                       transition-all text-golden-body text-zinc-200\n                       focus:outline-none focus:ring-2 focus:ring-zinc-500", children: "Tak \u2014 uwaga by\u0142a stabilna" }), _jsx("button", { onClick: () => handleAttentionResponse(false), className: "w-full max-w-xs px-6 py-4 rounded-xl\n                       border border-zinc-800 bg-zinc-900/50\n                       hover:border-zinc-600 hover:bg-zinc-800/60\n                       transition-all text-golden-body text-zinc-200\n                       focus:outline-none focus:ring-2 focus:ring-zinc-500", children: "Nie \u2014 uwaga odp\u0142yn\u0119\u0142a" })] })] }));
    }
    // Complete phase
    if (phase === 'complete') {
        return (_jsxs("div", { className: "fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-zinc-100 px-6", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-zinc-100/10 border border-zinc-100/20 mb-golden-3", "aria-hidden": "true" }), _jsx("h1", { className: "text-golden-h1 font-semibold tracking-tight text-center", children: "Pomiar zako\u0144czony" }), _jsxs("p", { className: "text-golden-body text-zinc-400 mt-golden-2 text-center max-w-md", children: ["Twoja bazowa stabilno\u015B\u0107 uwagi: ", _jsxs("span", { className: "text-zinc-100 font-semibold", children: [baselineSeconds, "s"] })] }), _jsx("p", { className: "text-golden-caption text-zinc-500 mt-golden-2 text-center max-w-sm", children: "Ten wynik pomo\u017Ce PatternLens dostosowa\u0107 \u0107wiczenia do Twojej naturalnej pojemno\u015Bci." })] }));
    }
    return null;
}
export default QuietLoopSession;
