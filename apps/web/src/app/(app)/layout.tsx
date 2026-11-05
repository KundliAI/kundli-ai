"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Me } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { WHATSAPP_URL } from "@/lib/links";
import { Wordmark } from "@/components/Wordmark";
import { CreditsBar } from "@/components/CreditsBar";
import { IconChat, IconFriends, IconHome, IconProfile, WhatsAppMark } from "@/components/icons";
import { MeCtx } from "@/components/MeContext";
import s from "./shell.module.css";


const TABS = [
  { href: "/home", label: COPY.nav.home, Icon: IconHome },
  { href: "/chat", label: COPY.nav.chat, Icon: IconChat },
  { href: "/friends", label: COPY.nav.friends, Icon: IconFriends },
  { href: "/profile", label: COPY.nav.profile, Icon: IconProfile },
];

/** Web: sidebar. Narrow screens: bottom bar, same four tabs as the app (D9). */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    void api.me().then((m) => {
      if (!m) router.replace("/login");
      else if (m.onboarding.step !== "done") router.replace("/onboarding");
      else setMe(m);
    });
  }, [router]);

  if (!me) return <div className={s.loading} aria-busy="true" />;

  return (
    <MeCtx.Provider value={{ me, setMe }}>
      <div className={s.shell}>
        <aside className={s.side}>
          <Wordmark href="/home" />
          <nav className={s.sideNav} aria-label="App">
            {TABS.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={s.sideLink} aria-current={path.startsWith(href) ? "page" : undefined}>
                <Icon />{label}
              </Link>
            ))}
          </nav>
          <div className={s.sideFoot}>
            <CreditsBar credits={me.credits} />
            <a className={s.sideLink} href={WHATSAPP_URL} target="_blank" rel="noopener"><WhatsAppMark />{COPY.nav.whatsapp}</a>
            <Link className={s.sideLink} href="/home#refer"><IconFriends />{COPY.nav.refer}</Link>
          </div>
        </aside>
        <main className={s.main}>{children}</main>
        <nav className={s.bottom} aria-label="App">
          {TABS.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={s.tab} aria-current={path.startsWith(href) ? "page" : undefined}>
              <Icon /><span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </MeCtx.Provider>
  );
}
