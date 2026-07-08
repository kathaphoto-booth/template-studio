import { NextRequest } from 'next/server';
import { handleInquiry } from '@katha/core';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  return handleInquiry(req, supabaseAdmin, {
    buildGalleryLink: (leadHash: string, baseUrl: string) => `${baseUrl}/gallery?lead=${leadHash}`,
  });
}
