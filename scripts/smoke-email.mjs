#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────────────
// smoke-email — M4 closure check (funnel-audit harness).
//
//   node scripts/smoke-email.mjs                 # DNS posture only
//   node scripts/smoke-email.mjs --send you@x.y  # DNS + one live send
//
// Run after adding the Resend TXT/DKIM records. Step 1 verifies the
// records resolve; step 2 (opt-in) sends ONE real enrichment email from
// the verified domain to the address you name, so deliverability is
// proven end-to-end. Uses RESEND_API_KEY + NOTIFICATION_FROM from .env.
// ──────────────────────────────────────────────────────────────────────
import { promises as dns } from 'node:dns';
import { readFileSync, existsSync } from 'node:fs';

const DOMAIN = 'kathabooth.com';

// minimal .env loader (no deps) — values may be quoted
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)="?([^"\n]*)"?$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  }
}

async function txt(name) {
  try { return (await dns.resolveTxt(name)).map((r) => r.join('')); }
  catch { return []; }
}

// Resend's records live on the `send.` subdomain (SPF TXT + MX); DKIM on
// resend._domainkey; the verification token sits at the root TXT.
const rootTxt = await txt(DOMAIN);
const sendTxt = await txt(`send.${DOMAIN}`);
const dkim = await txt(`resend._domainkey.${DOMAIN}`);
const dmarc = await txt(`_dmarc.${DOMAIN}`);

const verifyOk = rootTxt.some((r) => r.includes('resend-domain-verification'));
const spfOk = [...sendTxt, ...rootTxt].some((r) => r.includes('v=spf1') && (r.includes('resend') || r.includes('amazonses')));
const dkimOk = dkim.some((r) => r.includes('p='));
const dmarcOk = dmarc.some((r) => r.includes('v=DMARC1'));

console.log('── DNS posture for', DOMAIN, '──');
console.log(`VERIFY ${verifyOk ? 'OK' : 'MISSING'}  root resend-domain-verification token`);
console.log(`SPF    ${spfOk ? 'OK' : 'MISSING'}  ${sendTxt.find((r) => r.includes('v=spf1')) ?? rootTxt.find((r) => r.includes('v=spf1')) ?? '(no spf at send. or root)'}`);
console.log(`DKIM   ${dkimOk ? 'OK' : 'MISSING'}  resend._domainkey → ${dkim.length ? 'present' : 'no record'}`);
console.log(`DMARC  ${dmarcOk ? 'OK' : 'recommended'}  ${dmarc[0] ?? '(add TXT _dmarc: "v=DMARC1; p=none;")'}`);

const to = process.argv.includes('--send')
  ? process.argv[process.argv.indexOf('--send') + 1]
  : null;

if (!to) {
  console.log('\nDNS-only run. To prove delivery end-to-end:');
  console.log('  node scripts/smoke-email.mjs --send <address-you-can-read>');
  process.exit(spfOk && dkimOk ? 0 : 1);
}

if (!spfOk || !dkimOk) {
  console.error('\nRefusing to send: SPF/DKIM not resolving yet. Wait for propagation.');
  process.exit(1);
}

loadEnv();
const key = process.env.RESEND_API_KEY;
if (!key) { console.error('RESEND_API_KEY not set.'); process.exit(1); }

const from = process.env.NOTIFICATION_FROM?.includes(DOMAIN)
  ? process.env.NOTIFICATION_FROM
  : `Katha <hello@${DOMAIN}>`;

const { buildEnrichmentEmail } = await import('../vendor/katha-core/dist/index.js');
const { subject, textBody, htmlBody } = buildEnrichmentEmail(
  { client_name: 'Smoke Test', client_email: to, event_date: '2026-10-17', tier_selected: 'Glam Editorial Installation' },
  'https://book.kathabooth.com/gallery?lead=smoketest',
  'open',
);

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ from, to, subject: `[SMOKE] ${subject}`, html: htmlBody, text: textBody }),
});
const body = await res.json();
if (res.ok) {
  console.log(`\nSENT from ${from} → ${to}  (id: ${body.id})`);
  console.log('Check the inbox (not spam). If it lands clean, M4 closes.');
} else {
  console.error('\nSEND FAILED:', JSON.stringify(body));
  process.exit(1);
}
