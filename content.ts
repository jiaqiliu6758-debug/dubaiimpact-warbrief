import fs from "node:fs";
import path from "node:path";
import { DayBrief } from "./types";

const DAYS_DIR = path.join(process.cwd(), "content", "days");

export function listDays(): string[] {
  if (!fs.existsSync(DAYS_DIR)) return [];
  return fs
    .readdirSync(DAYS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}

export function loadDay(date: string): DayBrief | null {
  const file = path.join(DAYS_DIR, `${date}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw) as DayBrief;
}

export function loadLatestDay(): DayBrief | null {
  const days = listDays();
  if (days.length === 0) return null;
  return loadDay(days[0]);
}
