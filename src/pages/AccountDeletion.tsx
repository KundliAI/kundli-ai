import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Clock, CheckCircle, Trash2 } from "lucide-react";
import logo from "@/assets/kundli-ai-logo.png";

const steps = [
  {
    icon: Mail,
    title: "Send a Deletion Request Email",
    description:
      'Compose an email to kundliaibot@gmail.com with the subject line "Account Deletion Request." In the body of the email, include your WhatsApp phone number (with country code) that you used with Sidera, so we can identify your account.',
  },
  {
    icon: Clock,
    title: "Wait for Processing",
    description:
      "Once we receive your email, our team will verify your identity and begin the deletion process. This typically takes 1–2 working days. You will receive a confirmation email once the process begins.",
  },
  {
    icon: Trash2,
    title: "Data Deletion",
    description:
      "All your personal data — including your name, birth details, chat history, generated Kundli charts, horoscope data, and any other information associated with your account — will be permanently deleted from our systems (Supabase storage).",
  },
  {
    icon: CheckCircle,
    title: "Confirmation",
    description:
      "You will receive a final confirmation email once your account and all associated data have been successfully deleted. After this, you will no longer be able to access any previous readings or chat history.",
  },
];

const AccountDeletion = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <img src={logo} alt="Sidera" width={32} height={32} className="rounded-lg" />
            <span className="font-display text-lg text-gradient-gold font-bold">Sidera</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-gold">Account Deletion</h1>
        <p className="text-muted-foreground text-sm mb-10">
          We respect your right to have your data deleted. Follow the simple steps below to request complete removal of your account and data.
        </p>

        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <step.icon size={22} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground mb-1">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-foreground/75 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
          <p className="text-foreground/80 text-sm mb-4">Ready to request account deletion? Send an email to:</p>
          <a
            href="mailto:kundliaibot@gmail.com?subject=Account%20Deletion%20Request"
            className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Mail size={18} />
            kundliaibot@gmail.com
          </a>
          <p className="text-muted-foreground text-xs mt-4">
            Processing time: 1–2 working days
          </p>
        </div>

        <div className="mt-10 text-foreground/70 text-sm space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Important Notes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account deletion is <strong>permanent and irreversible</strong>. Once deleted, your data cannot be recovered.</li>
            <li>After deletion, you will not receive any further messages from Sidera on WhatsApp.</li>
            <li>If you wish to use Sidera again after deletion, you will need to start fresh as a new user.</li>
            <li>For any questions about the deletion process, feel free to email us at <a href="mailto:kundliaibot@gmail.com" className="text-accent hover:underline">kundliaibot@gmail.com</a>.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AccountDeletion;
