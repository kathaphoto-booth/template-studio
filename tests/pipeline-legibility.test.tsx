import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PricingTiers } from '@/components/booking/PricingTiers';

const tiers = [
  { key: 'a', name: 'The Strip', price: 850, hours: 3, available: true, blurb: 'The classic.', includes: ['Attendant', 'Prints'] },
  { key: 'b', name: 'The Glam', price: 1200, hours: 4, available: false, unavailableLabel: 'Booked this season' },
] as any;

describe('PricingTiers legibility', () => {
  it('renders the price and hours as essential (token) text, not 8.5px', () => {
    render(<PricingTiers tiers={tiers} onSelect={() => {}} />);
    const hours = screen.getByText(/up to 3 hrs/i);
    // essential meta must not be the old fixed 8.5px
    expect(hours.className).not.toMatch(/text-\[8\.5px\]/);
  });

  it('keeps the unavailable tier legible and labelled', () => {
    render(<PricingTiers tiers={tiers} onSelect={() => {}} />);
    expect(screen.getByText(/Booked this season/)).toBeInTheDocument();
  });
});
