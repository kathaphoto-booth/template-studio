// lib/genaiPartner.js
/**
 * Katha Booth — Partner model client (Vertex AI)
 *
 * Calls partner models (e.g., GLM-5 MaaS) through the Gemini Enterprise Agent Platform
 * (Vertex AI) OpenAI-compatible chat/completions endpoint.
 *
 * Environment variables (set in root .env):
 *   GOOGLE_CLOUD_PROJECT  – GCP project ID  (required)
 *   GEMINI_LOCATION       – region/location (default: global)
 *   PARTNER_MODEL_ID      – primary model   (default: zai-org/glm-5-maas)
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

// ─── Load .env from the monorepo root (two levels up from lib/) ───────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../../.env');

if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROJECT   = process.env.GOOGLE_CLOUD_PROJECT ?? '';
const LOCATION  = process.env.GEMINI_LOCATION ?? 'global';
const ENDPOINT  = `https://aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/endpoints/openapi`;

const DEFAULT_MODEL = process.env.PARTNER_MODEL_ID ?? 'zai-org/glm-5-maas';

if (!PROJECT) {
  throw new Error('[genaiPartner] GOOGLE_CLOUD_PROJECT is not set. Check your .env file.');
}

// ─── Token helper ─────────────────────────────────────────────────────────────
/** Obtain an ADC Bearer token via gcloud. Works in local dev and Cloud Run. */
async function getAccessToken() {
  const { execSync } = await import('child_process');
  try {
    return execSync('gcloud auth application-default print-access-token', { encoding: 'utf8' }).trim();
  } catch {
    throw new Error('[genaiPartner] Failed to obtain GCP access token. Run: gcloud auth application-default login');
  }
}

// ─── Billing guard ────────────────────────────────────────────────────────────
/**
 * Check that billing is enabled for the project.
 * Returns true if billing is active, false otherwise.
 */
export async function checkBilling() {
  const token = await getAccessToken();
  const BILLING_ACCOUNT = process.env.GCP_BILLING_ACCOUNT ?? '';

  const res = await fetch(
    `https://cloudbilling.googleapis.com/v1/projects/${PROJECT}/billingInfo`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    console.warn(`[genaiPartner] Billing check failed: ${res.status} ${res.statusText}`);
    return false;
  }

  const info = await res.json();
  const enabled = info.billingEnabled === true;

  if (enabled) {
    console.log(`[genaiPartner] ✅ Billing active — account: ${info.billingAccountName ?? BILLING_ACCOUNT}`);
  } else {
    console.warn(`[genaiPartner] ⚠️  Billing is DISABLED for project ${PROJECT}`);
  }

  return enabled;
}

// ─── Core caller ─────────────────────────────────────────────────────────────
/**
 * Call the partner model via the OpenAI-compatible chat/completions endpoint.
 *
 * @param {string | Array<{role:string, content:string}>} input
 *   A plain string prompt or an array of OpenAI-style message objects.
 * @param {object}  [opts]
 * @param {string}  [opts.model]       - Model ID override (default: PARTNER_MODEL_ID)
 * @param {number}  [opts.maxTokens]   - Max output tokens (default: 512)
 * @param {number}  [opts.temperature] - Sampling temperature (default: 0.7)
 * @param {boolean} [opts.stream]      - Stream the response (default: false)
 * @returns {Promise<string>} The model's text reply.
 */
export async function callPartnerModel(input, opts = {}) {
  const {
    model       = DEFAULT_MODEL,
    maxTokens   = 4096,
    temperature = 0.7,
    stream      = false,
  } = opts;

  const messages = Array.isArray(input)
    ? input
    : [{ role: 'user', content: String(input) }];

  const body = JSON.stringify({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    stream,
  });

  const token = await getAccessToken();

  let response = await fetch(`${ENDPOINT}/chat/completions`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[genaiPartner] API error ${response.status}: ${text}`);
  }

  const json = await response.json();
  const choice = json?.choices?.[0]?.message;
  let content = choice?.content ?? '';
  const reasoning = choice?.reasoning_content;
  
  if (!content && reasoning) {
    content = `[Reasoning]\\n${reasoning}`;
  } else if (content && reasoning) {
    content = `[Reasoning]\\n${reasoning}\\n\\n[Response]\\n${content}`;
  }
  
  if (!content) {
    content = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  // Surface token usage for cost awareness
  const usage = json?.usage;
  if (usage) {
    const { prompt_tokens: p, completion_tokens: c, total_tokens: t } = usage;
    console.log(`[genaiPartner] tokens → prompt: ${p}  completion: ${c}  total: ${t}`);
  }

  return content;
}

// ─── Convenience aliases ──────────────────────────────────────────────────────
/** Call GLM-5 explicitly. */
export const callGLM5 = (input, opts = {}) =>
  callPartnerModel(input, { ...opts, model: 'zai-org/glm-5-maas' });
