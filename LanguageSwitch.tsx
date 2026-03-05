"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Lang } from "@/lib/types";

export default function LanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const lang = (search.get("lang") as Lang) || "zh";
  const nextLang = useMemo<Lang>(() => (lang === "zh" ? "en" : "zh"), [lang]);

  function setLang(l: Lang) {
    const params = new URLSearchParams(search.toString());
    params.set("lang", l);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中文</button>
      <button onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
      <span style={{ opacity: 0.6, fontSize: 12 }}>Switch: {nextLang.toUpperCase()}</span>
    </div>
  );
}
