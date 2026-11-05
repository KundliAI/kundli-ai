"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useLoad } from "@/lib/useApi";
import { dayPartOf } from "@/lib/rules";
import { COPY, fill } from "@/lib/copy";
import { WHATSAPP_URL } from "@/lib/links";
import type { ChartStyle } from "@/lib/types";
import { useMe } from "@/components/MeContext";
import { DailyCard } from "@/components/DailyCard";
import { BirthChart } from "@/components/BirthChart";
import { CreditsBar } from "@/components/CreditsBar";
import { IconSend, WhatsAppMark } from "@/components/icons";
import s from "../app.module.css";

const H = COPY.home;

export default function Home() {
  const router = useRouter();
  const { me, setMe } = useMe();
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const card = useLoad(() => api.dailyCard());
  const chart = useLoad(() => api.chart(), [me.settings.chartStyle]);
  const ref = useLoad(() => api.referral());

  const part = dayPartOf(new Date().getHours());
  const greetingPart = part === "night" ? "evening" : part;

  async function switchStyle(style: ChartStyle) {
    setMe(await api.saveProfile({ chartStyle: style }));
  }
  async function share() {
    const text = card.data ? `${card.data.weekday}: ${card.data.nakshatra}. ${card.data.line}` : "";
    try {
      if (navigator.share) await navigator.share({ text, url: ref.data?.url });
      else await navigator.clipboard.writeText(`${text} ${ref.data?.url ?? ""}`);
    } catch { /* user cancelled the share sheet */ }
  }
  async function copyInvite() {
    if (!ref.data) return;
    try { await navigator.clipboard.writeText(ref.data.url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard blocked: the link stays visible to copy by hand */ }
  }
  const other: ChartStyle = me.settings.chartStyle === "north" ? "south" : "north";

  return (
    <div className={s.page}>
      <header className={s.head}>
        <h1 className={s.h1}>{fill(H.greeting, { PART: greetingPart, NAME: me.name ?? "" })}</h1>
        <div className={s.mobileOnly}><CreditsBar credits={me.credits} /></div>
      </header>

      <form className={s.ask} onSubmit={(e) => { e.preventDefault(); router.push(q.trim() ? `/chat?q=${encodeURIComponent(q.trim())}` : "/chat"); }}>
        <label htmlFor="ask" className="sr-only">{H.ask}</label>
        <input id="ask" className={s.askInput} placeholder={H.askPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={s.askBtn} aria-label={COPY.chat.send}><IconSend /></button>
      </form>

      <div className={s.grid}>
        <section className={s.col} aria-label={COPY.landing.dailyH2}>
          {card.data && <DailyCard card={card.data} onShare={share} />}
          {!me.onboarding.questionnaireDone && (
            <div className={s.tile}>
              <p className={s.tileH}>{H.quizCard}</p>
              <button className="btn small" onClick={async () => setMe(await api.saveProfile({ questionnaireDone: true }))}>{H.quizCta}</button>
            </div>
          )}
          <div className={s.tile} id="refer">
            <p className={s.tileH}>{H.referH}</p>
            <p className="muted">{H.referLead}</p>
            {ref.data && <p className={`${s.mono} num`}>{ref.data.url}</p>}
            <button className="btn secondary small" onClick={copyInvite}>{copied ? H.copied : H.referCta}</button>
          </div>
          <div className={s.tile}>
            <p className={s.tileH}>{H.waH}</p>
            <p className="muted">{H.waLead}</p>
            <a className="btn secondary small" href={WHATSAPP_URL} target="_blank" rel="noopener"><WhatsAppMark size={16} />{H.waCta}</a>
          </div>
        </section>

        <section className={`${s.col} ${s.chartCol}`} aria-labelledby="chart-h">
          <div className={s.chartTile}>
            <div className={s.rowBetween}>
              <h2 id="chart-h" className={s.h2}>{H.chartH}</h2>
              <button className="link" onClick={() => switchStyle(other)}>{fill(H.chartSwitch, { STYLE: H.styles[other] })}</button>
            </div>
            {chart.data && (
              <>
                <BirthChart chart={chart.data} />
                <dl className={s.facts}>
                  <div><dt className="label">Lagna</dt><dd>{COPY.signs[chart.data.ascSign - 1]}</dd></div>
                  <div><dt className="label">Moon</dt><dd>{COPY.signs[chart.data.moonSign - 1]}</dd></div>
                  <div><dt className="label">Nakshatra</dt><dd>{chart.data.nakshatra}</dd></div>
                  <div><dt className="label">{H.dasha}</dt><dd>{chart.data.dasha}</dd></div>
                </dl>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
