"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Chart, ChatMessage } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { useMe } from "@/components/MeContext";
import { BirthChart } from "@/components/BirthChart";
import { IconEye, IconSend } from "@/components/icons";
import s from "./chat.module.css";

const C = COPY.chat;
type Notice = { kind: "error" | "nudge" | "blocked" | "textOnly"; retry?: string } | null;

export default function ChatPage() {
  return <Suspense><Chat /></Suspense>;
}

function Chat() {
  const params = useSearchParams();
  const { me, setMe } = useMe();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chart, setChart] = useState<Chart | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(me.credits.state === "empty" ? { kind: "blocked" } : null);
  const [incognito, setIncognito] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const asked = useRef(false);

  useEffect(() => {
    void api.messages().then(setMessages);
    void api.chart().then(setChart);
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [messages, busy]);
  useEffect(() => {
    const q = params.get("q");
    if (q && !asked.current) { asked.current = true; void send(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function send(raw: string) {
    const q = raw.trim();
    if (!q || busy) return;
    if (me.credits.state === "empty") { setNotice({ kind: "blocked" }); return; }
    setText(""); setBusy(true); setNotice(null);
    const mine: ChatMessage = { id: "local-" + Date.now(), role: "user", text: q, at: new Date().toISOString(), channel: "web" };
    setMessages((m) => [...m, mine]);
    try {
      const r = await api.ask(q, incognito);
      setMessages((m) => [...m, r.message]);
      setMe({ ...me, credits: r.credits });
      if (r.credits.state === "empty") setNotice({ kind: "blocked" });
      else if (r.nudge) setNotice({ kind: "nudge" });
    } catch (e) {
      const blocked = e instanceof Error && e.message.includes("402");
      setMessages((m) => m.filter((x) => x.id !== mine.id));
      setNotice(blocked ? { kind: "blocked" } : { kind: "error", retry: q });
    } finally { setBusy(false); }
  }

  function onPaste(e: React.ClipboardEvent) {
    if (e.clipboardData.files.length > 0) { e.preventDefault(); setNotice({ kind: "textOnly" }); }
  }

  const blocked = notice?.kind === "blocked";
  const lastAstro = [...messages].reverse().find((m) => m.role === "astrologer");

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <h1 className={s.title}>{C.title}</h1>
        <button className={s.incog} aria-pressed={incognito} onClick={() => setIncognito((v) => !v)}><IconEye width={18} height={18} />{C.incognito}</button>
      </header>
      {incognito && <p className={s.banner} role="status">{C.incognitoOn}</p>}

      <div className={s.thread} aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? s.rowMe : s.rowAi}>
            {m.chart && chart && <div className={s.chart}><BirthChart chart={chart} /></div>}
            <p className={m.role === "user" ? s.me : s.ai}>{m.text}</p>
            {m.channel === "whatsapp" && <span className={s.channel}>{C.fromWhatsapp}</span>}
          </div>
        ))}
        {busy && <div className={s.rowAi}><span className={s.typing} aria-label={C.thinking}><i /><i /><i /></span></div>}
        {!busy && lastAstro?.suggestions && !blocked && (
          <div className={s.suggest}>
            {lastAstro.suggestions.map((t) => <button key={t} className="chip" onClick={() => send(t)}>{t}</button>)}
          </div>
        )}
        <div ref={end} />
      </div>

      <div className={s.dock}>
        {notice && (
          <div className={`${s.notice} ${notice.kind === "error" ? s.noticeErr : ""}`} role="status">
            <span>{notice.kind === "error" ? C.error : notice.kind === "nudge" ? C.nudge : notice.kind === "textOnly" ? C.textOnly : me.credits.state === "trial" ? C.trialEnded : C.blocked}</span>
            {notice.kind === "error" && notice.retry && <button className="btn small secondary" onClick={() => send(notice.retry!)}>{C.retry}</button>}
            {(notice.kind === "nudge" || notice.kind === "blocked") && <Link className="btn small" href="/credits">{COPY.credits.buy}</Link>}
          </div>
        )}
        <form className={s.composer} onSubmit={(e) => { e.preventDefault(); void send(text); }}>
          <label htmlFor="msg" className="sr-only">{C.placeholder}</label>
          <textarea id="msg" rows={1} className={s.input} placeholder={C.placeholder} value={text} disabled={blocked}
            onChange={(e) => setText(e.target.value)} onPaste={onPaste}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(text); } }} />
          <button className={s.send} disabled={!text.trim() || busy || blocked} aria-label={C.send}><IconSend /></button>
        </form>
      </div>
    </div>
  );
}
