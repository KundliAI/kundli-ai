import { Link } from "react-router-dom";
import { ArrowLeft, Star, Shield, Zap } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const WHATSAPP_LINK = "https://wa.me/916377943974?text=Hey%20KundliAI!";

const AboutUs = () => {
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
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">About Us</h1>
        <p className="text-muted-foreground text-sm mb-10">The story behind KundliAI</p>

        <div className="space-y-12 text-foreground/85 text-sm leading-relaxed">

          {/* Mission */}
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">Our Mission</h2>
            <p>KundliAI exists to make authentic Vedic astrology accessible to everyone — not just those who can afford a private Jyotish consultant or have hours to spend reading dense charts. We believe that the wisdom encoded in your birth chart belongs to you, and you should be able to access it simply, privately, and instantly.</p>
            <p className="mt-3">We deliver that through a purpose-built astrology service on WhatsApp — the app already on your phone — so there is nothing new to download, no account to set up, and no waiting for an appointment.</p>
          </section>

          {/* Origin */}
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">Why We Built This</h2>
            <p>Traditional Jyotish (Vedic astrology) is one of the oldest knowledge systems in the world. For most people, accessing it meant either navigating complicated software, paying for expensive consultations, or relying on generic predictions that weren't tailored to their actual birth details.</p>
            <p className="mt-3">KundliAI was built to change that. By combining the depth of Vedic astrology with modern AI, we created a structured service that takes your real birth data — date, time, and place — and returns genuinely personalized readings. No generic horoscopes. No guesswork.</p>
          </section>

          {/* How it works */}
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">How the Service Works</h2>
            <p>KundliAI is a specialized Vedic astrology service. It is designed around structured interactions: you share your birth details, and we return your Kundli, horoscope predictions, Dasha analysis, or compatibility reading — depending on what you ask for.</p>
            <p className="mt-3">Our service operates within the WhatsApp Business platform in compliance with Meta's guidelines for purpose-built business services. We are not a general-purpose AI — we are an astrology service that happens to use AI to power accurate, personalized readings at scale.</p>
          </section>

          {/* Values */}
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Star size={20} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">Accuracy</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">We take Jyotish seriously. Our readings are grounded in traditional Vedic principles, not generic content.</p>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Zap size={20} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">Accessibility</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">Anyone with WhatsApp should be able to access Vedic astrology guidance — no apps, no subscriptions, no barriers.</p>
              </div>
              <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Shield size={20} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">Privacy</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">Your birth details are personal. We collect only what is needed to serve you and never sell your data.</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center pt-4">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Ready to discover your Kundli?</h2>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-gold text-accent-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all glow-gold hover:scale-105 transform text-sm"
            >
              <WhatsAppIcon size={20} />
              Get Started on WhatsApp
            </a>
            <p className="text-muted-foreground text-xs mt-4">
              Questions? Reach us at{" "}
              <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">
                kundliaibot@gmail.com
              </a>
              {" "}or follow us on Instagram{" "}
              <a href="https://instagram.com/mykundliai" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @mykundliai
              </a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AboutUs;
