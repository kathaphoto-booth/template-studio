"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquirePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [portalLink, setPortalLink] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the success heading so screen-reader / keyboard users are
  // told the inquiry succeeded (the view fully swaps and would otherwise drop
  // focus to <body> with no announcement).
  useEffect(() => {
    if (portalLink) headingRef.current?.focus();
  }, [portalLink]);

  function validate(): string {
    if (name.trim().length < 2) return "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
    if (date.trim().length === 0) return "Please choose your event date.";
    return "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: name.trim(),
          client_email: email.trim(),
          event_date: date.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.lead_hash) {
        setPortalLink(
          `${window.location.origin}/portal/${data.lead_hash}/template-design`
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (portalLink) {
    return (
      <main
        style={{
          minHeight: "100svh",
          background: "#EAE2D5",
          color: "#241E1A",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1
            ref={headingRef}
            tabIndex={-1}
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 400,
              fontSize: "2rem",
              letterSpacing: "-0.015em",
              outline: "none",
            }}
          >
            Thank you.
          </h1>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            We have recorded your inquiry. Your design link is on its way by email —
            or continue now:
          </p>
          <a
            href={portalLink}
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              background: "#8C382A",
              color: "#EAE2D5",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              padding: "1rem 2rem",
              textDecoration: "none",
            }}
          >
            Continue to your template
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#EAE2D5",
        color: "#241E1A",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 460,
          display: "grid",
          gap: "1.25rem",
        }}
      >
        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 400,
            fontSize: "2rem",
            letterSpacing: "-0.015em",
            margin: 0,
          }}
        >
          Commission Katha
        </h1>
        <label
          style={{
            display: "grid",
            gap: ".4rem",
            fontFamily: "Inter, sans-serif",
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            color: "#5A564E",
          }}
        >
          Name
          <input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: ".8rem",
              border: "1px solid #C4B59D",
              background: "transparent",
              fontFamily: "'EB Garamond', serif",
              fontSize: "1rem",
              borderRadius: 0,
            }}
          />
        </label>
        <label
          style={{
            display: "grid",
            gap: ".4rem",
            fontFamily: "Inter, sans-serif",
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            color: "#5A564E",
          }}
        >
          Email
          <input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: ".8rem",
              border: "1px solid #C4B59D",
              background: "transparent",
              fontFamily: "'EB Garamond', serif",
              fontSize: "1rem",
              borderRadius: 0,
            }}
          />
        </label>
        <label
          style={{
            display: "grid",
            gap: ".4rem",
            fontFamily: "Inter, sans-serif",
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            color: "#5A564E",
          }}
        >
          Event date
          <input
            aria-label="Event date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{
              padding: ".8rem",
              border: "1px solid #C4B59D",
              background: "transparent",
              fontFamily: "'EB Garamond', serif",
              fontSize: "1rem",
              borderRadius: 0,
            }}
          />
        </label>
        {error && (
          <p
            role="alert"
            style={{
              color: "#241E1A",
              fontFamily: "'EB Garamond', serif",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          style={{
            background: "#8C382A",
            color: "#EAE2D5",
            fontFamily: "Inter, sans-serif",
            fontSize: ".78rem",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            padding: "1rem",
            border: "none",
            borderRadius: 0,
            opacity: busy ? 0.6 : 1,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Sending…" : "Begin"}
        </button>
      </form>
    </main>
  );
}
