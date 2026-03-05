export type Lang = "en" | "zh";
export type SourceType = "official" | "mainstream" | "airline" | "market";
export type NewsTag = "security" | "travel" | "markets" | "life" | "real_estate";
export type TrendLevel = "escalated" | "cooling" | "mixed";
export type ImpactLevel = "low" | "medium" | "high";

export interface LocalizedText { zh: string; en: string; }

export interface NewsItem {
  id: string;
  title: LocalizedText;
  take: LocalizedText;
  source_name: string;
  source_type: SourceType;
  source_url?: string;
  published_at?: string;
  happened_at?: string;
  tags: NewsTag[];
  importance: 1 | 2 | 3;
}

export interface Trend {
  level: TrendLevel;
  summary: LocalizedText;
  signals: Array<{ signal: LocalizedText; meaning: LocalizedText }>;
}

export interface ImpactSection {
  impact_level: ImpactLevel;
  what_changed: LocalizedText;
  what_to_do: LocalizedText;
  watchlist: LocalizedText;
}

export interface DayBrief {
  date: string; // YYYY-MM-DD
  headline: LocalizedText;
  updated_at: string; // ISO
  sources_note: LocalizedText;
  trend: Trend;
  news: NewsItem[];
  impact: {
    security: ImpactSection;
    travel: ImpactSection;
    markets: ImpactSection;
    life: ImpactSection;
    real_estate: ImpactSection;
  };
  markets_note?: LocalizedText;
}
