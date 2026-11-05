// In-browser stand-in for the customer API, used until the Supabase
// `customer-api` function ships. Same shapes as packages/api/openapi.yaml.
import type { SideraApi } from "./client.ts";
import type { Chart, ChatMessage, Credits, Me, Place, Planet, PlanetId } from "../types.ts";
import { creditBand, defaultChartStyle } from "../rules.ts";

const KEY = "sidera.mock.v1";
const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const id = () => Math.random().toString(36).slice(2, 10);

interface State {
  me: Me | null;
  messages: ChatMessage[];
  memory: { id: string; text: string; at: string }[];
  friends: { id: string; name: string; sunSign: string; moonSign: string; todayLine: string }[];
  challenge?: { id: string; startedAt: number };
  orders: Record<string, { state: "created" | "pending" | "paid" | "failed"; packId: string; at: number }>;
}

const PLACES: Place[] = [
  ["Jaipur", "Rajasthan, India"], ["Delhi", "Delhi, India"], ["Mumbai", "Maharashtra, India"],
  ["Lucknow", "Uttar Pradesh, India"], ["Varanasi", "Uttar Pradesh, India"], ["Kolkata", "West Bengal, India"],
  ["Chennai", "Tamil Nadu, India"], ["Madurai", "Tamil Nadu, India"], ["Bengaluru", "Karnataka, India"],
  ["Hyderabad", "Telangana, India"], ["Kochi", "Kerala, India"], ["Vijayawada", "Andhra Pradesh, India"],
  ["Pune", "Maharashtra, India"], ["Ahmedabad", "Gujarat, India"], ["Patna", "Bihar, India"],
  ["Bhopal", "Madhya Pradesh, India"], ["Indore", "Madhya Pradesh, India"], ["Chandigarh", "Chandigarh, India"],
].map(([name, region]) => ({ id: name.toLowerCase(), name, region, tz: "Asia/Kolkata", defaultChartStyle: defaultChartStyle(region) }));

function midnight(): string {
  const d = new Date(); d.setHours(24, 0, 0, 0); return d.toISOString();
}
function credits(fraction: number, trial = false): Credits {
  const band = creditBand(fraction);
  return { state: trial && band !== "empty" ? "trial" : band === "ok" ? "active" : band, fraction, resetsAt: midnight() };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch { /* storage blocked: fall through to a fresh state */ }
  return { me: null, messages: [], memory: [], friends: [], orders: {} };
}
function save(s: State) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked: state lives for this page only */ }
}
let state: State | null = null;
const s = () => (state ??= load());
const commit = () => save(s());

const ASC = 5; // Leo rising in the sample chart
const P: [PlanetId, number, number, boolean?][] = [
  ["Su", 9, 12.4], ["Mo", 2, 3.1], ["Ma", 11, 21.7], ["Me", 9, 27.9], ["Ju", 6, 8.3, true],
  ["Ve", 10, 2.2], ["Sa", 12, 15.6], ["Ra", 1, 9.8, true], ["Ke", 7, 9.8, true],
];
function chart(style: Chart["style"]): Chart {
  const planets: Planet[] = P.map(([pid, sign, degree, retro]) => ({ id: pid, sign, degree, retro, house: ((sign - ASC + 12) % 12) + 1 }));
  return { ascSign: ASC, moonSign: 2, sunSign: 9, nakshatra: "Rohini", planets, style, dasha: "Venus – Saturn until Mar 2027" };
}

function answer(q: string, name: string): string {
  const t = q.toLowerCase();
  if (/shaadi|marri|vivah|शादी/.test(t))
    return `${name}, your 7th house is Aquarius and its lord Saturn sits in the 5th, in Pisces. That points to a marriage that grows out of friendship or shared work. Your Venus–Saturn period runs to March 2027; the stronger window opens with Jupiter's move into your 7th from late 2027 into 2028.`;
  if (/job|career|naukri|kaam|promotion|business/.test(t))
    return `Your 10th house is Taurus with Venus as its lord, placed in the 3rd. Work that uses your voice and your hands suits you: writing, design, sales, teaching. Saturn's transit through your 8th makes 2026 a year for building skills rather than switching jobs. Changes look better after May 2027.`;
  if (/health|sehat|tabiyat/.test(t))
    return `Your 6th house lord Saturn is steady, and the Moon in Taurus gives good stamina. Watch sleep and digestion during the Saturn transit; routine helps more than remedies here. This is guidance, not medical advice.`;
  return `Here is what your chart says. Your Moon is in Rohini, which gives a steady, caring mind that likes things settled before it moves. Right now you are in Venus–Saturn: slow, patient progress that pays off later. Ask me about a specific area, like marriage, career or money, and I'll go deeper.`;
}

