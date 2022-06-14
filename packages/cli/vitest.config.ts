import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['__tests__/**/*-test.{ts,tsx}'],
    globals: true,
    testTimeout: 200_000,
  },
});
