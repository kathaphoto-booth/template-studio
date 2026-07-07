-- Marketing attribution for the entry contract: ?src= slug carried from
-- kathabooth.com CTAs (ss-nav, ss-hero, ss-home-bridge, ss-installations,
-- ss-founders, ss-contact, ss-footer, ss-inquire). Nullable — organic
-- inquiries simply leave it empty. `tier_selected` already exists.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
