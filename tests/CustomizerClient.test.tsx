import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import CustomizerClient from '@/components/customizer/CustomizerClient';

// content.json is imported by the component; jsdom resolves it via the alias.
describe('CustomizerClient (accessible flow)', () => {
  beforeEach(() => localStorage.clear());

  it('renders step 1 with a persistent live proof and a single primary action', () => {
    render(<CustomizerClient leadId="demo" />);
    expect(screen.getByRole('img', { name: /Live proof/ })).toBeInTheDocument();
    // exactly one gilt primary in the action bar
    expect(screen.getByRole('button', { name: /Next/ })).toBeInTheDocument();
  });

  it('advances through steps and reaches Finalize', () => {
    render(<CustomizerClient leadId="demo" />);
    fireEvent.click(screen.getByRole('button', { name: /Next/ })); // plate → paper
    fireEvent.click(screen.getByRole('button', { name: /Next/ })); // paper → inscription
    fireEvent.click(screen.getByRole('button', { name: /Next/ })); // inscription → finalize
    // NOTE: /Finalize/ alone also matches the Stepper's step-4 label button;
    // pin to the ActionBar's exact primary label to keep the query unambiguous.
    expect(screen.getByRole('button', { name: 'Finalize design' })).toBeInTheDocument();
  });

  it('has no axe violations on the first step', async () => {
    const { container } = render(<CustomizerClient leadId="demo" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
