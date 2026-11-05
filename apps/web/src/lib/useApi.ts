"use client";
import { useCallback, useEffect, useState } from "react";

/** Loads on mount and whenever `deps` change; `reload` fetches again. Errors are kept for the screen to show. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await run()); setError(null); }
    catch (e) { setError(e instanceof Error ? e : new Error(String(e))); }
    finally { setLoading(false); }
  }, [run]);
  useEffect(() => { void reload(); }, [reload]);
  return { data, error, loading, reload, setData };
}
