import Link from "next/link";
import { COPY } from "@/lib/copy";

/** Four-point star used as the mark until a real logo exists (D8). */
export function Star({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 0c.6 6.4 5 10.9 12 12-7 1.1-11.4 5.6-12 12-.6-6.4-5-10.9-12-12 7-1.1 11.4-5.6 12-12Z" />
    </svg>
  );
}

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="wordmark" aria-label={COPY.brand.name}>
      <Star />
      <span>{COPY.brand.name}</span>
    </Link>
  );
}
