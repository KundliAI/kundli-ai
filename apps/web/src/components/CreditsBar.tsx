import Link from "next/link";
import type { Credits } from "@/lib/types";
import { COPY, fill } from "@/lib/copy";
import styles from "./CreditsBar.module.css";

/** Balance as a bar, never a number, with the reset time and a buy link. */
export function CreditsBar({ credits, compact = false }: { credits: Credits; compact?: boolean }) {
  const pct = Math.round(Math.max(0, Math.min(1, credits.fraction)) * 100);
  const time = new Date(credits.resetsAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const state = credits.state === "trial" ? COPY.credits.trial : credits.state === "low" ? COPY.credits.low : credits.state === "empty" ? COPY.credits.empty : COPY.credits.label;
  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ""}`} data-state={credits.state}>
      <div className={styles.row}>
        <span className={styles.state}>{state}</span>
        {!compact && <span className="muted">{fill(COPY.credits.resets, { TIME: time })}</span>}
      </div>
      <div className={styles.track} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={COPY.credits.label}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <Link href="/credits" className={`link ${styles.buy}`}>{COPY.credits.buy}</Link>
    </div>
  );
}
