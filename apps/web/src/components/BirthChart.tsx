"use client";
import type { Chart, PlanetId } from "@/lib/types";
import { NORTH_HOUSE_ANCHORS, NORTH_SIGN_ANCHORS, SOUTH_SIGN_CELLS, signOfHouse } from "@/lib/rules";
import { COPY } from "@/lib/copy";
import styles from "./BirthChart.module.css";

const SHORT: Record<PlanetId, string> = { Su: "Su", Mo: "Mo", Ma: "Ma", Me: "Me", Ju: "Ju", Ve: "Ve", Sa: "Sa", Ra: "Ra", Ke: "Ke" };

function label(chart: Chart, filter: (p: Chart["planets"][number]) => boolean): string[] {
  return chart.planets.filter(filter).map((p) => SHORT[p.id] + (p.retro ? "ʀ" : ""));
}

/** North or South Indian kundli drawn from the same chart data. */
export function BirthChart({ chart, size = 320 }: { chart: Chart; size?: number }) {
  const title = `${COPY.home.styles[chart.style]} chart. Ascendant ${COPY.signs[chart.ascSign - 1]}.`;
  return (
    <svg className={styles.chart} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title}>
      {chart.style === "north" ? <North chart={chart} /> : <South chart={chart} />}
    </svg>
  );
}

function Stack({ x, y, items, asc }: { x: number; y: number; items: string[]; asc?: boolean }) {
  const lines = asc ? ["Asc", ...items] : items;
  const start = y - ((lines.length - 1) * 4.6) / 2;
  return (
    <>
      {lines.map((t, i) => (
        <text key={t + i} x={x} y={start + i * 4.6} className={i === 0 && asc ? styles.asc : styles.planet} textAnchor="middle" dominantBaseline="middle">{t}</text>
      ))}
    </>
  );
}

function North({ chart }: { chart: Chart }) {
  return (
    <g>
      <rect x="1" y="1" width="98" height="98" className={styles.frame} />
      <path d="M1 1 99 99M99 1 1 99M50 1 99 50 50 99 1 50Z" className={styles.line} />
      {NORTH_HOUSE_ANCHORS.map(([x, y], i) => (
        <Stack key={i} x={x} y={y} asc={i === 0} items={label(chart, (p) => p.house === i + 1)} />
      ))}
      {NORTH_SIGN_ANCHORS.map(([x, y], i) => (
        <text key={"s" + i} x={x} y={y} className={styles.sign} textAnchor="middle" dominantBaseline="middle">{signOfHouse(chart.ascSign, i + 1)}</text>
      ))}
    </g>
  );
}

function South({ chart }: { chart: Chart }) {
  const c = 98 / 4;
  return (
    <g>
      <rect x="1" y="1" width="98" height="98" className={styles.frame} />
      {SOUTH_SIGN_CELLS.map(([col, row], i) => {
        const sign = i + 1;
        const x = 1 + col * c, y = 1 + row * c;
        return (
          <g key={sign}>
            <rect x={x} y={y} width={c} height={c} className={styles.cell} />
            {sign === chart.ascSign && <path d={`M${x} ${y + 7}L${x + 7} ${y}`} className={styles.ascMark} />}
            <text x={x + c - 2.5} y={y + 4.5} className={styles.sign} textAnchor="end">{COPY.signs[i].slice(0, 3)}</text>
            <Stack x={x + c / 2} y={y + c / 2 + 2} items={label(chart, (p) => p.sign === sign)} />
          </g>
        );
      })}
      <text x="50" y="47" className={styles.centre} textAnchor="middle">{COPY.home.styles.south}</text>
      <text x="50" y="54" className={styles.centreSub} textAnchor="middle">{chart.nakshatra}</text>
    </g>
  );
}
