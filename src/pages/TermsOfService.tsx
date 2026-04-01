import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <img src={logo} alt="Kundli AI" width={32} height={32} className="rounded-lg" />
            <span className="font-display text-lg text-gradient-gold font-bold">Kundli AI</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose-legal space-y-8 text-foreground/85 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Kundli AI ("the Service"), operated via WhatsApp and our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any modifications.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">2. Description of Service</h2>
            <p>Kundli AI is an AI-powered Vedic astrology chatbot available on WhatsApp. The Service provides automated astrological readings, birth chart (Kundli) generation, horoscope predictions, Kundli matching, Dasha predictions, and general astrological guidance. All content generated is for entertainment and informational purposes only.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">3. Eligibility</h2>
            <p>You must be at least 13 years of age to use the Service. If you are under 18, you must have parental or guardian consent. By using the Service, you represent and warrant that you meet these eligibility requirements.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">4. User Accounts & Data</h2>
            <p>To use the Service, you interact with our WhatsApp chatbot. You may be asked to provide personal information such as your name, date of birth, time of birth, and place of birth. You are responsible for the accuracy of the information you provide. Your data is stored using secure cloud infrastructure. Please note that your data is <strong>not encrypted at the application level</strong>; however, our cloud infrastructure provider implements industry-standard security including encryption at rest and in transit at the infrastructure level.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to reverse-engineer, hack, or exploit the Service or its underlying systems</li>
              <li>Send abusive, threatening, or harassing messages through the chatbot</li>
              <li>Use automated scripts or bots to interact with the Service (beyond normal WhatsApp usage)</li>
              <li>Impersonate any person or entity while using the Service</li>
              <li>Resell, redistribute, or commercially exploit the Service's output without written permission</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">6. Disclaimer of Warranties</h2>
            <p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Kundli AI does not warrant that:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The Service will be uninterrupted, timely, secure, or error-free</li>
              <li>The astrological predictions or readings will be accurate or reliable</li>
              <li>Any results obtained from the Service will meet your expectations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">7. No Professional Advice</h2>
            <p>The astrological content provided by Kundli AI is generated by artificial intelligence and is intended solely for entertainment and informational purposes. It does <strong>not</strong> constitute professional advice of any kind, including but not limited to medical, legal, financial, psychological, or relationship advice. You should not make any significant life decisions based solely on the output of this Service. Always consult qualified professionals for important decisions.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, Kundli AI, its owners, operators, affiliates, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of or inability to use the Service, even if advised of the possibility of such damages. Our total aggregate liability shall not exceed the amount you paid to us (if any) in the twelve (12) months preceding the claim.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">9. Intellectual Property</h2>
            <p>All content, branding, logos, text, graphics, and software associated with Kundli AI are the intellectual property of Kundli AI and its licensors. You may not copy, modify, distribute, or create derivative works from any part of the Service without prior written consent. The astrological readings generated for you are for your personal use only.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">10. Third-Party Services</h2>
            <p>The Service operates on WhatsApp, which is owned by Meta Platforms, Inc. Your use of WhatsApp is subject to WhatsApp's own Terms of Service and Privacy Policy. We are not responsible for WhatsApp's practices, policies, or any issues arising from the WhatsApp platform. We also use Supabase for data storage and other third-party AI providers, each subject to their own terms.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">11. Account Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. You may request deletion of your account and data at any time by emailing <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a>. See our <Link to="/account-deletion" className="text-accent hover:underline">Account Deletion</Link> page for details.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">12. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Kundli AI, its owners, operators, employees, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney's fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any rights of a third party.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">13. Governing Law & Dispute Resolution</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996, or through the courts of competent jurisdiction in India. You agree to submit to the personal jurisdiction of such courts.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">14. Severability</h2>
            <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">15. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a></p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
