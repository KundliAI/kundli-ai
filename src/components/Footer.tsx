import { Link } from "react-router-dom";
import logo from "@/assets/kundli-ai-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-10 px-6 bg-background text-foreground mt-auto">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="KundliAI" width={36} height={36} className="rounded" />
            <span className="font-display text-gradient-gold font-bold text-lg">KundliAI</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text-sm">
            <div>
              <p className="font-semibold text-foreground/60 mb-3 uppercase tracking-wider text-xs">Company</p>
              <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground/60 mb-3 uppercase tracking-wider text-xs">Legal</p>
              <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/refund" className="text-muted-foreground hover:text-foreground transition-colors">Refund Policy</Link>
                <Link to="/account-deletion" className="text-muted-foreground hover:text-foreground transition-colors">Account Deletion</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/30 pt-6 text-center text-muted-foreground text-sm flex flex-col gap-2">
          <p>
            All readings are AI-generated Vedic astrology content for reflection and personal guidance. They are not financial, medical, or legal advice.
          </p>
          <p>© {new Date().getFullYear()} KUNDLI A I ONE IT INFRASTRUCTURE L.L.C. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
