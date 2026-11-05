"use client";
import { useState } from "react";
import Link from "next/link";
import type { DailyCard as Card } from "@/lib/types";
import { COPY } from "@/lib/copy";
import { IconLock, IconShare } from "./icons";
import styles from "./DailyCard.module.css";

/** D6: text-led, tap to flip. Locked cards show one line and a blur. */
export function DailyCard({ card, onShare }: { card: Card; onShare?: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const canFlip = !card.locked;
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.card} ${flipped ? styles.flipped : ""}`}
        onClick={() => canFlip && setFlipped((f) => !f)}
        aria-pressed={canFlip ? flipped : undefined}
        aria-label={canFlip ? COPY.home.dailyFlip : undefined}
        disabled={!canFlip}
      >
        <span className={styles.face}>
          <span className={`label ${styles.meta}`}>{card.weekday} · {card.tithi}</span>
          <span className={styles.nak}>{card.nakshatra}</span>
          <span className={styles.line}>{card.line}</span>
          {canFlip && <span className={styles.hint}>{COPY.home.dailyFlip}</span>}
        </span>
        {canFlip && (
          <span className={`${styles.face} ${styles.back}`}>
            <span className={styles.detail}>{card.detail}</span>
            <span className={styles.facts}>
              <span><span className="label">{COPY.home.goodHours}</span><b className="num">{card.goodHours}</b></span>
              <span><span className="label">{COPY.home.luckyColour}</span><b>{card.luckyColour}</b></span>
            </span>
          </span>
        )}
      </button>
      {card.locked ? (
        <div className={styles.lock}>
          <p className={styles.blur} aria-hidden="true">The Moon in {card.nakshatra} favours slow, patient work and family plans today.</p>
          <Link href="/credits" className="btn small"><IconLock width={16} height={16} />{COPY.home.dailyLocked}</Link>
        </div>
      ) : onShare && (
        <button type="button" className={`btn secondary small ${styles.share}`} onClick={onShare}><IconShare width={16} height={16} />{COPY.home.dailyShare}</button>
      )}
    </div>
  );
}
