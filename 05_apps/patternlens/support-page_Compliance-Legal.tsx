// apps/patternlens/app/support/page.tsx

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-gray-300 px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Support — PatternLens</h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
          <p>
            For questions, bug reports, or feature requests:
          </p>
          <p className="mt-2">
            <a href="mailto:support@patternslab.app" className="text-cyan-400 underline text-base">
              support@patternslab.app
            </a>
          </p>
          <p className="mt-2 text-gray-500">We respond to most requests within 48 hours.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">FAQ</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-200">What is PatternLens?</h3>
              <p>
                PatternLens is a structural analysis tool for behavioral patterns. It helps you
                capture objects (recorded experiences) and see structural patterns across time using
                a dual-lens analysis system and 12 Jungian archetypes.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-200">Is PatternLens a therapy app?</h3>
              <p>
                No. PatternLens is a construction tool for structural analysis, not a substitute
                for professional support. All outputs are structural hypotheses — proposals, not
                diagnoses or advice.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-200">How does voice input work?</h3>
              <p>
                Tap the microphone button to record. Your voice is transcribed to text using
                Whisper (OpenAI) and then analyzed structurally. We do not store raw audio or
                perform emotion detection.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-200">What does PRO include?</h3>
              <p>
                PRO (29 PLN/month) adds cloud sync, advanced structural analysis, pattern
                predictions, and archetype shift tracking. Core pattern detection is always free.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-200">Can I delete my data?</h3>
              <p>
                Yes. You can delete individual objects or your entire account. All associated data
                is permanently removed within 30 days. Contact support@patternslab.app for account deletion.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-200">What happens when the safety system activates?</h3>
              <p>
                PatternLens includes a 3-layer safety system. If high-risk content is detected,
                analysis is blocked and local crisis resources are displayed. This is not emergency
                services — it provides informational links to local support.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Links</h2>
          <ul className="space-y-1">
            <li><a href="/privacy" className="text-cyan-400 underline">Privacy Policy</a></li>
            <li><a href="https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS" className="text-cyan-400 underline">GitHub (SILENCE.OBJECTS)</a></li>
            <li><a href="https://patternslab.app" className="text-cyan-400 underline">PatternsLab (Institutional)</a></li>
          </ul>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-600">
            PatternLens v5.3.0 · SILENCE.OBJECTS Framework · © 2025-2026 PatternLabs
          </p>
        </div>
      </section>
    </main>
  );
}
