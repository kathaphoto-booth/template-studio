import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RegistryCalendar } from '@/components/booking/RegistryCalendar';

const days = [
  { date: '2026-08-14', weekday: 'Fri', slots: [
    { slot: 'afternoon' as const, status: 'open' as const },
    { slot: 'evening' as const, status: 'under_request' as const },
  ] },
  { date: '2026-08-15', weekday: 'Sat', slots: [
    { slot: 'afternoon' as const, status: 'booked' as const },
    { slot: 'evening' as const, status: 'open' as const },
  ] },
];

describe('RegistryCalendar (weekend strip + shelf)', () => {
  it('A2: the nearest requestable night starts expanded; one shelf at a time; picks a slot', () => {
    const onPick = vi.fn();
    render(<RegistryCalendar days={days} selected={null} onPick={onPick} />);
    const fri = screen.getByRole('button', { name: /Aug 14/ });
    expect(fri).toHaveAttribute('aria-expanded', 'true'); // default-open, no click
    const group = screen.getByRole('radiogroup');
    fireEvent.click(within(group).getByRole('radio', { name: /Afternoon/ }));
    expect(onPick).toHaveBeenCalledWith('2026-08-14', 'afternoon');
    // switching to Sat closes Fri — exactly one shelf open
    fireEvent.click(screen.getByRole('button', { name: /Aug 15/ }));
    expect(fri).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('radiogroup')).toHaveLength(1);
  });

  it('A2: a fully-booked first day is never the default expansion', () => {
    const bookedFirst = [
      { date: '2026-08-14', weekday: 'Fri', slots: [
        { slot: 'afternoon' as const, status: 'booked' as const },
        { slot: 'evening' as const, status: 'booked' as const },
      ] },
      ...days.slice(1),
    ];
    render(<RegistryCalendar days={bookedFirst} selected={null} onPick={() => {}} />);
    expect(screen.getByRole('button', { name: /Aug 14/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Aug 15/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders booked slots as disabled radios', () => {
    render(<RegistryCalendar days={days} selected={null} onPick={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Aug 15/ }));
    const group = screen.getByRole('radiogroup');
    expect(within(group).getByRole('radio', { name: /spoken for/i })).toBeDisabled();
  });

  it('has no axe violations with a shelf open', async () => {
    const { container } = render(<RegistryCalendar days={days} selected={null} onPick={() => {}} />);
    // Fri's shelf is already open by default (A2)
    expect(await axe(container)).toHaveNoViolations();
  });
});
