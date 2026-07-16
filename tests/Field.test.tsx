import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Field } from '@/components/ui/Field';

// Vitest runs without `globals: true`, so @testing-library/react's auto-cleanup
// (which hooks a global afterEach) never registers and rendered trees accumulate
// across tests — duplicate id="phone" then makes getByLabelText resolve the stale
// first input. Register cleanup explicitly. Idempotent if setup.ts also adds it.
afterEach(cleanup);

describe('Field', () => {
  it('associates the visible label with the input', () => {
    render(<Field id="phone" label="Phone" value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Phone');
    expect(input).toBeInTheDocument();
  });

  it('exposes helper and error via aria-describedby', () => {
    render(
      <Field id="phone" label="Phone" value="x" onChange={() => {}}
             helper="For confirming logistics — never marketing." error="Enter a phone we can reach." />,
    );
    const input = screen.getByLabelText('Phone');
    const described = (input.getAttribute('aria-describedby') || '').split(' ');
    expect(described).toContain('phone-helper');
    expect(described).toContain('phone-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('emits the raw string value on change', () => {
    const onChange = vi.fn();
    render(<Field id="names" label="Names" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Names'), { target: { value: 'Ana' } });
    expect(onChange).toHaveBeenCalledWith('Ana');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field id="venue" label="Venue / city" value="" onChange={() => {}} helper="Where's the night?" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
