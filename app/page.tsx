import { loadLatestDay } from "@/lib/content";
import type { Lang } from "@/lib/types";
import SectionCard from "@/components/SectionCard";
import NewsList from "@/components/NewsList";
import ImpactGrid from "@/components/ImpactGrid";

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: Lang }> }) {
  const sp = await searchParams;
  const lang: Lang = sp.lang === "en" ? "en" : "zh";

  const day = loadLatestDay();

  if (!day) {
    return (
      <SectionCard title={lang === "zh" ? "暂无数据" : "No data yet"}>
        <p style={{ margin: 0 }}>
          {lang === "zh"
            ? "等待每日自动生成内容。你也可以先跑一次：npm run generate:daily"
            : "Waiting for the daily automation. You can also run once: npm run generate:daily"}
        </p>
      </SectionCard>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionCard title={lang === "zh" ? `今日摘要 · ${day.date}` : `Today · ${day.date}`}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{day.headline[lang]}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {lang === "zh" ? "更新时间" : "Updated"}: {new Date(day.updated_at).toLocaleString()}
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
        <p style={{ marginTop: 8, marginBottom: 0 }}>
          <a href={`/archive?lang=${lang}`}>{lang === "zh" ? "查看归档" : "View archive"}</a>
        </p>
      </SectionCard>
    </div>
  );
}
