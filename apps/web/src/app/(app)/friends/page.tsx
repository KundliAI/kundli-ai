"use client";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { useLoad } from "@/lib/useApi";
import { checkBirthDate } from "@/lib/rules";
import { COPY } from "@/lib/copy";
import { WHATSAPP_NUMBER } from "@/lib/links";
import { IconPlus, WhatsAppMark } from "@/components/icons";
import s from "../app.module.css";

const F = COPY.friends;

export default function Friends() {
  const list = useLoad(() => api.friends());
  const ref = useLoad(() => api.referral());
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const bad = checkBirthDate(dob);
    if (bad) { setErr(bad === "future" ? COPY.onboarding.dobFuture : COPY.onboarding.dobInvalid); return; }
    const f = await api.addFriend({ name: name.trim(), birthDate: dob });
    list.setData([...(list.data ?? []), f]);
    setName(""); setDob(""); setAdding(false);
  }
  const invite = ref.data ? `https://wa.me/?text=${encodeURIComponent(`${COPY.home.referH}: ${ref.data.url}`)}` : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div className={`${s.page} ${s.narrow}`}>
      <header className={s.head}>
        <h1 className={s.h1}>{F.h1}</h1>
        <p className="muted">{F.lead}</p>
      </header>

      {list.data && list.data.length === 0 && !adding && <p className="muted">{F.empty}</p>}
      {list.data && list.data.length > 0 && (
        <div className={s.list}>
          {list.data.map((f) => (
            <div key={f.id} className={s.row}>
              <span><b>{f.name}</b><small>{F.sun} {f.sunSign} · {F.moon} {f.moonSign}</small><small>{f.todayLine}</small></span>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <form className={s.tile} onSubmit={add} noValidate>
          <label className="field" style={{ width: "100%" }}><span>{F.name}</span><input id="fname" className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></label>
          <label className="field" style={{ width: "100%" }}>
            <span>{COPY.onboarding.dobLabel}</span>
            <input id="fdob" className="input" type="date" value={dob} onChange={(e) => { setDob(e.target.value); setErr(null); }} />
            {err && <span className="error" role="alert">{err}</span>}
          </label>
          <button className="btn" type="submit" disabled={!name.trim() || !dob}>{F.save}</button>
        </form>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setAdding(true)}><IconPlus width={18} height={18} />{F.add}</button>
          <a className="btn secondary" href={invite} target="_blank" rel="noopener"><WhatsAppMark size={18} />{F.invite}</a>
        </div>
      )}
    </div>
  );
}
