import type { DayBrief, Lang } from "@/lib/types";

function importanceLabel(n: 1 | 2 | 3, lang: Lang) {
  const map = { zh: { 3: "高", 2: "中", 1: "低" }, en: { 3: "High", 2: "Med", 1: "Low" } } as const;
  return map[lang][n];
}

export default function NewsList({ day, lang }: { day: DayBrief; lang: Lang }) {
  return (
    <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 12 }}>
      {day.news.map((n) => (
        <li key={n.id}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
            <strong>{n.title[lang]}</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{importanceLabel(n.importance, lang)} • {n.source_name}</span>
            {n.source_url ? (
              <a href={n.source_url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                {lang === "zh" ? "来源" : "Source"}
              </a>
            ) : null}
          </div>
          <div style={{ marginTop: 4, opacity: 0.9 }}>{n.take[lang]}</div>
        </li>
      ))}
    </ol>
  );
}
