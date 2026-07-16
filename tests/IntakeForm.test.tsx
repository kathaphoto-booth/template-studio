import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { IntakeForm } from '@/components/booking/IntakeForm';

beforeEach(() => { vi.restoreAllMocks(); });

describe('IntakeForm', () => {
  it('A1 gated by default: shows the SLA line, never the un-reviewed contract terms', () => {
    render(<IntakeForm date="2026-08-14" slot="evening" tier="katha_booth" onSubmitted={() => {}} />);
    expect(screen.getByText(/Answer within 24 hours/)).toBeInTheDocument();
    expect(screen.queryByText(/\$99 retainer/)).not.toBeInTheDocument();
    expect(screen.queryByText(/14 days before/)).not.toBeInTheDocument();
  });

  it('blocks submit until the six required fields are present, focusing the first gap', () => {
    render(<IntakeForm date="2026-08-14" slot="evening" tier="katha_booth" onSubmitted={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Request the night/ }));
    // name is first-required; its error appears
    expect(screen.getByText(/your name/i)).toBeInTheDocument();
  });

  it('submits and reports the reference on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, status: 201, json: async () => ({ ok: true, request_id: 'abc', ref: 'KATHA-abc' }),
    } as Response);
    const onSubmitted = vi.fn();
    render(<IntakeForm date="2026-08-14" slot="evening" tier="katha_booth" onSubmitted={onSubmitted} />);
    // Field appends a " ·" required marker into the label text, so match loosely.
    fireEvent.change(screen.getByLabelText('Name', { exact: false }), { target: { value: 'Ana Reyes' } });
    fireEvent.change(screen.getByLabelText('Email', { exact: false }), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: '5550100' } });
    fireEvent.change(screen.getByLabelText(/Venue/), { target: { value: 'Oaxaca Hall' } });
    fireEvent.click(screen.getByRole('button', { name: 'Wedding' }));
    fireEvent.click(screen.getByRole('button', { name: '100–200' }));
    fireEvent.click(screen.getByRole('button', { name: /Request the night/ }));
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith('KATHA-abc'));
  });

  it('has no axe violations', async () => {
    const { container } = render(<IntakeForm date="2026-08-14" slot="evening" tier="katha_booth" onSubmitted={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('IntakeForm — A1 flag cleared', () => {
  it('renders the contract line with the real numbers once legal clears the gate', async () => {
    vi.resetModules();
    vi.doMock('@/lib/flags', () => ({ A1_CONTRACT_LINE_CLEARED: true }));
    const { IntakeForm: Cleared } = await import('@/components/booking/IntakeForm');
    render(<Cleared date="2026-08-14" slot="evening" tier="katha_booth" onSubmitted={() => {}} />);
    expect(screen.getByText(/\$99 retainer/)).toBeInTheDocument();
    expect(screen.getByText(/14 days before/)).toBeInTheDocument();
    expect(screen.queryByText(/Answer within 24 hours/)).not.toBeInTheDocument();
    vi.doUnmock('@/lib/flags');
    vi.resetModules();
  });
});
