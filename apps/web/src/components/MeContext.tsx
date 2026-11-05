"use client";
import { createContext, useContext } from "react";
import type { Me } from "@/lib/types";

export const MeCtx = createContext<{ me: Me; setMe: (m: Me) => void } | null>(null);

export function useMe() {
  const v = useContext(MeCtx);
  if (!v) throw new Error("useMe outside the app shell");
  return v;
}
