import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['__tests__/**/*-test.ts'],
    global: true,
  },
});
