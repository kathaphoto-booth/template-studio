import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function captureTrace() {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Create CDP Session
  const client = await page.context().newCDPSession(page);

  // Capture trace events
  const traceEvents = [];
  client.on('Tracing.dataCollected', (event) => {
    traceEvents.push(...event.value);
  });

  const tracePromise = new Promise((resolve) => {
    client.on('Tracing.tracingComplete', () => {
      resolve(traceEvents);
    });
  });

  console.log('Starting trace...');
  await client.send('Tracing.start', {
    categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,v8.execute,blink.user_timing,latencyInfo,loading,navigation,blink',
    transferMode: 'ReturnAsStream'
  });

  const targetUrl = 'http://localhost:3000/portal/test-portal/template-design';
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'load' });

  // Wait a short time for any post-load renders
  await page.waitForTimeout(2000);

  console.log('Stopping trace...');
  await client.send('Tracing.end');
  const events = await tracePromise;

  console.log(`Collected ${events.length} trace events.`);
  const tracePath = path.resolve('/Users/jedg./Desktop/kat_ha_pb/.agents/worker_m4/trace.json');
  fs.writeFileSync(tracePath, JSON.stringify({ traceEvents: events }, null, 2));
  console.log(`Trace saved to ${tracePath}`);

  await browser.close();

  // Let's analyze the trace events in memory
  console.log('Analyzing trace...');
  
  // Find navigation start
  const navStartEvent = events.find(e => e.name === 'navigationStart' || e.name === 'FrameStartedLoading');
  const firstPaintEvent = events.find(e => e.name === 'firstPaint');
  const fcpEvent = events.find(e => e.name === 'firstContentfulPaint');
  const lcpEvent = events.find(e => e.name === 'largestContentfulPaint::Candidate');

  console.log('Trace Analysis:');
  if (navStartEvent) console.log('Navigation Start ts:', navStartEvent.ts);
  if (firstPaintEvent) console.log('First Paint ts:', firstPaintEvent.ts);
  if (fcpEvent) console.log('FCP ts:', fcpEvent.ts);
  if (lcpEvent) {
    console.log('LCP Candidate event:', lcpEvent);
  } else {
    console.log('No LCP Candidate event found in trace.');
  }
}

captureTrace().catch(err => {
  console.error('Failed to capture trace:', err);
  process.exit(1);
});
