import type { SideraApi } from "./client.ts";

const TOKEN_KEY = "sidera.token";

function token(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function httpApi(base: string): SideraApi {
  async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const t = token();
    const res = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json", ...(t ? { authorization: `Bearer ${t}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  }
  return {
    startLogin: (phone, ref) => call("POST", "/auth/start", { phone, ref }),
    loginStatus: async (id) => {
      const s = await call<Awaited<ReturnType<SideraApi["loginStatus"]>>>("GET", `/auth/status/${id}`);
      if (s.token) { try { localStorage.setItem(TOKEN_KEY, s.token); } catch { /* private mode: session-only */ } }
      return s;
    },
    logout: async () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
    me: async () => (token() ? call("GET", "/me") : null),
    saveProfile: (patch) => call("PATCH", "/me/profile", patch),
    places: (q) => call("GET", `/places?q=${encodeURIComponent(q)}`),
    chart: (friendId) => call("GET", friendId ? `/chart?friendId=${friendId}` : "/chart"),
    dailyCard: () => call("GET", "/daily-card"),
    messages: () => call("GET", "/chat/messages"),
    ask: (text, incognito) => call("POST", "/chat/messages", { text, incognito }),
    clearChat: () => call("POST", "/chat/clear"),
    memory: () => call("GET", "/memory"),
    forget: (id) => call("DELETE", `/memory/${id}`),
    packs: () => call("GET", "/credits/packs"),
    createOrder: (packId) => call("POST", "/credits/orders", { packId }),
    order: (id) => call("GET", `/credits/orders/${id}`),
    friends: () => call("GET", "/friends"),
    addFriend: (input) => call("POST", "/friends", input),
    referral: () => call("GET", "/referral"),
    deleteAccount: () => call("DELETE", "/me"),
  };
}

export class ApiError extends Error {
  constructor(readonly status: number, body: string) {
    super(`API ${status}: ${body.slice(0, 200)}`);
  }
}
