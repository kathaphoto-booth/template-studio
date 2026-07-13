import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Stepper } from '@/components/ui/Stepper';
import { ActionBar } from '@/components/ui/ActionBar';
import { LiveRegion } from '@/components/ui/LiveRegion';
import { announce } from '@/lib/a11y';

const STEPS = [
  { key: 'plate', label: 'Plate' },
  { key: 'paper', label: 'Paper' },
  { key: 'text', label: 'Inscription' },
  { key: 'done', label: 'Finalize' },
];

describe('Stepper', () => {
  it('marks the active step with aria-current', () => {
    render(<Stepper steps={STEPS} current={2} />);
    expect(screen.getByText('Inscription').closest('[aria-current="step"]')).toBeTruthy();
  });
});

describe('ActionBar', () => {
  it('renders one primary and fires it', () => {
    const onPrimary = vi.fn();
    render(<ActionBar primaryLabel="Next" onPrimary={onPrimary} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPrimary).toHaveBeenCalled();
  });

  it('disabled primary does not fire', () => {
    const onPrimary = vi.fn();
    render(<ActionBar primaryLabel="Finalize" onPrimary={onPrimary} primaryDisabled />);
    fireEvent.click(screen.getByRole('button', { name: 'Finalize' }));
    expect(onPrimary).not.toHaveBeenCalled();
  });
});

describe('LiveRegion', () => {
  it('announces messages politely', () => {
    render(<LiveRegion />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    act(() => announce('Preview updated'));
    expect(region).toHaveTextContent('Preview updated');
  });
});
