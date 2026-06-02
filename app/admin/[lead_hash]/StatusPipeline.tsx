"use client";

import { useState } from "react";

const PIPELINE_STAGES = ["Inquired", "Selected", "In-Design", "Approved"] as const;
type Stage = (typeof PIPELINE_STAGES)[number];

export function StatusPipeline({ currentStatus, leadHash }: { currentStatus: string; leadHash: string }) {
  const [status, setStatus] = useState<Stage>((currentStatus as Stage) ?? "Inquired");
  const [saving, setSaving] = useState(false);

  const currentIndex = PIPELINE_STAGES.indexOf(status);
  const isApproved = status === "Approved";

  const advance = async () => {
    if (isApproved || saving || currentIndex === -1) return;
    const next = PIPELINE_STAGES[currentIndex + 1];
    setStatus(next);
    setSaving(true);
    await fetch("/api/admin/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_hash: leadHash, status: next }),
    });
    setSaving(false);
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.25em", color: "#5A5D5A", marginBottom: "20px" }}>
        Status Pipeline
      </p>

      {/* Thread line */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0", marginBottom: "24px" }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const done = PIPELINE_STAGES.indexOf(stage) <= currentIndex;
          const isLast = i === PIPELINE_STAGES.length - 1;
          const nextDone = !isLast && PIPELINE_STAGES.indexOf(PIPELINE_STAGES[i + 1]) <= currentIndex;
          return (
            <div key={stage} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: done ? "#EAE2D5" : "transparent",
                  border: `1.5px solid ${done ? "#EAE2D5" : "#5A5D5A"}`,
                }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: done ? "#EAE2D5" : "#5A5D5A", whiteSpace: "nowrap" }}>
                  {stage}
                </span>
              </div>
              {!isLast && (
                <div style={{ width: "56px", height: "1px", background: nextDone ? "#C4B59D" : "rgba(90,93,90,0.35)", margin: "0 8px", marginBottom: "26px", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {isApproved ? (
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#8C382A", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "16px" }}>⬡</span> KTHA — Brass Ring Sealed
        </div>
      ) : (
        <button
          onClick={advance}
          disabled={saving}
          style={{ backgroundColor: "#8C382A", color: "#EAE2D5", border: "none", padding: "10px 24px", fontFamily: "'Inter', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Saving…" : `Mark as ${PIPELINE_STAGES[Math.min(currentIndex + 1, PIPELINE_STAGES.length - 1)]}`}
        </button>
      )}
    </div>
  );
}
