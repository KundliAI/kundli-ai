// Example content for the public website only (clearly a sample reading, not a user's data).
import type { Chart, DailyCard, PlanetId } from "./types.ts";

const ASC = 5;
const P: [PlanetId, number, number, boolean?][] = [
  ["Su", 9, 12.4], ["Mo", 2, 3.1], ["Ma", 11, 21.7], ["Me", 9, 27.9], ["Ju", 6, 8.3, true],
  ["Ve", 10, 2.2], ["Sa", 12, 15.6], ["Ra", 1, 9.8, true], ["Ke", 7, 9.8, true],
];
export function sampleChart(style: Chart["style"]): Chart {
  return {
    ascSign: ASC, moonSign: 2, sunSign: 9, nakshatra: "Rohini", style, dasha: "Venus – Saturn until Mar 2027",
    planets: P.map(([id, sign, degree, retro]) => ({ id, sign, degree, retro, house: ((sign - ASC + 12) % 12) + 1 })),
  };
}

export const SAMPLE_CARD: DailyCard = {
  date: "2026-11-05", weekday: "Thursday", tithi: "Shukla Panchami", nakshatra: "Rohini",
  line: "A steady day for money talks. Wait on big purchases till evening.",
  detail: "The Moon in Rohini favours slow, patient work: paperwork, savings, family plans. Keep home conversations short and kind. Good for starting a habit, not for ending one.",
  goodHours: "10:40 am – 12:15 pm", luckyColour: "Saffron", locked: false,
};

export const SAMPLE_CHAT = [
  { role: "user" as const, text: "Meri shaadi kab hogi?" },
  { role: "astrologer" as const, text: "Aapka 7th house Aquarius hai, aur uska lord Saturn 5th house mein hai. Dosti ya saath kaam se rishta banne ke yog hain. Late 2027 se 2028 sabse achha samay hai, jab Jupiter aapke 7th house mein aata hai." },
  { role: "user" as const, text: "Aur career?" },
];
