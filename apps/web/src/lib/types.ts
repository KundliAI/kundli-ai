// Mirrors packages/api/openapi.yaml. Keep the two in step.
export type Language = "en" | "hi" | "hinglish";
export type Interest = "marriage" | "career" | "relationship" | "family" | "personal";
export type DayPart = "morning" | "afternoon" | "evening" | "night";
export type ChartStyle = "north" | "south";
export type PlanetId = "Su" | "Mo" | "Ma" | "Me" | "Ju" | "Ve" | "Sa" | "Ra" | "Ke";
export type OnboardingStep = "consent" | "name" | "birthTime" | "place" | "interests" | "email" | "done";

export interface LoginChallenge { challengeId: string; code: string; whatsappUrl: string; expiresAt: string; triesLeft: number }
export interface LoginStatus { state: "waiting" | "verified" | "expired" | "locked"; token?: string; retryAfterSec?: number }

export interface Place { id: string; name: string; region: string; tz: string; defaultChartStyle: ChartStyle }

export interface Profile {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  birthDayPart?: DayPart;
  place?: Place;
  interests?: Interest[];
  backupEmail?: string;
  consentMemory?: boolean;
}

export interface Credits { state: "trial" | "active" | "low" | "empty"; fraction: number; resetsAt: string }

export interface Me {
  id: string;
  phone: string;
  name?: string;
  onboarding: { step: OnboardingStep; questionnaireDone: boolean };
  profile: Profile;
  credits: Credits;
  settings: { language: Language; chartStyle: ChartStyle };
}

export interface Planet { id: PlanetId; sign: number; house: number; degree: number; retro?: boolean }
export interface Chart { ascSign: number; moonSign: number; sunSign: number; nakshatra: string; planets: Planet[]; style: ChartStyle; dasha: string }

export interface DailyCard {
  date: string; weekday: string; tithi: string; nakshatra: string; line: string;
  detail?: string; luckyColour?: string; goodHours?: string; locked: boolean;
}

export interface ChatMessage {
  id: string; role: "user" | "astrologer" | "system"; text: string; at: string;
  channel?: "whatsapp" | "web" | "app"; chart?: boolean; suggestions?: string[];
}
export interface ChatReply { message: ChatMessage; credits: Credits; nudge: boolean }
export interface MemoryItem { id: string; text: string; at: string }
export interface CreditPack { id: string; label: string; priceInr: number; questions: number; best?: boolean }
export interface Order { orderId: string; state: "created" | "pending" | "paid" | "failed"; credits?: Credits }
export interface Friend { id: string; name: string; sunSign: string; moonSign: string; todayLine: string }
export interface Referral { url: string; joined: number; monthlyCap: number }
