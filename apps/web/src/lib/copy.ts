import en from "../copy/en.json";

export const COPY = en;

/** Replaces {KEY} placeholders. Unknown keys are left as they are. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{([A-Z_]+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
