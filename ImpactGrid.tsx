import type { DayBrief, Lang, ImpactLevel } from "@/lib/types";
import SectionCard from "./SectionCard";

function levelBadge(level: ImpactLevel, lang: Lang) {
  const label = lang === "zh"
    ? ({ low: "低", medium: "中", high: "高" } as const)[level]
    : ({ low: "Low", medium: "Med", high: "High" } as const)[level];

  return (
    <span style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "2px 10px", fontSize: 12, opacity: 0.8 }}>
      {label}
    </span>
  );
}

export default function ImpactGrid({ day, lang }: { day: DayBrief; lang: Lang }) {
  const items = [
    { key: "security", title: lang === "zh" ? "安全" : "Security" },
    { key: "travel", title: lang === "zh" ? "出行" : "Travel" },
    { key: "markets", title: lang === "zh" ? "金融市场" : "Markets" },
    { key: "life", title: lang === "zh" ? "生活服务" : "Daily Life" },
    { key: "real_estate", title: lang === "zh" ? "房地产" : "Real Estate" },
  ] as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
      {items.map((it) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sec = (day.impact as any)[it.key];
        return (
          <SectionCard key={it.key} title={it.title}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{lang === "zh" ? "影响等级" : "Impact"}</div>
              {levelBadge(sec.impact_level, lang)}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <strong>{lang === "zh" ? "今天变化" : "What changed"}</strong>
                <div style={{ opacity: 0.9 }}>{sec.what_changed[lang]}</div>
              </div>
              <div>
                <strong>{lang === "zh" ? "怎么做" : "What to do"}</strong>
                <div style={{ opacity: 0.9 }}>{sec.what_to_do[lang]}</div>
              </div>
              <div>
                <strong>{lang === "zh" ? "明日关注" : "Watchlist"}</strong>
                <div style={{ opacity: 0.9 }}>{sec.watchlist[lang]}</div>
              </div>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
