import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { IntakeForm } from '@/components/booking/IntakeForm';

beforeEach(() => { vi.restoreAllMocks(); });

describe('IntakeForm', () => {
  it('shows the contract-terms line with the real numbers', () => {
    render(<IntakeForm date="2026-08-14" slot="evening" tier="signature" onSubmitted={() => {}} />);
    expect(screen.getByText(/\$99 retainer/)).toBeInTheDocument();
    expect(screen.getByText(/14 days before/)).toBeInTheDocument();
  });

  it('blocks submit until the six required fields are present, focusing the first gap', () => {
    render(<IntakeForm date="2026-08-14" slot="evening" tier="signature" onSubmitted={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Request the night/ }));
    // name is first-required; its error appears
    expect(screen.getByText(/your name/i)).toBeInTheDocument();
  });

  it('submits and reports the reference on success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, status: 201, json: async () => ({ ok: true, request_id: 'abc', ref: 'KATHA-abc' }),
    } as Response);
    const onSubmitted = vi.fn();
    render(<IntakeForm date="2026-08-14" slot="evening" tier="signature" onSubmitted={onSubmitted} />);
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
    const { container } = render(<IntakeForm date="2026-08-14" slot="evening" tier="signature" onSubmitted={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
