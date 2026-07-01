import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SILENCE.OBJECTS",
  description: "Terms of Service for SILENCE.OBJECTS - Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-[#6e7681] mb-8">
        Last updated: January 19, 2026
      </p>

      <div className="space-y-8 text-[#8b949e]">
        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using SILENCE.OBJECTS (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may
            not access the Service.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">2. Description of Service</h2>
          <p className="mb-4">
            SILENCE.OBJECTS is a behavioral pattern analysis application that uses artificial
            intelligence to help users identify patterns in their experiences. The Service
            provides:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Text-based input for describing situations and experiences</li>
            <li>AI-powered analysis through multiple interpretive lenses</li>
            <li>Pattern identification and tracking over time</li>
            <li>Data export and management tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">3. Important Disclaimers</h2>

          <div className="bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg p-4 mb-4">
            <p className="text-[#f87171] font-medium mb-2">Critical Notice:</p>
            <p className="text-[#f87171]">
              SILENCE.OBJECTS is a construction tool for pattern documentation. It is NOT a substitute
              for professional care. The AI-generated content is for structural analysis and
              self-observation purposes only.
            </p>
          </div>

          <ul className="list-disc pl-6 space-y-2">
            <li>Do not use this Service as a crisis intervention tool</li>
            <li>If you are experiencing an emergency, please contact emergency services or a crisis helpline immediately</li>
            <li>Always consult qualified professionals for serious concerns</li>
            <li>AI interpretations are proposals for verification and should not be relied upon for important decisions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">4. Account Terms</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">4.1 Registration</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>You must be at least 16 years old to use this Service</li>
            <li>You must provide accurate and complete registration information</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must notify us immediately of any unauthorized access</li>
          </ul>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">4.2 Account Security</h3>
          <p>
            You are responsible for all activities that occur under your account. We recommend
            using a strong, unique password and enabling any available security features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">5. Acceptable Use</h2>
          <p className="mb-4">You agree NOT to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Submit content that is illegal, harmful, threatening, or abusive</li>
            <li>Impersonate others or misrepresent your affiliation</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Use automated means to access the Service without permission</li>
            <li>Collect data about other users</li>
            <li>Use the Service for any commercial purpose without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">6. User Content</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">6.1 Ownership</h3>
          <p className="mb-4">
            You retain ownership of all content you submit to the Service (&quot;User Content&quot;).
            By submitting content, you grant us a limited license to process, store, and
            display your content solely for the purpose of providing the Service.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">6.2 Responsibility</h3>
          <p>
            You are solely responsible for your User Content. We do not endorse or guarantee
            the accuracy of any AI-generated interpretations based on your content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">7. Subscription and Billing</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">7.1 Free Tier</h3>
          <p className="mb-4">
            The free tier provides access to the Service with unlimited local objects,
            core pattern detection, and 12 archetypes. Cloud features may have usage limits.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">7.2 PRO Subscription</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>PRO subscriptions are billed monthly</li>
            <li>Subscriptions automatically renew unless cancelled</li>
            <li>You can cancel at any time through your account settings</li>
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>No refunds for partial months or unused features</li>
          </ul>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">7.3 Price Changes</h3>
          <p>
            We reserve the right to modify pricing. Existing subscribers will be notified
            at least 30 days before any price increase takes effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">8. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content (excluding User Content), features, and
            functionality are owned by SILENCE.OBJECTS and are protected by international
            copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            The SILENCE.OBJECTS name, logo, and all related names, logos, product and
            service names are trademarks of SILENCE.OBJECTS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">9. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind
            </li>
            <li>
              We do not warrant that the Service will be uninterrupted, secure, or error-free
            </li>
            <li>
              We are not liable for any indirect, incidental, special, consequential, or
              punitive damages
            </li>
            <li>
              Our total liability shall not exceed the amount you paid us in the past 12 months
            </li>
            <li>
              We are not responsible for decisions made based on AI-generated content
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless SILENCE.OBJECTS and its officers,
            directors, employees, and agents from any claims, damages, losses, or expenses
            arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">11. Termination</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">11.1 By You</h3>
          <p className="mb-4">
            You may terminate your account at any time through the Settings page. Upon
            termination, your data will be deleted according to our Privacy Policy.
          </p>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">11.2 By Us</h3>
          <p>
            We may terminate or suspend your account immediately, without prior notice,
            for conduct that we believe violates these Terms, is harmful to other users
            or third parties, or for any other reason at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice
            of significant changes by posting the updated Terms and updating the &quot;Last
            updated&quot; date. Your continued use of the Service after changes constitutes
            acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of
            the European Union and the applicable laws of Poland, without regard to
            conflict of law principles. Any disputes shall be resolved in the courts of
            Poland.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining
            provisions will continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">15. Contact</h2>
          <p>
            For questions about these Terms, please contact us at:
            <span className="text-[#4a90e2]"> legal@silence-objects.com</span>
          </p>
        </section>
      </div>
    </article>
  );
}
