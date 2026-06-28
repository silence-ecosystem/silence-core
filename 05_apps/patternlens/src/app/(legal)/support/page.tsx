import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | SILENCE.OBJECTS",
  description: "Get help with SILENCE.OBJECTS - Contact support, FAQ, and crisis resources.",
};

export default function SupportPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] mb-2">
        Support
      </h1>
      <p className="text-sm text-[#6e7681] mb-8">
        How to get help with SILENCE.OBJECTS
      </p>

      <div className="space-y-8 text-[#8b949e]">
        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">1. Contact</h2>
          <p className="mb-4">
            For general inquiries, bug reports, or feature requests:
          </p>
          <ul className="list-none space-y-2">
            <li>Email: <span className="text-[#4a90e2]">support@patternlens.app</span></li>
            <li>Response time: within 48 hours on business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">2. Frequently Asked Questions</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">What is SILENCE.OBJECTS?</h3>
          <p className="mb-4">
            SILENCE.OBJECTS is a structural behavioral pattern analysis framework. It helps
            you document and analyze behavioral patterns through a 4-phase protocol:
            Context, Tension, Meaning, and Function.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">What is PatternLens?</h3>
          <p className="mb-4">
            PatternLens is the consumer application built on the SILENCE.OBJECTS framework.
            It provides AI-powered pattern detection, archetype mapping, and dual-lens
            structural analysis.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">Is my data secure?</h3>
          <p className="mb-4">
            Yes. All data is stored on EU-based servers (Supabase) with TLS encryption
            in transit and AES-256 encryption at rest. Your data is never used to train
            AI models. See our <a href="/privacy" className="text-[#4a90e2] hover:underline">Privacy Policy</a> for
            full details.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">How do I delete my account?</h3>
          <p className="mb-4">
            You can delete your account from the Settings page in your dashboard.
            Upon deletion, all your data will be permanently removed in accordance
            with our Privacy Policy.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">How do I cancel my PRO subscription?</h3>
          <p className="mb-4">
            You can cancel your subscription at any time from Settings. Cancellation
            takes effect at the end of your current billing period. See
            our <a href="/terms" className="text-[#4a90e2] hover:underline">Terms of Service</a> for
            billing details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">3. Bug Reports</h2>
          <p className="mb-4">
            To report a bug, please include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A description of the issue</li>
            <li>Steps to reproduce the problem</li>
            <li>Your browser and device information</li>
            <li>Screenshots if applicable</li>
          </ul>
          <p className="mt-4">
            Send bug reports to: <span className="text-[#4a90e2]">support@patternlens.app</span>
          </p>
        </section>

        <section>
          <div className="bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg p-4">
            <h2 className="text-xl font-semibold text-[#f87171] mb-4">4. Crisis Resources</h2>
            <p className="text-[#f87171] mb-4">
              SILENCE.OBJECTS is a structural analysis tool and does not provide crisis
              intervention. If you or someone you know is in immediate danger, please
              contact emergency services or a crisis helpline:
            </p>
            <ul className="list-none space-y-2 text-[#f87171]">
              <li><strong>Poland:</strong> 116 123 (24/7) or 112 (emergency)</li>
              <li><strong>UK:</strong> 116 123 (Samaritans, 24/7) or 999 (emergency)</li>
              <li><strong>US:</strong> 988 (Crisis Lifeline, 24/7) or 911 (emergency)</li>
              <li><strong>EU:</strong> 112 (Pan-European emergency)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">5. Legal</h2>
          <p>
            For legal inquiries or data protection requests, please contact:
            <span className="text-[#4a90e2]"> legal@silence-objects.com</span>
          </p>
          <p className="mt-2">
            For privacy-related requests:
            <span className="text-[#4a90e2]"> privacy@silence-objects.com</span>
          </p>
        </section>
      </div>
    </article>
  );
}
