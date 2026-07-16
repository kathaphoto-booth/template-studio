import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  // Next.js tsconfig sets jsx: 'preserve' (SWC handles JSX in the app). Vite 8's
  // oxc transform respects that and leaves JSX raw, which rolldown can't parse in
  // component (.tsx) tests. Force the automatic runtime here so the dom project
  // transforms JSX itself. Zero new deps (react/jsx-runtime already present).
  oxc: { jsx: { runtime: 'automatic', importSource: 'react' } },
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'node', include: ['tests/**/*.test.ts'], environment: 'node' },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          include: ['tests/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./tests/setup.ts'],
        },
      },
    ],
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
