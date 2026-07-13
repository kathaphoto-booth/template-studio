import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ChoiceCard } from '@/components/ui/ChoiceCard';
import { Swatch } from '@/components/ui/Swatch';
import { SlotChip } from '@/components/ui/SlotChip';

describe('ChoiceCard', () => {
  it('is a button that reports pressed state and fires onSelect', () => {
    const onSelect = vi.fn();
    render(<ChoiceCard selected title="Strip · 3 slots" sub="Classic" onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: /Strip · 3 slots/ });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalled();
  });

  it('disabled card does not fire onSelect', () => {
    const onSelect = vi.fn();
    render(<ChoiceCard selected={false} disabled title="Sold" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Sold/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('Swatch', () => {
  it('names the palette in text (not color-only) and marks selection', async () => {
    const { container } = render(
      <div role="listbox" aria-label="Paper and ink">
        <Swatch selected name="Piña Ecru" bg="#F5EFE6" ink="#2A251E" onSelect={() => {}} />
      </div>,
    );
    expect(screen.getByText('Piña Ecru')).toBeInTheDocument();
    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('SlotChip', () => {
  it('booked chip is visible but disabled', () => {
    const onSelect = vi.fn();
    render(
      <div role="radiogroup" aria-label="Time">
        <SlotChip slot="afternoon" label="Afternoon · spoken for" selected={false} disabled onSelect={onSelect} />
      </div>,
    );
    const chip = screen.getByRole('radio', { name: /Afternoon/ });
    expect(chip).toBeDisabled();
    fireEvent.click(chip);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
