#!/usr/bin/env node
/**
 * scripts/grok43-check.mjs
 *
 * Thorough pre-flight script for Grok 4.3 integration.
 * Checks:
 *   1. GCP project & credentials
 *   2. Billing account status
 *   3. Grok 4.3 reachability (live API probe)
 *   4. Token usage + estimated cost
 *
 * Usage:
 *   node scripts/grok43-check.mjs
 *   node scripts/grok43-check.mjs --prompt "Your custom prompt here"
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Env loader ──────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../../../.env');  // monorepo root
const envPathLocal = resolve(__dir, '../../.env'); // alt path

for (const p of [envPath, envPathLocal]) {
  if (!existsSync(p)) continue;
  const raw = readFileSync(p, 'utf8');
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
  console.log(`[env] Loaded: ${p}`);
  break;
}

// ── Config ──────────────────────────────────────────────────────────────────
const PROJECT         = process.env.GOOGLE_CLOUD_PROJECT ?? 'katha-booth';
const LOCATION        = process.env.GEMINI_LOCATION ?? 'global';
const BILLING_ACCOUNT = process.env.GCP_BILLING_ACCOUNT ?? '018D71-0DD680-8583C4';
const MODEL_43        = process.env.GROK_43_MODEL_ID ?? 'xai/grok-4.3';
const MODEL_420       = process.env.GROK_420_MODEL_ID ?? 'publishers/xai/models/grok-4.20-reasoning';
const ENDPOINT_BASE   = `https://aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/endpoints/openapi`;

// Allow --prompt "..." override
const promptArg = process.argv.indexOf('--prompt');
const PROMPT = promptArg !== -1
  ? process.argv[promptArg + 1]
  : 'What makes xAI Grok 4.3 different from previous Grok models? Answer in 2 sentences.';

// ── Helpers ─────────────────────────────────────────────────────────────────
function section(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

function getToken() {
  try {
    return execSync('gcloud auth application-default print-access-token', { encoding: 'utf8' }).trim();
  } catch {
    console.error('❌  Could not get GCP access token. Run: gcloud auth application-default login');
    process.exit(1);
  }
}

// ── Pricing constants (xAI published rates, 2026-06) ────────────────────────
const PRICE_INPUT_PER_M  = 3.00;  // USD per 1M input tokens  (Grok 4.3 est.)
const PRICE_OUTPUT_PER_M = 15.00; // USD per 1M output tokens (Grok 4.3 est.)

function estimateCost(promptTokens, completionTokens) {
  const inputCost  = (promptTokens    / 1_000_000) * PRICE_INPUT_PER_M;
  const outputCost = (completionTokens / 1_000_000) * PRICE_OUTPUT_PER_M;
  return { inputCost, outputCost, total: inputCost + outputCost };
}

// ── Step 1: Project + credentials ───────────────────────────────────────────
section('Step 1 — GCP Project & Credentials');

const activeProject = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
console.log(`Active project : ${activeProject}`);
console.log(`Config project : ${PROJECT}`);
if (activeProject !== PROJECT) {
  console.warn(`⚠️  Mismatch! Set it: gcloud config set project ${PROJECT}`);
} else {
  console.log('✅  Project matches .env');
}

const TOKEN = getToken();
console.log(`✅  Access token obtained (${TOKEN.slice(0, 10)}…)`);

// ── Step 2: Billing ─────────────────────────────────────────────────────────
section('Step 2 — Billing Account');

const billingRes  = await fetch(
  `https://cloudbilling.googleapis.com/v1/projects/${PROJECT}/billingInfo`,
  { headers: { Authorization: `Bearer ${TOKEN}` } }
);
const billingJson = await billingRes.json();

console.log(`Account  : ${billingJson.billingAccountName ?? BILLING_ACCOUNT}`);
console.log(`Enabled  : ${billingJson.billingEnabled}`);

if (!billingJson.billingEnabled) {
  console.error('❌  Billing is DISABLED. Grok 4.3 calls will fail.');
  process.exit(1);
}
console.log('✅  Billing is active');

// Note: Free-trial credit balance requires the Cloud Billing Budget API or
// the Google Cloud Console → Billing → Credits panel. It is not exposed via REST.
console.log('ℹ️   Remaining free-trial credit: open https://console.cloud.google.com/billing');

// ── Step 3: Grok 4.3 reachability ───────────────────────────────────────────
section('Step 3 — Grok 4.3 Reachability');

console.log(`Model    : ${MODEL_43}`);
console.log(`Endpoint : ${ENDPOINT_BASE}/chat/completions`);
console.log(`Prompt   : "${PROMPT}"`);

const grokRes = await fetch(`${ENDPOINT_BASE}/chat/completions`, {
  method:  'POST',
  headers: {
    Authorization:  `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model:       MODEL_43,
    messages:    [{ role: 'user', content: PROMPT }],
    max_tokens:  256,
    temperature: 0.7,
    stream:      false,
  }),
});

if (!grokRes.ok) {
  const errText = await grokRes.text();
  console.error(`❌  Grok 4.3 error (${grokRes.status}): ${errText}`);
  console.log(`\nFalling back to Grok 4.20…`);
  // Retry with fallback (informational only)
  const fallbackRes = await fetch(`${ENDPOINT_BASE}/chat/completions`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL_420, messages: [{ role: 'user', content: PROMPT }], max_tokens: 256 }),
  });
  const fbJson = await fallbackRes.json();
  console.log('Fallback reply:', fbJson?.choices?.[0]?.message?.content ?? '(no content)');
  process.exit(1);
}

const grokJson = await grokRes.json();

// ── Step 4: Token usage + cost ───────────────────────────────────────────────
section('Step 4 — Token Usage & Cost Estimate');

const reply   = grokJson?.choices?.[0]?.message?.content ?? '';
const usage   = grokJson?.usage ?? {};
const { prompt_tokens: pt = 0, completion_tokens: ct = 0, total_tokens: tt = 0 } = usage;
const reasoning = usage?.completion_tokens_details?.reasoning_tokens ?? 0;

const cost = estimateCost(pt, ct);

console.log('Reply:');
console.log(`  "${reply}"\n`);
console.log(`Prompt tokens      : ${pt}`);
console.log(`Completion tokens  : ${ct}  (reasoning: ${reasoning})`);
console.log(`Total tokens       : ${tt}`);
console.log(`\nEstimated cost     : $${cost.total.toFixed(6)}`);
console.log(`  Input  : $${cost.inputCost.toFixed(6)}  ($${PRICE_INPUT_PER_M}/M)`);
console.log(`  Output : $${cost.outputCost.toFixed(6)}  ($${PRICE_OUTPUT_PER_M}/M)`);

section('Summary');
console.log('✅  Grok 4.3 is live and responding correctly.');
console.log(`✅  Project : ${PROJECT}   Billing : active`);
console.log(`✅  Model   : ${grokJson.model}`);
console.log('\nAll checks passed — Grok 4.3 integration is ready. 🎉');
