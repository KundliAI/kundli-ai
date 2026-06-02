import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const ContactUs = () => {
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
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">Contact Us</h1>
        <p className="text-muted-foreground text-sm mb-10">We're here to help. Expect a response within 1–2 working days.</p>

        <div className="space-y-4">
          <a
            href="mailto:kundliaibot@gmail.com"
            className="flex items-center gap-4 bg-card/60 border border-border/50 rounded-2xl p-5 hover:border-accent/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
              <Mail size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Email Us</p>
              <p className="text-muted-foreground text-xs">kundliaibot@gmail.com</p>
            </div>
          </a>

          <a
            href="https://instagram.com/mykundliai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-card/60 border border-border/50 rounded-2xl p-5 hover:border-accent/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
              <InstagramIcon size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Instagram</p>
              <p className="text-muted-foreground text-xs">@mykundliai</p>
            </div>
          </a>

          <p className="text-muted-foreground text-xs pt-2 leading-relaxed">
            For account deletion requests, please see the{" "}
            <Link to="/account-deletion" className="text-accent hover:underline">Account Deletion</Link>{" "}
            page.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
