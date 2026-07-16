#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// api-smoke.mjs — contract smoke tests against the running dev server.
//
//   node scripts/api-smoke.mjs            # validation paths only (safe)
//   SMOKE_LIVE=1 node scripts/api-smoke.mjs  # also exercises real writes
//
// Default runs NEVER write to the live leads/selections tables — the
// env carries production Supabase keys. Live-write cases are gated.
// Exit non-zero on any failure.
// ════════════════════════════════════════════════════════════════════

const BASE = process.env.SMOKE_BASE || "http://localhost:3010";
const LIVE = process.env.SMOKE_LIVE === "1";

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true, detail: "" });
  } catch (err) {
    results.push({ name, ok: false, detail: err.message });
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function req(path, init) {
  const res = await fetch(BASE + path, init);
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON is asserted by callers */
  }
  return { status: res.status, body };
}

// ── /api/availability ─────────────────────────────────────────────────
await check("GET /api/availability — shape or honest 503", async () => {
  const { status, body } = await req("/api/availability");
  if (status === 200) {
    assert(Array.isArray(body?.dates), "200 but body.dates is not an array");
    assert(typeof body.minNoticeDays === "number", "missing minNoticeDays");
    for (const d of body.dates.slice(0, 5)) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(d.date), `non-ISO date: ${d.date}`);
      assert(["open", "booked"].includes(d.status), `bad status: ${d.status}`);
      assert(typeof d.selectable === "boolean", "missing selectable flag");
    }
  } else {
    assert(status === 503, `expected 200 or 503, got ${status}`);
    assert(typeof body?.error === "string", "503 without readable error");
  }
});

await check("GET /api/availability — selectable respects min notice", async () => {
  const { status, body } = await req("/api/availability");
  if (status !== 200) return; // covered above; honest failure is allowed
  const cutoff = new Date(Date.now() + body.minNoticeDays * 86_400_000)
    .toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
  for (const d of body.dates) {
    if (d.selectable) {
      assert(d.status === "open", `selectable but status=${d.status}`);
      assert(d.date >= cutoff, `selectable inside notice window: ${d.date}`);
    }
  }
});

// ── /api/selection — validation paths (no live writes) ───────────────
await check("POST /api/selection — missing fields → 400", async () => {
  const { status, body } = await req("/api/selection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ names: "Smoke Test" }),
  });
  assert(status === 400, `expected 400, got ${status}`);
  assert(body?.ok === false && typeof body?.error === "string", "400 without readable error");
});

await check("POST /api/selection — invalid JSON → 400", async () => {
  const { status } = await req("/api/selection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assert(status === 400, `expected 400, got ${status}`);
});

await check("POST /api/selection — forbidden brand word → 400", async () => {
  const { status, body } = await req("/api/selection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateId: "smoke",
      templateName: "A stunning premium plate",
      layout: "strip",
    }),
  });
  assert(status === 400, `expected 400, got ${status}`);
  assert(body?.ok === false, "forbidden-word payload not rejected");
});

// ── /api/lead — vendor validation paths (no live writes) ─────────────
await check("POST /api/lead — empty body → 4xx readable error", async () => {
  const { status, body } = await req("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert(status >= 400 && status < 500, `expected 4xx, got ${status}`);
  assert(typeof body?.error === "string", "4xx without readable error");
});

await check("POST /api/lead — bad email → 400", async () => {
  const { status, body } = await req("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Smoke Test",
      client_email: "not-an-email",
      event_date: "2026-12-01",
    }),
  });
  assert(status === 400, `expected 400, got ${status}`);
  assert(/email/i.test(body?.error || ""), "error does not mention email");
});

// ── live-write cases (opt-in only) ────────────────────────────────────
if (LIVE) {
  await check("POST /api/selection — valid payload → dispatch summary [LIVE]", async () => {
    const { status, body } = await req("/api/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: "smoke-test-plate",
        templateName: "Smoke Test Plate",
        layout: "strip",
        names: "SMOKE / DELETE ME",
        selectedAt: new Date().toISOString(),
      }),
    });
    assert([200, 202].includes(status), `expected 200/202, got ${status}`);
    assert(Array.isArray(body?.dispatch), "missing dispatch summary");
    for (const d of body.dispatch) {
      assert(typeof d.target === "string" && typeof d.ok === "boolean", "malformed dispatch entry");
    }
  });
} else {
  results.push({ name: "live-write cases", ok: true, detail: "skipped (set SMOKE_LIVE=1 to run)" });
}

// ── report ────────────────────────────────────────────────────────────
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
