import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomizer } from '@/components/customizer/useCustomizer';

const templates = [{ id: 't1', name: 'Ronaldson', layout: 'strip-3', sName: 'AMARA', sSub: 'OCT' }] as any;
const palettes = [{ key: 'pina', name: 'Piña Ecru', bg: '#F5EFE6', text: '#2A251E' }] as any;

describe('useCustomizer', () => {
  beforeEach(() => localStorage.clear());

  it('starts on step 0 and advances', () => {
    const { result } = renderHook(() => useCustomizer('lead-1', templates, palettes));
    expect(result.current.step).toBe(0);
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
  });

  it('derives an announceable proof sentence from the inscription', () => {
    const { result } = renderHook(() => useCustomizer('lead-1', templates, palettes));
    act(() => result.current.setField('title', 'Ana & Sam'));
    expect(result.current.proofText).toMatch(/Ana & Sam/);
  });

  it('persists a draft that a fresh hook rehydrates', () => {
    const { result, unmount } = renderHook(() => useCustomizer('lead-1', templates, palettes));
    act(() => result.current.setField('venue', 'Long Beach'));
    unmount();
    const { result: r2 } = renderHook(() => useCustomizer('lead-1', templates, palettes));
    expect(r2.current.state.venue).toBe('Long Beach');
  });
});
