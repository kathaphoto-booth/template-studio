import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { InquiryHandlerOptions } from './types.js';
export declare function handleInquiry(req: NextRequest, supabaseAdmin: SupabaseClient | null, opts: InquiryHandlerOptions): Promise<NextResponse>;
//# sourceMappingURL=handler.d.ts.map