"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { normaliseIndianPhone } from "@/lib/rules";
import type { LoginChallenge } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { Wordmark } from "@/components/Wordmark";
import { WhatsAppMark } from "@/components/icons";
import { SUPPORT_EMAIL } from "@/lib/links";
import s from "../auth.module.css";

const C = COPY.login;
type Stage = "phone" | "confirm" | "send" | "expired" | "locked";

export default function Login() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("phone");
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    const p = normaliseIndianPhone(raw);
    if (!p) { setError(C.invalid); return; }
    setError(null); setPhone(p); setStage("confirm");
  }

  async function start() {
    if (!phone) return;
    setBusy(true);
    try {
      const ref = new URLSearchParams(window.location.search).get("ref") ?? undefined;
      const ch = await api.startLogin(phone, ref);
      setChallenge(ch); setStage("send");
      if (poll.current) clearInterval(poll.current);
      poll.current = setInterval(async () => {
        const st = await api.loginStatus(ch.challengeId);
        if (st.state === "waiting") return;
        if (poll.current) clearInterval(poll.current);
        if (st.state === "verified") {
          const me = await api.me();
          router.replace(me?.onboarding.step === "done" ? "/home" : "/onboarding");
        } else setStage(st.state);
      }, 1500);
    } catch {
      setStage("locked");
    } finally { setBusy(false); }
  }

  const pretty = phone ? `+91 ${phone.slice(3, 8)} ${phone.slice(8)}` : "";

  return (
    <div className={s.shell}>
      <header className={s.top}><Wordmark /></header>
      <main className={s.main}>
        <div className={s.card}>
          {stage === "phone" && (
            <form className={s.stack} onSubmit={submitPhone} noValidate>
              <h1 className={s.h1}>{C.h1}</h1>
              <p className="muted">{C.lead}</p>
              <label className="field">
                <span>{C.phoneLabel}</span>
                <span className={s.phone}>
                  <span className={s.cc}>+91</span>
                  <input id="phone" className="input" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210"
                    value={raw} onChange={(e) => setRaw(e.target.value)} aria-invalid={!!error} aria-describedby="phone-hint" autoFocus />
                </span>
                {error ? <span className="error" role="alert">{error}</span> : <span id="phone-hint" className="hint">{C.phoneHint}</span>}
              </label>
              <button className="btn block" type="submit">{C.continue}</button>
              <p className={s.fine}>{C.noWhatsapp}</p>
            </form>
          )}

          {stage === "confirm" && (
            <div className={s.stack}>
              <h1 className={s.h1}>{C.confirmH}</h1>
              <p className={s.bigNum}>{pretty}</p>
              <button className="btn block" onClick={start} disabled={busy}>{C.continue}</button>
              <button className="btn secondary block" onClick={() => setStage("phone")}>{C.edit}</button>
            </div>
          )}

          {stage === "send" && challenge && (
            <div className={s.stack}>
              <h1 className={s.h1}>{C.sendH}</h1>
              <p className="muted">{C.sendLead}</p>
              <p className={s.code} aria-label={`Code ${challenge.code}`}>{challenge.code}</p>
              <a className="btn block" href={challenge.whatsappUrl} target="_blank" rel="noopener"><WhatsAppMark size={18} />{C.sendCta}</a>
              <p className={s.waiting} role="status"><span className={s.pulse} aria-hidden="true" />{C.waiting}</p>
              <button className="link" onClick={() => setStage("confirm")}>{C.edit} {pretty}</button>
            </div>
          )}

          {(stage === "expired" || stage === "locked") && (
            <div className={s.stack}>
              <h1 className={s.h1}>{stage === "expired" ? C.expired : C.locked}</h1>
              {stage === "expired" && <button className="btn block" onClick={start}>{C.newCode}</button>}
            </div>
          )}
        </div>
        <p className={s.below}><a className="link" href={`mailto:${SUPPORT_EMAIL}`}>{C.lostNumber}</a></p>
      </main>
    </div>
  );
}
