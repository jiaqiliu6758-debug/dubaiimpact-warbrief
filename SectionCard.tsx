import React from "react";

export default function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      background: "white",
    }}>
      <h2 style={{ margin: 0, marginBottom: 12, fontSize: 18 }}>{title}</h2>
      {children}
    </section>
  );
}
