"use client";

import { useState } from "react";

export function SendPreview({ leadHash }: { leadHash: string }) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async () => {
    if (state === "sending" || state === "sent") return;
    setState("sending");
    const res = await fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_hash: leadHash, message: message.trim() || undefined }),
    });
    setState(res.ok ? "sent" : "error");
  };

  return (
    <div style={{ borderTop: "1px solid rgba(196,181,157,0.15)", paddingTop: "32px", marginTop: "8px" }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.25em", color: "#5A5D5A", marginBottom: "16px" }}>
        Send Preview to Client
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Optional note to include in the email…"
        rows={3}
        style={{ width: "100%", background: "rgba(196,181,157,0.07)", border: "1px solid rgba(196,181,157,0.2)", color: "#EAE2D5", fontFamily: "'EB Garamond', Georgia, serif", fontSize: "15px", padding: "12px 16px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: "14px" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={send}
          disabled={state === "sending" || state === "sent"}
          style={{
            backgroundColor: state === "sent" ? "#241E1A" : "#DCCBB5",
            color: state === "sent" ? "#EAE2D5" : "#110F0D",
            border: state === "sent" ? "1px solid rgba(196,181,157,0.3)" : "none",
            padding: "10px 24px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            cursor: state === "sending" || state === "sent" ? "default" : "pointer",
            opacity: state === "sending" ? 0.7 : 1,
          }}
        >
          {state === "sending" ? "Sending…" : state === "sent" ? "✓ Sent" : "Send to Client"}
        </button>
        {state === "sent" && (
          <span style={{ color: "#B5B8A3", fontSize: "13px", fontStyle: "italic" }}>
            Email delivered to client.
          </span>
        )}
        {state === "error" && (
          <span style={{ color: "#E4DACA", fontSize: "13px", borderLeft: "2px solid #E4DACA", paddingLeft: "8px" }}>
            Send failed — check Resend configuration.
          </span>
        )}
      </div>
    </div>
  );
}
