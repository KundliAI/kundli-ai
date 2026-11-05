"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import { useLoad } from "@/lib/useApi";
import { COPY, fill } from "@/lib/copy";
import type { Order } from "@/lib/types";
import { useMe } from "@/components/MeContext";
import { CreditsBar } from "@/components/CreditsBar";
import s from "../app.module.css";
import c from "./credits.module.css";

const K = COPY.credits;

export default function Credits() {
  const { me, setMe } = useMe();
  const packs = useLoad(() => api.packs());
  const [picked, setPicked] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  useEffect(() => { if (packs.data && !picked) setPicked(packs.data.find((p) => p.best)?.id ?? packs.data[0]?.id ?? null); }, [packs.data, picked]);

  async function pay() {
    if (!picked) return;
    // With the real API this opens Razorpay Checkout for the order; the webhook credits it by order ID.
    const o = await api.createOrder(picked);
    setOrder(o);
    timer.current = setInterval(async () => {
      const st = await api.order(o.orderId);
      setOrder(st);
      if (st.state === "paid" || st.state === "failed") {
        if (timer.current) clearInterval(timer.current);
        if (st.credits) setMe({ ...me, credits: st.credits });
      }
    }, 1500);
  }
  const pack = packs.data?.find((p) => p.id === picked);

  return (
    <div className={`${s.page} ${s.narrow}`}>
      <header className={s.head}>
        <h1 className={s.h1}>{K.packsH}</h1>
        <p className="muted">{K.packsLead}</p>
      </header>
      <div className={s.tile}><CreditsBar credits={me.credits} /></div>

      {order && order.state !== "created" ? (
        <div className={c.status} data-state={order.state} role="status">
          <p className={c.statusH}>{order.state === "paid" ? K.paid : order.state === "failed" ? K.failed : K.pending}</p>
          {order.state === "pending" && <p className="muted">{K.pendingLead}</p>}
          {order.state === "failed" && <button className="btn" onClick={() => { setOrder(null); void pay(); }}>{K.retry}</button>}
          {order.state === "paid" && <a className="btn" href="/chat">{COPY.home.ask}</a>}
        </div>
      ) : (
        <>
          <div className={c.packs} role="radiogroup" aria-label={K.packsH}>
            {packs.data?.map((p) => (
              <button key={p.id} role="radio" aria-checked={picked === p.id} className={c.pack} onClick={() => setPicked(p.id)}>
                <span className={c.packTop}><b>{p.label}</b>{p.best && <span className={`label ${c.best}`}>{K.best}</span>}</span>
                <span className={`${c.price} num`}>₹{p.priceInr}</span>
                <span className="muted">{fill(K.questions, { N: p.questions })}</span>
              </button>
            ))}
          </div>
          <button className="btn block" disabled={!pack} onClick={pay}>{pack ? fill(K.pay, { PRICE: pack.priceInr }) : K.buy}</button>
        </>
      )}
    </div>
  );
}
