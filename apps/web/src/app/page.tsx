import Link from "next/link";
import { COPY } from "@/lib/copy";
import { SAMPLE_CARD, SAMPLE_CHAT, sampleChart } from "@/lib/sample";
import { Star, Wordmark } from "@/components/Wordmark";
import { BirthChart } from "@/components/BirthChart";
import { DailyCard } from "@/components/DailyCard";
import { IconChat, IconFriends, IconHome, IconProfile, IconSend, WhatsAppMark } from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/links";
import s from "./landing.module.css";

const L = COPY.landing;
const PACKS = [
  { label: "Quick question", price: 49, q: 5 },
  { label: "Deeper look", price: 149, q: 20, best: true },
  { label: "Whole year", price: 399, q: 60 },
];

export default function Landing() {
  return (
    <div className={s.page}>
      <header className={s.nav}>
        <div className={s.wrap}>
          <Wordmark />
          <nav className={s.navLinks} aria-label="Main">
            <a href="#how" className={s.navLink}>{COPY.nav.how}</a>
            <a href="#pricing" className={s.navLink}>{COPY.nav.pricing}</a>
            <Link href="/login" className={s.navLink}>{COPY.nav.login}</Link>
            <Link href="/login" className="btn small">{COPY.nav.start}</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero: text left, the real chat on a lit bronze ground right, the chart card over its corner (D10). */}
        <section className={s.hero}>
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div className={s.heroText}>
              <h1 className={s.h1}>{L.h1}</h1>
              <p className={s.lead}>{L.lead}</p>
              <div className={s.actions}>
                <Link href="/login" className="btn">{L.ctaPrimary}</Link>
                <a href={WHATSAPP_URL} className="btn secondary" target="_blank" rel="noopener"><WhatsAppMark size={18} />{L.ctaWhatsapp}</a>
              </div>
              <p className={s.fact}>{L.fact}</p>
            </div>
            <div className={s.art}>
              <div className={s.window} aria-hidden="true">
                <div className={s.winBar}>
                  <span className={s.winTitle}><Star size={14} /> {COPY.brand.name}</span>
                  <span className={s.winMeter}><i /></span>
                </div>
                <div className={s.thread}>
                  {SAMPLE_CHAT.map((m, i) => (
                    <p key={i} className={m.role === "user" ? s.me : s.ai}>{m.text}</p>
                  ))}
                  <span className={s.typing}><i /><i /><i /></span>
                </div>
                <div className={s.composer}><span>{COPY.chat.placeholder}</span><span className={s.sendBtn}><IconSend width={18} height={18} /></span></div>
              </div>
              <div className={s.chartCard} aria-hidden="true">
                <span className="label">Kundli · Leo rising</span>
                <BirthChart chart={sampleChart("north")} />
              </div>
            </div>
          </div>
        </section>

        <section id="how" className={s.section}>
          <div className={s.wrap}>
            <h2 className={s.h2}>{L.howH2}</h2>
            <ol className={s.steps}>
              {L.how.map((step, i) => (
                <li key={step.t} className={s.step}>
                  <div className={s.stepArt} aria-hidden="true">
                    {i === 0 && (
                      <div className={s.miniForm}>
                        <span className={s.miniLabel}>Date of birth</span><span className={s.miniInput}>14 Aug 1996</span>
                        <span className={s.miniLabel}>Born in</span><span className={s.miniInput}>Jaipur, Rajasthan</span>
                        <span className={s.miniChips}><span>Morning</span><span data-on>Afternoon</span><span>Evening</span></span>
                      </div>
                    )}
                    {i === 1 && <div className={s.miniChart}><BirthChart chart={sampleChart("north")} /></div>}
                    {i === 2 && (
                      <div className={s.miniChat}>
                        <p className={s.me}>Job change karun ya ruk jaun?</p>
                        <p className={s.ai}>Saturn aapke 8th house se guzar raha hai. 2026 skills banane ka saal hai; badlav May 2027 ke baad behtar hai.</p>
                      </div>
                    )}
                  </div>
                  <h3 className={s.h3}>{step.t}</h3>
                  <p className="muted">{step.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${s.section} ${s.band}`}>
          <div className={`${s.wrap} ${s.split}`}>
            <div className={s.splitText}>
              <h2 className={s.h2}>{L.dailyH2}</h2>
              <p className={s.leadSm}>{L.dailyLead}</p>
            </div>
            <div className={s.dailyHolder}><DailyCard card={SAMPLE_CARD} /></div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <h2 className={s.h2}>{L.chartH2}</h2>
            <p className={s.leadSm}>{L.chartLead}</p>
            <div className={s.charts}>
              <figure className={s.chartFig}><BirthChart chart={sampleChart("north")} /><figcaption className="label">{COPY.home.styles.north}</figcaption></figure>
              <figure className={s.chartFig}><BirthChart chart={sampleChart("south")} /><figcaption className="label">{COPY.home.styles.south}</figcaption></figure>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.band}`}>
          <div className={s.wrap}>
            <h2 className={s.h2}>{L.channelsH2}</h2>
            <p className={s.leadSm}>{L.channelsLead}</p>
            <div className={s.channels}>
              <div className={s.channel}>
                <span className={s.channelHead}><WhatsAppMark size={20} /> WhatsApp</span>
                <p className={s.me}>Meri shaadi kab hogi?</p>
                <p className={s.ai}>Late 2027 se 2028 sabse achha samay hai.</p>
              </div>
              <div className={s.channel}>
                <span className={s.channelHead}><IconChat width={20} height={20} /> sidera.app</span>
                <p className={s.me}>Aur career?</p>
                <p className={s.ai}>2026 skills banane ka saal hai.</p>
              </div>
              <div className={s.channel}>
                <span className={s.channelHead}><IconHome width={20} height={20} /> Android app</span>
                <p className={s.me}>Aaj ka din kaisa hai?</p>
                <p className={s.ai}>Rohini mein Chandrama: paise ki baat ke liye achha din.</p>
                <span className={s.tabbar}><IconHome width={18} height={18} /><IconChat width={18} height={18} /><IconFriends width={18} height={18} /><IconProfile width={18} height={18} /></span>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className={s.section}>
          <div className={s.wrap}>
            <h2 className={s.h2}>{L.priceH2}</h2>
            <p className={s.leadSm}>{L.priceLead}</p>
            <div className={s.packs}>
              {PACKS.map((p) => (
                <div key={p.price} className={`${s.pack} ${p.best ? s.packBest : ""}`}>
                  {p.best && <span className={`label ${s.badge}`}>{COPY.credits.best}</span>}
                  <span className={s.packLabel}>{p.label}</span>
                  <span className={`${s.price} num`}>₹{p.price}</span>
                  <span className="muted">About {p.q} questions</span>
                  <Link href="/login" className={p.best ? "btn" : "btn secondary"}>{COPY.nav.start}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.band}`}>
          <div className={`${s.wrap} ${s.split}`}>
            <h2 className={s.h2}>{L.faqH2}</h2>
            <div className={s.faq}>
              {L.faq.map((f) => (
                <details key={f.q} className={s.faqItem}>
                  <summary>{f.q}</summary>
                  <p className="muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={s.close}>
          <div className={s.wrap}>
            <h2 className={s.closeH}>{L.closeH2}</h2>
            <div className={s.actions}>
              <Link href="/login" className="btn">{L.ctaPrimary}</Link>
              <a href={WHATSAPP_URL} className="btn secondary" target="_blank" rel="noopener"><WhatsAppMark size={18} />{L.ctaWhatsapp}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <Wordmark />
          <p className="muted">{L.footer}</p>
        </div>
      </footer>
    </div>
  );
}
