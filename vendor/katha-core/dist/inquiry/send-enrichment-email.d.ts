import type { InquiryPayload, DispatchResult, DateStatus } from './types.js';
export declare function replyPromise(now?: Date): string;
export declare function formatEventDate(iso: string): string;
/** Pure email builder — no I/O, so previews and tests can render it directly. */
export declare function buildEnrichmentEmail(payload: InquiryPayload, galleryLink: string, dateStatus?: DateStatus): {
    subject: string;
    textBody: string;
    htmlBody: string;
};
export declare function sendEnrichmentEmail(payload: InquiryPayload, leadHash: string, galleryLink: string, dateStatus?: DateStatus): Promise<DispatchResult>;
//# sourceMappingURL=send-enrichment-email.d.ts.map