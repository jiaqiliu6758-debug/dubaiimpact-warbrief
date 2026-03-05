import fs from "node:fs";
import path from "node:path";
import Parser from "rss-parser";

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
};

type Source = { name: string; type: "official" | "mainstream" | "airline" | "market"; url: string };

const ROOT = process.cwd();
const DAYS_DIR = path.join(ROOT, "content", "days");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "config", "sources.json"), "utf-8")) as {
  topic_keywords: string[];
  rss_feeds: Source[];
};

function ymd(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchRssItems(maxPerFeed = 10): Promise<Array<{ source: Source; item: FeedItem }>> {
  const parser = new Parser();
  const out: Array<{ source: Source; item: FeedItem }> = [];

  for (const s of CONFIG.rss_feeds) {
    if (!s.url) continue;
    try {
      const feed = await parser.parseURL(s.url);
      const items = (feed.items ?? []).slice(0, maxPerFeed);
      for (const it of items) out.push({ source: s, item: it as FeedItem });
    } catch (e) {
      console.error(`RSS failed: ${s.name} (${s.url})`, e);
    }
  }
  return out;
}

function keywordFilter(rows: Array<{ source: Source; item: FeedItem }>): Array<{ source: Source; item: FeedItem }> {
  const kw = CONFIG.topic_keywords.map((k) => k.toLowerCase());
  return rows.filter(({ item }) => {
    const text = `${item.title ?? ""} ${item.contentSnippet ?? ""} ${item.content ?? ""}`.toLowerCase();
    return kw.some((k) => text.includes(k));
  });
}

async function openaiJson(prompt: string): Promise<any | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    console.error("OpenAI error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  // The Responses API returns text in output[0].content[0].text typically; but we requested json_object, so parse accordingly.
  // We'll try several shapes to be robust.
  const txt =
    data?.output?.[0]?.content?.[0]?.text ??
    data?.output_text ??
    data?.choices?.[0]?.message?.content;

  try {
    return typeof txt === "string" ? JSON.parse(txt) : txt;
  } catch {
    return null;
  }
}

function ensureDirs() {
  if (!fs.existsSync(DAYS_DIR)) fs.mkdirSync(DAYS_DIR, { recursive: true });
}

function writeDay(date: string, obj: any) {
  ensureDirs();
  const fp = path.join(DAYS_DIR, `${date}.json`);
  fs.writeFileSync(fp, JSON.stringify(obj, null, 2), "utf-8");
  console.log("Wrote:", fp);
}

function stubDay(date: string) {
  const nowIso = new Date().toISOString();
  return {
    date,
    headline: {
      zh: "自动日报生成中：请配置 OPENAI_API_KEY 以生成解释型内容。",
      en: "Auto-brief is running: set OPENAI_API_KEY to generate explanation-style content."
    },
    updated_at: nowIso,
    sources_note: {
      zh: "信息优先级：官方通告与航司公告 > 主流媒体快讯 > 市场波动解读。本文为公众信息整理与解释，不构成投资建议。",
      en: "Priority: official notices & airline updates > mainstream breaking news > market interpretation. Not investment advice."
    },
    trend: {
      level: "mixed",
      summary: { zh: "等待AI生成趋势判断。", en: "Waiting for AI-generated trend." },
      signals: [
        {
          signal: { zh: "待生成", en: "TBD" },
          meaning: { zh: "请配置 OpenAI Key。", en: "Please set OpenAI key." }
        }
      ]
    },
    news: [],
    impact: {
      security: { impact_level: "low", what_changed: { zh: "待生成", en: "TBD" }, what_to_do: { zh: "待生成", en: "TBD" }, watchlist: { zh: "待生成", en: "TBD" } },
      travel: { impact_level: "low", what_changed: { zh: "待生成", en: "TBD" }, what_to_do: { zh: "待生成", en: "TBD" }, watchlist: { zh: "待生成", en: "TBD" } },
      markets: { impact_level: "low", what_changed: { zh: "待生成", en: "TBD" }, what_to_do: { zh: "待生成", en: "TBD" }, watchlist: { zh: "待生成", en: "TBD" } },
      life: { impact_level: "low", what_changed: { zh: "待生成", en: "TBD" }, what_to_do: { zh: "待生成", en: "TBD" }, watchlist: { zh: "待生成", en: "TBD" } },
      real_estate: { impact_level: "low", what_changed: { zh: "待生成", en: "TBD" }, what_to_do: { zh: "待生成", en: "TBD" }, watchlist: { zh: "待生成", en: "TBD" } }
    }
  };
}

async function main() {
  const date = ymd(new Date()); // use UTC date (since cron is UTC 03:00)
  const itemsRaw = await fetchRssItems(12);
  const items = keywordFilter(itemsRaw).slice(0, 30);

  // Build a compact input for the model
  const compact = items.map(({ source, item }) => ({
    source_name: source.name,
    source_type: source.type,
    title: item.title ?? "",
    url: item.link ?? "",
    published_at: item.pubDate ?? "",
    snippet: (item.contentSnippet ?? "").slice(0, 280)
  }));

  const prompt = `You are an editor writing a bilingual (Chinese + English) daily brief for DubaiImpact/WarBrief.
Goal: explain the Iran–Israel conflict situation of the day, the core news and trend signals, and practical impact on Dubai residents and Dubai-based investors (web3/real estate/investment).
Tone: accessible, professional, explanation-first (Economist-like) + practical guidance.
Rules:
- Prefer official notices and airline updates; do NOT amplify unverified rumors.
- If you are uncertain, say it explicitly and focus on what to watch.
- Output MUST be a single JSON object that matches the schema below.
- Keep news items 5–10, each with a 1-sentence take.
- Include 3–5 trend signals.
- For each impact dimension (security/travel/markets/life/real_estate): impact_level low/medium/high and concise guidance.

Schema (keys & structure):
{
  "date": "YYYY-MM-DD",
  "headline": {"zh": "...", "en": "..."},
  "updated_at": "ISO8601",
  "sources_note": {"zh": "...", "en": "..."},
  "trend": {
    "level": "escalated|cooling|mixed",
    "summary": {"zh":"...", "en":"..."},
    "signals": [{"signal":{"zh":"...","en":"..."}, "meaning":{"zh":"...","en":"..."}}]
  },
  "news": [{
    "id":"n1",
    "title":{"zh":"...","en":"..."},
    "take":{"zh":"...","en":"..."},
    "source_name":"...",
    "source_type":"official|mainstream|airline|market",
    "source_url":"...",
    "published_at":"ISO or empty",
    "happened_at":"ISO or empty",
    "tags":["security|travel|markets|life|real_estate"],
    "importance":1|2|3
  }],
  "impact": {
    "security": {"impact_level":"low|medium|high","what_changed":{"zh":"...","en":"..."},"what_to_do":{"zh":"...","en":"..."},"watchlist":{"zh":"...","en":"..."}},
    "travel":   {"impact_level":"low|medium|high","what_changed":{"zh":"...","en":"..."},"what_to_do":{"zh":"...","en":"..."},"watchlist":{"zh":"...","en":"..."}},
    "markets":  {"impact_level":"low|medium|high","what_changed":{"zh":"...","en":"..."},"what_to_do":{"zh":"...","en":"..."},"watchlist":{"zh":"...","en":"..."}},
    "life":     {"impact_level":"low|medium|high","what_changed":{"zh":"...","en":"..."},"what_to_do":{"zh":"...","en":"..."},"watchlist":{"zh":"...","en":"..."}},
    "real_estate": {"impact_level":"low|medium|high","what_changed":{"zh":"...","en":"..."},"what_to_do":{"zh":"...","en":"..."},"watchlist":{"zh":"...","en":"..."}}
  }
}

Input items (may be empty): ${JSON.stringify(compact)}

If input items are empty, still produce a brief based on general risk framing and clearly say data is limited today.`;

  let day = await openaiJson(prompt);

  if (!day) {
    day = stubDay(date);
    // Attach a tiny list of items if we have them
    if (compact.length) {
      day.news = compact.slice(0, 6).map((c, i) => ({
        id: `n${i+1}`,
        title: { zh: c.title, en: c.title },
        take: { zh: "（待AI解读）", en: "(Awaiting AI interpretation)" },
        source_name: c.source_name,
        source_type: c.source_type,
        source_url: c.url,
        published_at: c.published_at,
        happened_at: "",
        tags: ["markets"],
        importance: 2
      }));
    }
  }

  // Normalize mandatory fields
  day.date = day.date || date;
  day.updated_at = day.updated_at || new Date().toISOString();

  writeDay(date, day);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
