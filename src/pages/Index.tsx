import { MessageCircle, Star, Sparkles, Moon, Sun, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/kundli-ai-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const WHATSAPP_LINK = "https://wa.me/YOUR_NUMBER_HERE";

const features = [
  {
    icon: Star,
    title: "Personalized Kundli",
    description: "Get your detailed birth chart analysis powered by advanced AI and Vedic astrology.",
  },
  {
    icon: Moon,
    title: "Daily Horoscope",
    description: "Receive accurate daily, weekly, and monthly predictions tailored to your zodiac sign.",
  },
  {
    icon: Sparkles,
    title: "Kundli Matching",
    description: "Check compatibility for marriage with our precise Kundli matching analysis.",
  },
  {
    icon: Sun,
    title: "Dasha Predictions",
    description: "Understand planetary periods and their impact on your career, health, and relationships.",
  },
  {
    icon: Zap,
    title: "Instant Answers",
    description: "Ask any astrology question and get instant, accurate answers on WhatsApp 24/7.",
  },
  {
    icon: MessageCircle,
    title: "Easy WhatsApp Chat",
    description: "No app downloads needed. Just chat on WhatsApp like you would with a friend.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kundli AI" width={40} height={40} className="rounded-lg" />
            <span className="font-display text-xl text-gradient-gold font-bold">Kundli AI</span>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-gold text-accent-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-purple opacity-70" />
        
        {/* Decorative stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/40 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-float mb-8">
            <img
              src={logo}
              alt="Kundli AI Logo"
              width={140}
              height={140}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-gradient-gold leading-tight">
            Kundli AI
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-4 leading-relaxed">
            Your personal Vedic astrologer on WhatsApp. Get instant Kundli readings, horoscopes, and life guidance — powered by AI.
          </p>
          <p className="text-muted-foreground text-sm mb-10">
            No app downloads · Free to try · Available 24/7
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-gold text-accent-foreground px-10 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-all glow-gold hover:scale-105 transform"
          >
            <MessageCircle size={24} />
            Start Chatting on WhatsApp
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-purple opacity-50" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4 text-gradient-gold">
            What Can Kundli AI Do?
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            Ancient Vedic wisdom meets modern AI — right in your WhatsApp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-accent/50 transition-all hover:glow-purple group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <feature.icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-16 text-gradient-gold">
            How It Works
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {[
              { step: "1", title: "Open WhatsApp", desc: "Click the button below to start a chat" },
              { step: "2", title: "Say Hello", desc: "Send your birth details to get started" },
              { step: "3", title: "Get Insights", desc: "Receive your Kundli and predictions instantly" },
            ].map((item) => (
              <div key={item.step} className="text-center flex-1">
                <div className="w-16 h-16 rounded-full bg-gradient-gold text-accent-foreground flex items-center justify-center text-2xl font-bold font-display mx-auto mb-4 glow-gold">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-purple opacity-60" />
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-gradient-gold">
            Ready to Know Your Stars?
          </h2>
          <p className="text-foreground/70 mb-10 text-lg">
            Join thousands who trust Kundli AI for daily astrological guidance.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-gold text-accent-foreground px-10 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-all glow-gold hover:scale-105 transform"
          >
            <MessageCircle size={24} />
            Chat with Kundli AI
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Kundli AI" width={24} height={24} className="rounded" />
            <span className="font-display text-gradient-gold">Kundli AI</span>
          </div>
          <p>© {new Date().getFullYear()} Kundli AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
