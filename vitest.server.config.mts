import { defineConfig } from 'vitest/config';

/** Game server tests (Node). The Angular app's tests run with `ng test`. */
export default defineConfig({
  test: {
    include: ['src/server/**/*.test.ts'],
    environment: 'node',
  },
});
