import { listDays } from "@/lib/content";
import type { Lang } from "@/lib/types";
import SectionCard from "@/components/SectionCard";

export default async function Archive({ searchParams }: { searchParams: Promise<{ lang?: Lang }> }) {
  const sp = await searchParams;
  const lang: Lang = sp.lang === "en" ? "en" : "zh";

  const days = listDays();

  return (
    <SectionCard title={lang === "zh" ? "归档" : "Archive"}>
      {days.length === 0 ? (
        <p style={{ margin: 0 }}>{lang === "zh" ? "暂无归档。" : "No archive yet."}</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          {days.map((d) => (
            <li key={d}>
              <a href={`/day/${d}?lang=${lang}`}>{d}</a>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
