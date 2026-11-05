"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useLoad } from "@/lib/useApi";
import { COPY } from "@/lib/copy";
import { SUPPORT_EMAIL } from "@/lib/links";
import type { ChartStyle, Language } from "@/lib/types";
import { useMe } from "@/components/MeContext";
import { getTheme, setTheme, type ThemeChoice } from "@/components/Theme";
import { IconChevron } from "@/components/icons";
import s from "../app.module.css";

const P = COPY.profile;
const LANGS: Language[] = ["en", "hi", "hinglish"];
const THEMES: ThemeChoice[] = ["system", "light", "dark"];
const STYLES: ChartStyle[] = ["north", "south"];

export default function Profile() {
  const router = useRouter();
  const { me, setMe } = useMe();
  const memory = useLoad(() => api.memory());
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [confirm, setConfirm] = useState<"delete" | null>(null);
  useEffect(() => setThemeState(getTheme()), []);

  const pickTheme = (t: ThemeChoice) => { setTheme(t); setThemeState(t); };
  const logout = async () => { await api.logout(); router.replace("/"); };

  return (
    <div className={`${s.page} ${s.narrow}`}>
      <header className={s.head}>
        <h1 className={s.h1}>{me.name}</h1>
        <p className="muted num">{me.phone.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2")}</p>
      </header>

      <section className={s.section}>
        <h2 className={s.sectionH}>{COPY.nav.profile}</h2>
        <div className={s.list}>
          <Link className={s.row} href="/onboarding"><span>{P.birth}<small>{P.birthNote}</small></span><IconChevron /></Link>
          <div className={s.row}><span>{P.language}</span>
            <span className={s.seg} role="group" aria-label={P.language}>
              {LANGS.map((l) => <button key={l} aria-pressed={me.settings.language === l} onClick={async () => setMe(await api.saveProfile({ language: l }))}>{P.languages[l]}</button>)}
            </span>
          </div>
          <div className={s.row}><span>{P.chartStyle}</span>
            <span className={s.seg} role="group" aria-label={P.chartStyle}>
              {STYLES.map((st) => <button key={st} aria-pressed={me.settings.chartStyle === st} onClick={async () => setMe(await api.saveProfile({ chartStyle: st }))}>{COPY.home.styles[st]}</button>)}
            </span>
          </div>
          <div className={s.row}><span>{P.theme}</span>
            <span className={s.seg} role="group" aria-label={P.theme}>
              {THEMES.map((t) => <button key={t} aria-pressed={theme === t} onClick={() => pickTheme(t)}>{P.themes[t]}</button>)}
            </span>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionH}>{P.memory}</h2>
        <div className={s.list}>
          {memory.data?.length === 0 && <div className={s.row}><span className="muted">{P.memoryEmpty}</span></div>}
          {memory.data?.map((m) => (
            <div key={m.id} className={s.row}>
              <span>{m.text}</span>
              <button className="link" onClick={async () => { await api.forget(m.id); memory.setData(memory.data!.filter((x) => x.id !== m.id)); }}>{P.delete}</button>
            </div>
          ))}
          <button className={s.row} onClick={() => api.clearChat()}><span>{P.clearChat}<small>{P.clearChatNote}</small></span></button>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionH}>{P.help}</h2>
        <div className={s.list}>
          <a className={s.row} href={`mailto:${SUPPORT_EMAIL}`}><span>{P.human}</span><IconChevron /></a>
          <Link className={s.row} href="/login"><span>{P.changeNumber}</span><IconChevron /></Link>
          <button className={s.row} onClick={logout}><span>{P.logout}</span></button>
          {confirm === "delete" ? (
            <div className={s.row}>
              <span>{P.deleteAccountNote}</span>
              <button className="btn small" onClick={async () => { await api.deleteAccount(); router.replace("/"); }}>{P.deleteAccount}</button>
            </div>
          ) : (
            <button className={`${s.row} ${s.danger}`} onClick={() => setConfirm("delete")}><span>{P.deleteAccount}</span></button>
          )}
        </div>
      </section>
    </div>
  );
}
