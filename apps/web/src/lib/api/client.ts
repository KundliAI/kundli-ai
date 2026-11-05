import type {
  Chart, ChatMessage, ChatReply, CreditPack, DailyCard, Friend, LoginChallenge, LoginStatus,
  Me, MemoryItem, Order, Place, Profile, Referral, Language, ChartStyle,
} from "../types.ts";
import { mockApi } from "./mock.ts";
import { httpApi } from "./http.ts";

/** Everything the screens need from the backend. Matches packages/api/openapi.yaml. */
export interface SideraApi {
  startLogin(phone: string, ref?: string): Promise<LoginChallenge>;
  loginStatus(challengeId: string): Promise<LoginStatus>;
  logout(): Promise<void>;
  me(): Promise<Me | null>;
  saveProfile(patch: Profile & { step?: Me["onboarding"]["step"]; language?: Language; chartStyle?: ChartStyle; questionnaireDone?: boolean }): Promise<Me>;
  places(q: string): Promise<Place[]>;
  chart(friendId?: string): Promise<Chart>;
  dailyCard(): Promise<DailyCard>;
  messages(): Promise<ChatMessage[]>;
  ask(text: string, incognito: boolean): Promise<ChatReply>;
  clearChat(): Promise<void>;
  memory(): Promise<MemoryItem[]>;
  forget(id: string): Promise<void>;
  packs(): Promise<CreditPack[]>;
  createOrder(packId: string): Promise<Order>;
  order(orderId: string): Promise<Order>;
  friends(): Promise<Friend[]>;
  addFriend(input: { name: string; birthDate: string }): Promise<Friend>;
  referral(): Promise<Referral>;
  deleteAccount(): Promise<void>;
}

/** Real API when NEXT_PUBLIC_SIDERA_API is set, otherwise the in-browser mock. */
export const api: SideraApi = process.env.NEXT_PUBLIC_SIDERA_API
  ? httpApi(process.env.NEXT_PUBLIC_SIDERA_API)
  : mockApi;
