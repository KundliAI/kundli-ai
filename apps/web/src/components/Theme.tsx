// Appearance: "system" follows the device; "light" / "dark" are saved per browser.
const KEY = "sidera.theme";
export type ThemeChoice = "system" | "light" | "dark";

/** Runs before paint so a saved choice never flashes the other theme. */
export function ThemeScript() {
  const js = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

export function getTheme(): ThemeChoice {
  try {
    const t = localStorage.getItem(KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch { return "system"; }
}

export function setTheme(t: ThemeChoice) {
  try { if (t === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, t); } catch { /* storage blocked */ }
  if (t === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}
