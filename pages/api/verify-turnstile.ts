import type { NextApiRequest, NextApiResponse } from 'next';

interface TurnstileResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!token || !secret) {
    return res.status(400).json({ error: 'Missing token or secret' });
  }

  try {
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
      return res.status(400).json({
        error: 'Verification failed',
        details: data.error_codes,
      });
    }

    // Optional: Check score for bot detection
    if (data.score !== undefined && data.score < 0.5) {
      return res.status(429).json({
        error: 'Request blocked: High bot probability',
      });
    }

    res.status(200).json({ success: true, score: data.score });
  } catch (error) {
    console.error('Turnstile verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
