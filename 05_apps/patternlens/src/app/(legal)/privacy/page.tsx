import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SILENCE.OBJECTS",
  description: "Privacy Policy for SILENCE.OBJECTS - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[#f5f7fa] mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-[#6e7681] mb-8">
        Last updated: January 19, 2026
      </p>

      <div className="space-y-8 text-[#8b949e]">
        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">1. Introduction</h2>
          <p className="mb-4">
            SILENCE.OBJECTS (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our behavioral pattern analysis application.
          </p>
          <p>
            We process data in accordance with the General Data Protection Regulation (GDPR) and other
            applicable data protection laws. By using SILENCE.OBJECTS, you agree to the collection and
            use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">2. Data Controller</h2>
          <p>
            The data controller responsible for your personal data is SILENCE.OBJECTS.
            For any questions regarding this policy or your data, please contact us at:
            <span className="text-[#4a90e2]"> privacy@silence-objects.com</span>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">3. Data We Collect</h2>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">3.1 Account Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Email address (for authentication and communication)</li>
            <li>Account creation date</li>
            <li>Subscription status and tier</li>
          </ul>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">3.2 User-Generated Content</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Text descriptions you submit for analysis (&quot;Objects&quot;)</li>
            <li>AI-generated interpretations and patterns</li>
            <li>Timestamps of submissions</li>
          </ul>

          <h3 className="text-lg font-medium text-[#f5f7fa] mb-3">3.3 Technical Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device type and browser information</li>
            <li>IP address (anonymized)</li>
            <li>Usage patterns and feature interactions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">4. How We Use Your Data</h2>
          <p className="mb-4">We use the collected data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f5f7fa]">Service Delivery:</strong> To provide behavioral pattern analysis and generate insights</li>
            <li><strong className="text-[#f5f7fa]">Account Management:</strong> To manage your account and subscription</li>
            <li><strong className="text-[#f5f7fa]">Communication:</strong> To send service-related notifications</li>
            <li><strong className="text-[#f5f7fa]">Improvement:</strong> To improve our services and develop new features</li>
            <li><strong className="text-[#f5f7fa]">Security:</strong> To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">5. Legal Basis for Processing</h2>
          <p className="mb-4">We process your personal data based on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f5f7fa]">Contract:</strong> Processing necessary to provide our services to you</li>
            <li><strong className="text-[#f5f7fa]">Consent:</strong> Where you have given explicit consent for specific processing</li>
            <li><strong className="text-[#f5f7fa]">Legitimate Interest:</strong> For service improvement and security purposes</li>
            <li><strong className="text-[#f5f7fa]">Legal Obligation:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">6. Data Storage and Security</h2>
          <p className="mb-4">
            Your data is stored on servers located in the European Union (EU) through our
            infrastructure provider, Supabase. We implement appropriate technical and
            organizational measures to protect your data, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>TLS encryption for all data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication measures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">7. AI Processing</h2>
          <p className="mb-4">
            SILENCE.OBJECTS uses artificial intelligence to analyze text you submit. Important
            information about our AI processing:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI models do not retain memory of your conversations between sessions</li>
            <li>Your data is not used to train AI models</li>
            <li>AI-generated content presents structural hypotheses only and does not provide health-related intervention, pattern classification, or professional advice</li>
            <li>We use Claude API (Anthropic) for AI processing, governed by their data processing terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">8. Third-Party Services</h2>
          <p className="mb-4">We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f5f7fa]">Supabase:</strong> Database and authentication (EU servers)</li>
            <li><strong className="text-[#f5f7fa]">Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
            <li><strong className="text-[#f5f7fa]">Anthropic (Claude):</strong> AI processing</li>
          </ul>
          <p className="mt-4">
            Each third-party provider has their own privacy policy and data handling practices.
            We recommend reviewing their respective policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">9. Data Retention</h2>
          <p className="mb-4">We retain your data as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f5f7fa]">Account Data:</strong> Until you delete your account</li>
            <li><strong className="text-[#f5f7fa]">Objects and Interpretations:</strong> Until you delete them or your account</li>
            <li><strong className="text-[#f5f7fa]">Payment Records:</strong> As required by law (typically 7 years)</li>
            <li><strong className="text-[#f5f7fa]">Technical Logs:</strong> 90 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">10. Your Rights (GDPR)</h2>
          <p className="mb-4">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[#f5f7fa]">Right of Access:</strong> Request a copy of your personal data</li>
            <li><strong className="text-[#f5f7fa]">Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong className="text-[#f5f7fa]">Right to Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li><strong className="text-[#f5f7fa]">Right to Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong className="text-[#f5f7fa]">Right to Restriction:</strong> Request limitation of processing</li>
            <li><strong className="text-[#f5f7fa]">Right to Object:</strong> Object to certain types of processing</li>
            <li><strong className="text-[#f5f7fa]">Right to Withdraw Consent:</strong> Withdraw previously given consent</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please visit the Settings page in your account or contact us
            at <span className="text-[#4a90e2]">privacy@silence-objects.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">11. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. These cookies are
            necessary for the application to function and cannot be deactivated. We do not use
            tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">12. Children&apos;s Privacy</h2>
          <p>
            SILENCE.OBJECTS is not intended for users under 16 years of age. We do not knowingly
            collect personal data from children. If you believe we have collected data from a
            child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">13. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            significant changes by posting the new policy on this page and updating the
            &quot;Last updated&quot; date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#f5f7fa] mb-4">14. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or wish to exercise your data rights,
            please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li>Email: <span className="text-[#4a90e2]">privacy@silence-objects.com</span></li>
          </ul>
          <p className="mt-4">
            You also have the right to lodge a complaint with your local data protection authority
            if you believe your data protection rights have been violated.
          </p>
        </section>
      </div>
    </article>
  );
}
