export const LEAD_STATUSES = ["Inquired", "Selected", "In-Design", "Approved"] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];
