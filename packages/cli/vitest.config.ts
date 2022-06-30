import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['tests/**/*-test.{ts,tsx}'],
    globals: true,
    testTimeout: 200_000,
  },
});
