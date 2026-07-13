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
  it('opens one shelf at a time and picks a slot', () => {
    const onPick = vi.fn();
    render(<RegistryCalendar days={days} selected={null} onPick={onPick} />);
    const fri = screen.getByRole('button', { name: /Aug 14/ });
    fireEvent.click(fri);
    expect(fri).toHaveAttribute('aria-expanded', 'true');
    const group = screen.getByRole('radiogroup');
    fireEvent.click(within(group).getByRole('radio', { name: /Afternoon/ }));
    expect(onPick).toHaveBeenCalledWith('2026-08-14', 'afternoon');
  });

  it('renders booked slots as disabled radios', () => {
    render(<RegistryCalendar days={days} selected={null} onPick={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Aug 15/ }));
    const group = screen.getByRole('radiogroup');
    expect(within(group).getByRole('radio', { name: /spoken for/i })).toBeDisabled();
  });

  it('has no axe violations with a shelf open', async () => {
    const { container } = render(<RegistryCalendar days={days} selected={null} onPick={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Aug 14/ }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
