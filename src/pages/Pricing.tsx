import { Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Sparkles } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const WHATSAPP_LINK = "https://wa.me/916377943974?text=Hey%20KundliAI!";

const Pricing = () => {
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

      <main className="container mx-auto max-w-2xl px-6 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 text-gradient-gold">Pricing</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Simple, honest, and in your hands.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-4 mb-12">
          <div className="flex items-start gap-4 bg-card/60 border border-border/50 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground mb-1">Start for free</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                KundliAI is free to try. Start a conversation on WhatsApp, share your birth details, and receive your first readings with no payment required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-card/60 border border-border/50 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground mb-1">Continue with a donation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                After your free queries are used up, a minimum donation is required to continue. The minimum amount varies by currency to keep things fair across regions — you're always welcome to contribute more if you'd like. Every contribution helps keep KundliAI running and improving.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-card/60 border border-border/50 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Heart size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground mb-1">Why we do it this way</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Running an AI-powered astrology service has real costs — infrastructure, AI models, and ongoing development. We chose the donation model because we want KundliAI to be accessible to everyone, regardless of budget. Trust over transactions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-gold text-accent-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all glow-gold hover:scale-105 transform text-sm"
          >
            <WhatsAppIcon size={20} />
            Try KundliAI for Free
          </a>
          <p className="text-muted-foreground text-xs mt-4">
            Questions about pricing? Email us at{" "}
            <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">
              kundliaibot@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