export const mockApi: SideraApi = {
  async startLogin(phone) {
    await wait();
    const cid = id();
    s().challenge = { id: cid, startedAt: Date.now() };
    if (!s().me || s().me?.phone !== phone) {
      s().me = {
        id: id(), phone, onboarding: { step: "consent", questionnaireDone: false }, profile: {},
        credits: credits(1, true), settings: { language: "en", chartStyle: "north" },
      };
      s().messages = [];
    }
    commit();
    const code = "SID-" + String(Math.floor(1000 + Math.random() * 9000));
    return {
      challengeId: cid, code, triesLeft: 5,
      whatsappUrl: `https://wa.me/916377943974?text=${encodeURIComponent(code)}`,
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    };
  },
  async loginStatus(cid) {
    await wait(200);
    const c = s().challenge;
    if (!c || c.id !== cid) return { state: "expired" };
    // The mock verifies a few seconds after the code is shown.
    if (Date.now() - c.startedAt > 4000) {
      try { localStorage.setItem("sidera.token", "mock"); } catch { /* ignore */ }
      return { state: "verified", token: "mock" };
    }
    return { state: "waiting" };
  },
  async logout() {
    try { localStorage.removeItem("sidera.token"); } catch { /* ignore */ }
  },
  async me() {
    await wait(120);
    let signed = false;
    try { signed = localStorage.getItem("sidera.token") !== null; } catch { /* ignore */ }
    return signed ? s().me : null;
  },
  async saveProfile(patch) {
    await wait(200);
    const me = s().me;
    if (!me) throw new Error("not signed in");
    const { step, language, chartStyle, questionnaireDone, ...profile } = patch;
    me.profile = { ...me.profile, ...profile };
    if (profile.name) me.name = profile.name;
    if (step) me.onboarding.step = step;
    if (questionnaireDone !== undefined) me.onboarding.questionnaireDone = questionnaireDone;
    if (language) me.settings.language = language;
    if (profile.place) me.settings.chartStyle = profile.place.defaultChartStyle;
    if (chartStyle) me.settings.chartStyle = chartStyle;
    if (step === "done" && s().messages.length === 0) {
      s().messages.push({
        id: id(), role: "astrologer", at: new Date().toISOString(), channel: "web", chart: true,
        text: `Namaste ${me.name ?? ""}. Here is your kundli. You are Leo rising with the Moon in Rohini nakshatra, and you are in the Venus–Saturn period. What would you like to know first?`,
        suggestions: ["Career", "Marriage", "Health"],
      });
    }
    commit();
    return me;
  },
  async places(q) {
    await wait(150);
    const t = q.trim().toLowerCase();
    return t ? PLACES.filter((p) => p.name.toLowerCase().startsWith(t) || p.region.toLowerCase().includes(t)).slice(0, 6) : [];
  },
  async chart() {
    await wait(150);
    return chart(s().me?.settings.chartStyle ?? "north");
  },
  async dailyCard() {
    await wait(150);
    const d = new Date();
    const locked = (s().me?.credits.fraction ?? 0) <= 0;
    return {
      date: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
      tithi: "Shukla Panchami", nakshatra: "Rohini",
      line: "A steady day for money talks. Wait on big purchases till evening.",
      detail: locked ? undefined : "The Moon in Rohini favours slow, patient work: paperwork, savings, family plans. Mars squares your 4th house, so keep home conversations short and kind. Good for starting a habit, not for ending one.",
      luckyColour: locked ? undefined : "Saffron",
      goodHours: locked ? undefined : "10:40 am – 12:15 pm",
      locked,
    };
  },
  async messages() {
    await wait(150);
    return s().messages;
  },
  async ask(text, incognito) {
    const me = s().me;
    if (!me) throw new Error("not signed in");
    if (me.credits.fraction <= 0) throw new Error("402");
    const q: ChatMessage = { id: id(), role: "user", text, at: new Date().toISOString(), channel: "web" };
    if (!incognito) s().messages.push(q);
    await wait(1400);
    const next = Math.max(0, +(me.credits.fraction - 0.12).toFixed(2));
    me.credits = credits(next, me.credits.state === "trial");
    const a: ChatMessage = {
      id: id(), role: "astrologer", text: answer(text, me.name ?? "Friend"), at: new Date().toISOString(), channel: "web",
      suggestions: ["What should I do now?", "Any remedies?"],
    };
    if (!incognito) {
      s().messages.push(a);
      if (/shaadi|marri/i.test(text)) s().memory.push({ id: id(), text: "Asking about marriage timing", at: a.at });
    }
    commit();
    return { message: a, credits: me.credits, nudge: creditBand(next) === "low" };
  },
  async clearChat() { await wait(); s().messages = []; commit(); },
  async memory() {
    await wait(150);
    if (s().memory.length === 0 && s().me?.onboarding.step === "done") {
      s().memory = [
        { id: id(), text: "Works in design, thinking about a job change", at: new Date().toISOString() },
        { id: id(), text: "Prefers answers in Hinglish", at: new Date().toISOString() },
      ];
      commit();
    }
    return s().memory;
  },
  async forget(mid) { await wait(150); s().memory = s().memory.filter((m) => m.id !== mid); commit(); },
  async packs() {
    await wait(150);
    return [
      { id: "p49", label: "Quick question", priceInr: 49, questions: 5 },
      { id: "p149", label: "Deeper look", priceInr: 149, questions: 20, best: true },
      { id: "p399", label: "Whole year", priceInr: 399, questions: 60 },
    ];
  },
  async createOrder(packId) {
    await wait(300);
    const oid = "order_" + id();
    s().orders[oid] = { state: "pending", packId, at: Date.now() };
    commit();
    return { orderId: oid, state: "pending" };
  },
  async order(oid) {
    await wait(300);
    const o = s().orders[oid];
    if (!o) return { orderId: oid, state: "failed" };
    if (o.state === "pending" && Date.now() - o.at > 2500) {
      o.state = "paid";
      const me = s().me;
      if (me) me.credits = credits(1);
      commit();
    }
    return { orderId: oid, state: o.state, credits: s().me?.credits };
  },
  async friends() { await wait(150); return s().friends; },
  async addFriend({ name }) {
    await wait(300);
    const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const f = { id: id(), name, sunSign: SIGNS[name.length % 12], moonSign: SIGNS[(name.length * 5) % 12], todayLine: "Good day to reach out. Small plans go well." };
    s().friends.push(f); commit(); return f;
  },
  async referral() { await wait(150); return { url: "https://sidera.app/i/aarav7", joined: 1, monthlyCap: 5 }; },
  async deleteAccount() { await wait(); state = { me: null, messages: [], memory: [], friends: [], orders: {} }; commit(); await mockApi.logout(); },
};
