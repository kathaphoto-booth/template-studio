import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Vitest is configured without `globals`, so RTL never sees a global afterEach
// to auto-register its unmount. Without this, renders accumulate across tests
// in a file — which breaks singleton-landmark / duplicate-id axe rules and
// any getBy* that must resolve to one node. Register cleanup explicitly.
afterEach(() => cleanup());
