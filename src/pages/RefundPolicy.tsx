import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";

const RefundPolicy = () => {
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
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">Refund Policy</h1>
        <p className="text-muted-foreground text-sm mb-6">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-8 text-sm">
          <strong>Legal Entity:</strong> KundliAI is a service provided by KUNDLI A I ONE IT INFRASTRUCTURE L.L.C.
        </div>

        <div className="prose-legal space-y-8 text-foreground/85 text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">1. Overview</h2>
            <p>KundliAI is a digital Vedic astrology service with no physical goods. The service is free to try up to a set number of queries. After that, continuing requires a payment — a minimum amount applies, which varies by currency. You may always choose to contribute more. This policy covers all payments made to KundliAI.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">2. How Payments Work</h2>
            <p>Once your free queries are used, you will be asked to make a payment to continue using the service. A currency-specific minimum payment amount applies — this minimum exists to cover the operational costs of providing the service. There is no upper limit; you may contribute any amount at or above the minimum.</p>
            <p className="mt-2">Each payment unlocks continued access to KundliAI's astrology services on WhatsApp.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">3. Refund Eligibility</h2>
            <p>You may request a refund within <strong>7 days</strong> of your payment. Refunds are considered under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Eligible:</strong> Payment made but service not yet used (no readings or predictions delivered after the payment)</li>
              <li><strong>Eligible:</strong> Accidental duplicate payment or clear technical error</li>
              <li><strong>Not eligible:</strong> Service has already been used following the payment — once readings, predictions, or Kundli analysis have been delivered, the payment is considered rendered</li>
              <li><strong>Not eligible:</strong> Request submitted after the 7-day window has closed</li>
              <li><strong>Not eligible:</strong> Account suspended or terminated due to violations of our <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">4. How to Request a Refund</h2>
            <p>To request a refund, email <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a> within 7 days of your payment, with the following details:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Subject line: <strong>"Refund Request"</strong></li>
              <li>Your WhatsApp phone number (with country code) used with KundliAI</li>
              <li>The amount, currency, and date of the payment</li>
              <li>A brief reason for the request</li>
            </ul>
            <p className="mt-3">We will review and respond to your request within <strong>7 working days</strong> of receiving it.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">5. Processing</h2>
            <p>Approved refunds are returned via the original payment method. Processing times vary by bank or payment provider, but typically take 5–10 business days after approval.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">6. Contact</h2>
            <p>For any questions about this Refund Policy, please contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a></p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
