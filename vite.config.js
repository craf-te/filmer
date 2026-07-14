import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  test: {
    globals: true,
  },
});
