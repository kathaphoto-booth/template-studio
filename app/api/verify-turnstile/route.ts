import { NextRequest, NextResponse } from 'next/server';

interface TurnstileResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    if (!token || !secret) {
      return NextResponse.json({ error: 'Missing token or secret' }, { status: 400 });
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token }),
      }
    );

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      return NextResponse.json({
        error: 'Verification failed',
        details: data.error_codes,
      }, { status: 400 });
    }

    if (data.score !== undefined && data.score < 0.5) {
      return NextResponse.json({
        error: 'Request blocked: High bot probability',
      }, { status: 429 });
    }

    return NextResponse.json({ success: true, score: data.score }, { status: 200 });
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
