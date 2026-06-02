import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <img src={logo} alt="KundliAI" width={32} height={32} className="rounded-lg" />
            <span className="font-display text-lg text-gradient-gold font-bold">KundliAI</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose-legal space-y-8 text-foreground/85 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">1. Introduction</h2>
            <p>This Privacy Policy explains how KundliAI ("we," "us," or "our") collects, uses, stores, shares, and protects your personal information when you use our specialized Vedic astrology service — delivered via WhatsApp and our website. By using our Service, you consent to the practices described in this policy.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p>To provide personalized astrological readings, we collect the following information:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Personal Information:</strong> Name, phone number (via WhatsApp), date of birth, time of birth, and place of birth — required to generate your Kundli</li>
              <li><strong>Service Interactions:</strong> Messages exchanged with KundliAI on WhatsApp as part of requesting astrology readings and guidance</li>
<li><strong>Generated Content:</strong> Kundli charts, horoscope readings, and other astrological outputs generated for you</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>Your information is used solely to operate and improve our Vedic astrology service:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>To generate personalized Kundli charts and astrological readings</li>
              <li>To provide daily, weekly, and monthly horoscope predictions</li>
              <li>To perform Kundli matching and compatibility analysis</li>
              <li>To deliver Dasha predictions and planetary period analysis</li>
              <li>To improve the accuracy and quality of our astrological service</li>
              <li>To respond to your support and account inquiries</li>
              <li>To communicate service updates or changes</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored on secure cloud infrastructure. Here is how we protect it:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Our cloud infrastructure provider applies <strong>AES-256 encryption at rest</strong> and <strong>TLS/SSL encryption in transit</strong> to all stored data</li>
              <li>We apply access controls and authentication mechanisms to restrict unauthorized access</li>
              <li>We do not implement a separate application-level encryption layer beyond what our infrastructure provider provides</li>
              <li>No method of electronic storage or internet transmission is 100% secure; we cannot guarantee absolute security</li>
            </ul>
            <p className="mt-2">We retain your data for as long as your account is active or as needed to provide the Service. You may request deletion at any time (see Section 8).</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">5. Data Sharing & Disclosure</h2>
            <p>We do <strong>not</strong> sell your personal information. We may share data only in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Service Providers:</strong> Cloud infrastructure providers, AI model providers, and Meta Platforms (as the WhatsApp platform operator) — each subject to their own confidentiality and security obligations</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority, or to protect our rights or user safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, subject to equivalent confidentiality protections</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing with a specific third party</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">6. Cookies & Tracking</h2>
            <p>Our website may use cookies and similar tracking technologies to improve your browsing experience and analyze site traffic. You can manage cookie preferences through your browser settings. The KundliAI WhatsApp service does not use cookies.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you have the following rights over your personal data:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (see Section 8)</li>
              <li><strong>Objection:</strong> Object to certain types of processing</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is consent-based</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">8. Account & Data Deletion</h2>
            <p>You can request complete deletion of your account and all associated data at any time. Please visit our <Link to="/account-deletion" className="text-accent hover:underline">Account Deletion</Link> page for the step-by-step process. Deletion requests are processed within 1–2 working days.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">9. Children's Privacy</h2>
            <p>Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a> and we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">10. International Data Transfers</h2>
            <p>Your data may be stored and processed on servers outside your country of residence, in regions where our cloud infrastructure provider operates. By using the Service, you consent to such transfers. We ensure appropriate safeguards are in place for all cross-border data transfers.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Significant changes will be posted on our website with a revised "Last updated" date. Your continued use of the Service after any update constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">12. Contact Us</h2>
            <p>For any questions, concerns, or data requests related to this Privacy Policy, please contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
