import type { SupabaseClient } from '@supabase/supabase-js';
import type { InquiryPayload, DispatchResult } from './types.js';
export declare function recordLead(supabaseAdmin: SupabaseClient | null, payload: InquiryPayload, leadHash: string): Promise<DispatchResult>;
//# sourceMappingURL=record-lead.d.ts.map