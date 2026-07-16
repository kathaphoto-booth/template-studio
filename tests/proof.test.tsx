import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import ProofClient from '@/app/proof/ProofClient';

describe('/proof — the wedge demonstrates itself', () => {
  it('renders the positioning hero and exactly one gilt CTA', () => {
    render(<ProofClient />);
    expect(
      screen.getByRole('heading', { level: 1, name: /before you ever book/i }),
    ).toBeInTheDocument();
    // The one gilt CTA (law D2) — a link into the real customizer.
    const ctas = screen.getAllByRole('link', { name: /design your print now/i });
    expect(ctas).toHaveLength(1);
    expect(ctas[0]).toHaveAttribute('href', '/template-design');
  });

  it('takes the visitor’s names and date into the live proof', () => {
    render(<ProofClient />);
    const names = screen.getByLabelText('Your names');
    const date = screen.getByLabelText('Your date');
    fireEvent.change(names, { target: { value: 'Ana & Marco' } });
    fireEvent.change(date, { target: { value: 'OCTOBER 3, 2026' } });
    // LivePreview announces itself as a live proof image; the plate carries
    // the template + paper name in its accessible label.
    expect(screen.getByRole('img', { name: /live proof/i })).toBeInTheDocument();
    // The typed inscription lands in the SVG text (jsdom renders SVG <text>).
    expect(screen.getByText('Ana & Marco')).toBeInTheDocument();
    expect(screen.getByText('OCTOBER 3, 2026')).toBeInTheDocument();
  });

  it('offers the print stocks as an accessible listbox and switches paper', () => {
    render(<ProofClient />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(3);
    fireEvent.click(options[1]);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<ProofClient />);
    const results = await axe(container);
    expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
  });
});
