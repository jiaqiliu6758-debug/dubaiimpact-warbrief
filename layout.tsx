import "./globals.css";
import LanguageSwitch from "@/components/LanguageSwitch";

export const metadata = {
  title: "DubaiImpact — WarBrief",
  description: "Daily core news, trends & Dubai impact (CN/EN).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, background: "#f7f7f8" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 10,
          backdropFilter: "blur(8px)",
          background: "rgba(247,247,248,0.85)",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <div style={{
            maxWidth: 980, margin: "0 auto", padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontWeight: 800 }}>DubaiImpact</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>WarBrief — Daily news, trends & Dubai impact</div>
            </div>
            <LanguageSwitch />
          </div>
        </header>

        <main style={{ maxWidth: 980, margin: "0 auto", padding: "16px" }}>
          {children}
        </main>

        <footer style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", opacity: 0.7, fontSize: 12 }}>
          <div>Public info summary. Not investment advice.</div>
        </footer>
      </body>
    </html>
  );
}
