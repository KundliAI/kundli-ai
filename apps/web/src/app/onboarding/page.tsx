"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { checkBirthDate } from "@/lib/rules";
import type { Chart, DayPart, Interest, Me, OnboardingStep, Place } from "@/lib/types";
import { COPY, fill } from "@/lib/copy";
import { Wordmark } from "@/components/Wordmark";
import { BirthChart } from "@/components/BirthChart";
import s from "../auth.module.css";

const O = COPY.onboarding;
const ORDER: OnboardingStep[] = ["consent", "name", "birthTime", "place", "interests", "email", "done"];
const DAY_PARTS: DayPart[] = ["morning", "afternoon", "evening", "night"];
const INTERESTS: Interest[] = ["marriage", "career", "relationship", "family", "personal"];

export default function Onboarding() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [step, setStep] = useState<OnboardingStep>("consent");

  useEffect(() => {
    void api.me().then((m) => {
      if (!m) { router.replace("/login"); return; }
      setMe(m); setStep(m.onboarding.step); // resume at the last saved step
    });
  }, [router]);

  async function save(patch: Parameters<typeof api.saveProfile>[0], next: OnboardingStep) {
    const m = await api.saveProfile({ ...patch, step: next });
    setMe(m); setStep(next);
  }

  if (!me) return <div className={s.shell} aria-busy="true" />;
  const idx = ORDER.indexOf(step);
  const total = ORDER.length - 1;
  const back = idx > 0 && step !== "done" ? () => setStep(ORDER[idx - 1]) : undefined;

  return (
    <div className={s.shell}>
      <header className={s.top}><Wordmark href="/" /></header>
      <main className={s.main}>
        <div className={s.card}>
          <div className={s.stack}>
            {step !== "done" && (
              <>
                <div className={s.stepMeta}>
                  {back ? <button className="link" onClick={back}>{O.back}</button> : <span />}
                  <span>{fill(O.progress, { N: idx + 1, TOTAL: total })}</span>
                </div>
                <div className={s.progress}><i style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
              </>
            )}
            {step === "consent" && <Consent me={me} onNext={(memory) => save({ consentMemory: memory }, "name")} />}
            {step === "name" && <NameDob me={me} onNext={(name, birthDate) => save({ name, birthDate }, "birthTime")} />}
            {step === "birthTime" && <BirthTime me={me} onNext={(p) => save(p, "place")} />}
            {step === "place" && <PlaceStep me={me} onNext={(place) => save({ place }, "interests")} />}
            {step === "interests" && <Interests me={me} onNext={(interests) => save({ interests }, "email")} />}
            {step === "email" && <Email me={me} onNext={(backupEmail) => save(backupEmail ? { backupEmail } : {}, "done")} />}
            {step === "done" && <Done onQuiz={() => router.push("/home?quiz=1")} onChat={() => router.push("/chat")} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function Consent({ me, onNext }: { me: Me; onNext: (memory: boolean) => void }) {
  const [terms, setTerms] = useState(false);
  const [memory, setMemory] = useState(me.profile.consentMemory ?? true);
  return (
    <>
      <h1 className={s.h1}>{O.consentH}</h1>
      <p className="muted">{O.consentLead}</p>
      <label className={s.check}><input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /><span>{O.consentTerms}</span></label>
      <label className={s.check}><input id="memory" type="checkbox" checked={memory} onChange={(e) => setMemory(e.target.checked)} /><span>{O.consentMemory}<small>{O.consentMemoryHint}</small></span></label>
      <button className="btn block" disabled={!terms} onClick={() => onNext(memory)}>{O.next}</button>
    </>
  );
}

function NameDob({ me, onNext }: { me: Me; onNext: (name: string, dob: string) => void }) {
  const [name, setName] = useState(me.profile.name ?? "");
  const [dob, setDob] = useState(me.profile.birthDate ?? "");
  const [err, setErr] = useState<string | null>(null);
  function next(e: React.FormEvent) {
    e.preventDefault();
    const bad = checkBirthDate(dob);
    if (bad) { setErr(bad === "future" ? O.dobFuture : O.dobInvalid); return; }
    onNext(name.trim(), dob);
  }
  return (
    <form className={s.stack} onSubmit={next} noValidate>
      <h1 className={s.h1}>{O.nameH}</h1>
      <label className="field"><span>{O.nameLabel}</span><input id="name" className="input" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></label>
      <label className="field">
        <span>{O.dobLabel}</span>
        <input id="dob" className="input" type="date" max={new Date().toISOString().slice(0, 10)} min="1900-01-01" value={dob} onChange={(e) => { setDob(e.target.value); setErr(null); }} aria-invalid={!!err} />
        {err && <span className="error" role="alert">{err}</span>}
      </label>
      <button className="btn block" type="submit" disabled={!name.trim() || !dob}>{O.next}</button>
    </form>
  );
}

function BirthTime({ me, onNext }: { me: Me; onNext: (p: { birthTime?: string; birthDayPart?: DayPart }) => void }) {
  const [knows, setKnows] = useState<boolean | null>(me.profile.birthTime ? true : me.profile.birthDayPart ? false : null);
  const [time, setTime] = useState(me.profile.birthTime ?? "");
  const [part, setPart] = useState<DayPart | undefined>(me.profile.birthDayPart);
  return (
    <>
      <h1 className={s.h1}>{O.timeH}</h1>
      <div className={s.twoUp}>
        <button className="chip" aria-pressed={knows === true} onClick={() => setKnows(true)}>{O.timeYes}</button>
        <button className="chip" aria-pressed={knows === false} onClick={() => setKnows(false)}>{O.timeNo}</button>
      </div>
      {knows === true && (
        <label className="field"><span>{O.timeLabel}</span><input id="btime" className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
      )}
      {knows === false && (
        <div className="field">
          <span>{O.dayPartH}</span>
          <div className={s.chips} role="group" aria-label={O.dayPartH}>
            {DAY_PARTS.map((p) => <button key={p} className="chip" aria-pressed={part === p} onClick={() => setPart(p)}>{O.dayParts[p]}</button>)}
          </div>
        </div>
      )}
      <button className="btn block" disabled={knows === null || (knows ? !time : !part)}
        onClick={() => onNext(knows ? { birthTime: time } : { birthDayPart: part })}>{O.next}</button>
    </>
  );
}

function PlaceStep({ me, onNext }: { me: Me; onNext: (p: Place) => void }) {
  const [q, setQ] = useState(me.profile.place?.name ?? "");
  const [results, setResults] = useState<Place[]>([]);
  const [picked, setPicked] = useState<Place | undefined>(me.profile.place);
  useEffect(() => {
    if (picked && q === picked.name) return;
    const t = setTimeout(() => { void api.places(q).then(setResults); }, 200);
    return () => clearTimeout(t);
  }, [q, picked]);
  return (
    <>
      <h1 className={s.h1}>{O.placeH}</h1>
      <label className="field">
        <span>{O.placeLabel}</span>
        <input id="place" className="input" autoComplete="off" value={q} onChange={(e) => { setQ(e.target.value); setPicked(undefined); }} autoFocus />
        <span className="hint">{O.placeHint}</span>
      </label>
      {!picked && results.length > 0 && (
        <div className={s.options} role="listbox" aria-label={O.placeLabel}>
          {results.map((p) => (
            <button key={p.id} role="option" aria-selected={false} className={s.option} onClick={() => { setPicked(p); setQ(p.name); setResults([]); }}>
              {p.name}<small>{p.region}</small>
            </button>
          ))}
        </div>
      )}
      <button className="btn block" disabled={!picked} onClick={() => picked && onNext(picked)}>{O.next}</button>
    </>
  );
}

function Interests({ me, onNext }: { me: Me; onNext: (i: Interest[]) => void }) {
  const [sel, setSel] = useState<Interest[]>(me.profile.interests ?? []);
  const toggle = (i: Interest) => setSel((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]));
  return (
    <>
      <h1 className={s.h1}>{O.interestsH}</h1>
      <p className="muted">{O.interestsLead}</p>
      <div className={s.chips}>
        {INTERESTS.map((i) => <button key={i} className="chip" aria-pressed={sel.includes(i)} onClick={() => toggle(i)}>{O.interests[i]}</button>)}
      </div>
      <button className="btn block" onClick={() => onNext(sel)}>{O.next}</button>
    </>
  );
}

function Email({ me, onNext }: { me: Me; onNext: (e?: string) => void }) {
  const [email, setEmail] = useState(me.profile.backupEmail ?? "");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <>
      <h1 className={s.h1}>{O.emailH}</h1>
      <p className="muted">{O.emailLead}</p>
      <label className="field"><span>{O.emailLabel}</span><input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <div className={s.actions}>
        <button className="btn block" disabled={!valid} onClick={() => onNext(email)}>{O.next}</button>
        <button className="btn secondary block" onClick={() => onNext()}>{O.skip}</button>
      </div>
    </>
  );
}

function Done({ onQuiz, onChat }: { onQuiz: () => void; onChat: () => void }) {
  const [chart, setChart] = useState<Chart | null>(null);
  useEffect(() => { void api.chart().then(setChart); }, []);
  return (
    <>
      <h1 className={s.h1}>{O.doneH}</h1>
      {chart && <div className={s.doneChart}><BirthChart chart={chart} /></div>}
      <p className="muted">{O.doneLead}</p>
      <div className={s.actions}>
        <button className="btn block" onClick={onChat}>{O.doneChat}</button>
        <button className="btn secondary block" onClick={onQuiz}>{O.doneQuiz}</button>
      </div>
    </>
  );
}
