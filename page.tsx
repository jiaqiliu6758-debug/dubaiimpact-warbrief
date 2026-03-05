import { loadDay } from "@/lib/content";
import type { Lang } from "@/lib/types";
import SectionCard from "@/components/SectionCard";
import NewsList from "@/components/NewsList";
import ImpactGrid from "@/components/ImpactGrid";

export default async function DayPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ lang?: Lang }>;
}) {
  const { date } = await params;
  const sp = await searchParams;
  const lang: Lang = sp.lang === "en" ? "en" : "zh";

  const day = loadDay(date);

  if (!day) {
    return (
      <SectionCard title={lang === "zh" ? "未找到" : "Not found"}>
        <p style={{ margin: 0 }}>{lang === "zh" ? `没有 ${date} 的内容。` : `No content for ${date}.`}</p>
        <p style={{ marginTop: 8, marginBottom: 0 }}>
          <a href={`/?lang=${lang}`}>{lang === "zh" ? "返回今日" : "Back to Today"}</a>
        </p>
      </SectionCard>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionCard title={lang === "zh" ? `日报 · ${day.date}` : `Daily brief · ${day.date}`}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{day.headline[lang]}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {lang === "zh" ? "更新时间" : "Updated"}: {new Date(day.updated_at).toLocaleString()}
        </div>
        <div style={{ marginTop: 8 }}>
          <a href={`/archive?lang=${lang}`}>{lang === "zh" ? "返回归档" : "Back to archive"}</a>
        </div>
      </SectionCard>

      <SectionCard title={lang === "zh" ? "趋势判断" : "Trend"}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{day.trend.summary[lang]}</div>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
          {day.trend.signals.map((s, idx) => (
            <li key={idx}>
              <div><strong>{s.signal[lang]}</strong></div>
              <div style={{ opacity: 0.9 }}>{s.meaning[lang]}</div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title={lang === "zh" ? "核心新闻" : "Core news"}>
        <NewsList day={day} lang={lang} />
      </SectionCard>

      <SectionCard title={lang === "zh" ? "对迪拜居民影响" : "Impact on Dubai"}>
        <ImpactGrid day={day} lang={lang} />
      </SectionCard>

      <SectionCard title={lang === "zh" ? "来源与口径" : "Sources & methodology"}>
        <p style={{ margin: 0 }}>{day.sources_note[lang]}</p>
      </SectionCard>
    </div>
  );
}
